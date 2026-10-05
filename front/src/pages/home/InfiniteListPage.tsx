import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import { InfiniteList, type CursorPage } from "@/components/InfiniteList";
import { fetchMockUsers } from "@/lib/mockData";
import { paginateMockData } from "@/lib/mockPagination";
import "./InfiniteListPage.css";

type DemoItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
};

type ItemsResponse = CursorPage<DemoItem>;
const ROW_HEIGHT = 276;

const DemoCard = memo(function DemoCard({
  item,
  onNavigate,
}: {
  item: DemoItem;
  onNavigate: (id: string) => void;
}) {
  const handleClick = useCallback(() => {
    onNavigate(item.id);
  }, [item.id, onNavigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onNavigate(item.id);
      }
    },
    [item.id, onNavigate],
  );

  return (
    <Card
      className="demo-infinite-card"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src={item.imageUrl}
          alt={`${item.title} 프로필`}
          className="demo-infinite-image"
          loading="lazy"
          decoding="async"
          width="320"
          height="160"
        />
      </Inset>
      <Flex direction="column" gap="2" p="3">
        <Flex direction="column" align="start" gap="1">
          <Text size="2" weight="medium">
            {item.title}
          </Text>
          <Text size="1" color="gray">
            {item.summary}
          </Text>
        </Flex>
        <Text size="1" color="gray">
          상세 →
        </Text>
      </Flex>
    </Card>
  );
});

const fetchItems = async ({
  pageParam,
  signal,
}: {
  pageParam?: string | null;
  signal: AbortSignal;
}): Promise<ItemsResponse> => {
  const users = await fetchMockUsers(signal);
  const { items: pageItems, nextCursor } = paginateMockData(users, {
    cursor: pageParam ?? null,
    size: 15,
  });
  const items = pageItems.map((user) => ({
    id: String(user.id),
    title: user.user_name,
    summary: user.email,
    imageUrl: user.profile_image,
  }));
  return { items, nextCursor };
};

export default function InfiniteListPage() {
  const navigate = useNavigate();
  const queryKey = useMemo(() => ["items", "infinite-demo"], []);
  const [columns, setColumns] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 2,
  );
  const handleNavigate = useCallback(
    (id: string) => {
      navigate(`/infinite/${id}`);
    },
    [navigate],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateColumns = () => setColumns(mediaQuery.matches ? 3 : 2);
    updateColumns();
    mediaQuery.addEventListener("change", updateColumns);
    return () => mediaQuery.removeEventListener("change", updateColumns);
  }, []);

  return (
    <Box>
      <Heading size="5">무한 스크롤 데모</Heading>
      <Text as="p" size="2" color="gray">
        리스트를 클릭하면 상세로 이동하고, 뒤로 가기 시 스크롤이 복원됩니다.
      </Text>

      <Box mt="4" style={{ height: "70vh", minHeight: "520px" }}>
        <InfiniteList
          queryKey={queryKey}
          queryFn={({ pageParam, signal }) =>
            fetchItems({ pageParam: pageParam ?? null, signal })
          }
          initialPageParam={null}
          prefetchOffset={1200}
          virtualize
          itemHeight={ROW_HEIGHT}
          overscan={12}
          itemsPerRow={columns}
          containerClassName="demo-infinite-container"
          containerStyle={{
            border: "1px solid var(--gray-a4)",
            borderRadius: "12px",
            background: "var(--gray-a2)",
          }}
        >
          {({
            items,
            isLoading,
            isFetchingNextPage,
            hasNextPage,
            error,
            virtual,
          }) => (
            <Flex direction="column" gap="4" style={{ padding: "12px" }}>
              {virtual.enabled && virtual.rows ? (
                <Box
                  style={{
                    height: virtual.totalSize,
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {virtual.rows.map((row) => {
                    const startIndex = row.index * (virtual.itemsPerRow ?? 1);
                    const rowItems = items.slice(
                      startIndex,
                      startIndex + (virtual.itemsPerRow ?? 1),
                    );
                    return (
                      <Box
                        key={row.key}
                        data-index={row.index}
                        ref={virtual.measureElement}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: ROW_HEIGHT,
                          boxSizing: "border-box",
                          paddingBottom: "16px",
                          transform: `translateY(${row.start}px)`,
                        }}
                      >
                        <Box
                          className="demo-infinite-grid"
                          style={
                            {
                              "--demo-columns": virtual.itemsPerRow ?? 2,
                            } as CSSProperties
                          }
                        >
                          {rowItems.map((item) => (
                            <DemoCard
                              key={item.id}
                              item={item}
                              onNavigate={handleNavigate}
                            />
                          ))}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box
                  className="demo-infinite-grid"
                  style={{ "--demo-columns": columns } as CSSProperties}
                >
                  {items.map((item) => (
                    <DemoCard
                      key={item.id}
                      item={item}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </Box>
              )}

              {isLoading && <Text size="2">로딩 중...</Text>}
              {Boolean(error) && (
                <Text size="2" color="red">
                  데이터를 불러오지 못했습니다.
                </Text>
              )}
              {isFetchingNextPage && <Text size="2">추가 로딩 중...</Text>}
              {!hasNextPage && items.length > 0 && (
                <Text size="1" color="gray">
                  모든 항목을 불러왔습니다.
                </Text>
              )}
            </Flex>
          )}
        </InfiniteList>
      </Box>
    </Box>
  );
}
