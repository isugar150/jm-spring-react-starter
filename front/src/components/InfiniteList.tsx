import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from "react";
import { useLocation } from "react-router-dom";
import {
  type QueryFunctionContext,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { useScrollStore } from "@/stores/scrollStore";

export type CursorPage<TItem> = {
  items: TItem[];
  nextCursor: string | null;
};

type VirtualItemMeta = {
  key: string | number | bigint;
  index: number;
  start: number;
  size: number;
};

type VirtualMeta = {
  enabled: boolean;
  total: number;
  totalSize: number;
  items: VirtualItemMeta[];
  measureElement?: (element: Element | null) => void;
  rows?: VirtualItemMeta[];
  itemsPerRow?: number;
};

type InfiniteListRenderProps<TItem> = {
  items: TItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: unknown;
  refetch: () => Promise<unknown>;
  virtual: VirtualMeta;
};

type InfiniteListProps<TItem> = {
  queryKey: QueryKey;
  queryFn: (
    context: QueryFunctionContext<QueryKey, string | null>,
  ) => Promise<CursorPage<TItem>>;
  initialPageParam?: string | null;
  getNextPageParam?: (lastPage: CursorPage<TItem>) => string | undefined | null;
  children: (props: InfiniteListRenderProps<TItem>) => React.ReactNode;
  enabled?: boolean;
  prefetchOffset?: number;
  className?: string;
  style?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  scrollKey?: string;
  virtualize?: boolean;
  itemHeight?: number;
  overscan?: number;
  itemsPerRow?: number;
};

const buildScrollKey = (pathname: string, search: string, queryKey: QueryKey) => {
  const key = JSON.stringify(queryKey);
  return `${pathname}${search}::${key}`;
};

export function InfiniteList<TItem>({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
  children,
  enabled = true,
  prefetchOffset = 700,
  className,
  style,
  containerClassName,
  containerStyle,
  scrollKey,
  virtualize = false,
  itemHeight = 64,
  overscan = 6,
  itemsPerRow = 1,
}: InfiniteListProps<TItem>) {
  const location = useLocation();
  const setPosition = useScrollStore((state) => state.setPosition);
  const getPosition = useScrollStore((state) => state.getPosition);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoreInitRef = useRef(false);
  const pendingFetchRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastEntryRef = useRef<IntersectionObserverEntry | null>(null);
  const hasUserScrolledRef = useRef(false);
  const scrollSeqRef = useRef(0);
  const lastFetchSeqRef = useRef(-1);
  const lastRequestedCursorRef = useRef<string | null>(null);
  const awaitingUserScrollRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const restoreTargetRef = useRef<number | null>(null);

  const [resolvedScrollKey] = useState(() =>
    scrollKey ?? buildScrollKey(location.pathname, location.search, queryKey),
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: initialPageParam ?? null,
    getNextPageParam: (lastPage) =>
      getNextPageParam ? getNextPageParam(lastPage) : lastPage.nextCursor,
    enabled,
  });

  const items = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.items),
    [data?.pages],
  );

  const nextCursor = useMemo(() => {
    if (!data?.pages?.length) return null;
    return data.pages[data.pages.length - 1]?.nextCursor ?? null;
  }, [data?.pages]);

  const triggerFetchNextPage = useCallback(
    (markScrollSeq = false, allowAwaitingBypass = false) => {
    if (!hasNextPage || isFetchingNextPage || pendingFetchRef.current) return;
    if (awaitingUserScrollRef.current && !allowAwaitingBypass) return;
    if (!nextCursor) return;
    if (lastRequestedCursorRef.current === nextCursor) return;
    pendingFetchRef.current = true;
    lastRequestedCursorRef.current = nextCursor;
    awaitingUserScrollRef.current = true;
    if (markScrollSeq) {
      lastFetchSeqRef.current = scrollSeqRef.current;
    }
    void fetchNextPage()
      .catch(() => {
        lastRequestedCursorRef.current = null;
        awaitingUserScrollRef.current = false;
      })
      .finally(() => {
        pendingFetchRef.current = false;
      });
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, nextCursor]);

  useLayoutEffect(() => {
    if (restoreInitRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const targetTop = getPosition(resolvedScrollKey);
    restoreInitRef.current = true;
    if (targetTop <= 0) {
      restoreTargetRef.current = null;
      return;
    }
    restoreTargetRef.current = targetTop;
    container.scrollTop = targetTop;
  }, [getPosition, resolvedScrollKey]);

  useEffect(() => {
    const container = containerRef.current;
    const targetTop = restoreTargetRef.current;
    if (!container || targetTop == null || containerHeight === 0) return;
    const maxScrollable = Math.max(0, container.scrollHeight - container.clientHeight);
    if (maxScrollable < targetTop && hasNextPage && !isFetchingNextPage) {
      triggerFetchNextPage(false, true);
      return;
    }
    container.scrollTop = Math.min(targetTop, maxScrollable);
    restoreTargetRef.current = null;
  }, [
    containerHeight,
    items.length,
    hasNextPage,
    isFetchingNextPage,
    triggerFetchNextPage,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      hasUserScrolledRef.current = true;
      scrollSeqRef.current += 1;
      const currentTop = container.scrollTop;
      const delta = currentTop - lastScrollTopRef.current;
      lastScrollTopRef.current = currentTop;
      if (delta > 0) {
        awaitingUserScrollRef.current = false;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPosition(resolvedScrollKey, container.scrollTop);
        const distanceToBottom =
          container.scrollHeight - (container.scrollTop + container.clientHeight);
        if (enabled && distanceToBottom <= prefetchOffset) {
          triggerFetchNextPage(true);
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const currentTop = container.scrollTop;
      const storedTop = getPosition(resolvedScrollKey);
      if (currentTop > 0 || storedTop === 0) {
        setPosition(resolvedScrollKey, currentTop);
      }
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    enabled,
    getPosition,
    prefetchOffset,
    resolvedScrollKey,
    setPosition,
    triggerFetchNextPage,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setContainerHeight(container.clientHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useIntersectionObserver({
    target: sentinelRef,
    root: containerRef,
    rootMargin: `0px 0px ${prefetchOffset}px 0px`,
    enabled: enabled && !!hasNextPage,
    onIntersect: (entry) => {
      lastEntryRef.current = entry;
      if (!hasUserScrolledRef.current) return;
      if (scrollSeqRef.current === lastFetchSeqRef.current) return;
      triggerFetchNextPage(true);
    },
  });

  const rowVirtualizer = useVirtualizer({
    count:
      virtualize && itemsPerRow > 1
        ? Math.ceil(items.length / itemsPerRow)
        : items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  let virtualMeta: VirtualMeta;
  if (!virtualize || itemHeight <= 0) {
    virtualMeta = {
      enabled: false,
      total: items.length,
      totalSize: 0,
      items: [],
    };
  } else {
    const virtualItems = rowVirtualizer.getVirtualItems();
    const total = items.length;
    const totalSize = rowVirtualizer.getTotalSize();
    if (itemsPerRow > 1) {
      virtualMeta = {
        enabled: true,
        total,
        totalSize,
        items: [],
        rows: virtualItems.map((item) => ({
          key: item.key,
          index: item.index,
          start: item.start,
          size: item.size,
        })),
        measureElement: rowVirtualizer.measureElement,
        itemsPerRow,
      };
    } else {
      virtualMeta = {
        enabled: true,
        total,
        totalSize,
        items: virtualItems.map((item) => ({
          key: item.key,
          index: item.index,
          start: item.start,
          size: item.size,
        })),
        measureElement: rowVirtualizer.measureElement,
      };
    }
  }

  return (
    <div className={className} style={{ height: "100%", ...style }}>
      <div
        ref={containerRef}
        className={containerClassName}
        style={{
          overflow: "auto",
          height: "100%",
          ...containerStyle,
        }}
      >
        {children({
          items,
          isLoading,
          isFetchingNextPage,
          hasNextPage: Boolean(hasNextPage),
          error,
          refetch,
          virtual: virtualMeta,
        })}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
