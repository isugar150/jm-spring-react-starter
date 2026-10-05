import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type UseIntersectionObserverParams = {
  target: RefObject<Element | null>;
  root?: RefObject<Element | null>;
  onIntersect: (entry: IntersectionObserverEntry) => void;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
};

export function useIntersectionObserver({
  target,
  root,
  onIntersect,
  rootMargin = "0px 0px 700px 0px",
  threshold = 0,
  enabled = true,
}: UseIntersectionObserverParams) {
  const onIntersectRef = useRef(onIntersect);
  const [observedTarget, setObservedTarget] = useState<Element | null>(null);
  const [observedRoot, setObservedRoot] = useState<Element | null>(null);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useLayoutEffect(() => {
    const nextTarget = target.current ?? null;
    const nextRoot = root?.current ?? null;
    if (nextTarget !== observedTarget) {
      setObservedTarget(nextTarget);
    }
    if (nextRoot !== observedRoot) {
      setObservedRoot(nextRoot);
    }
  }, [observedRoot, observedTarget, root, target]);

  useEffect(() => {
    if (!enabled) return;
    if (!observedTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          onIntersectRef.current(entry);
        }
      },
      {
        root: observedRoot,
        rootMargin,
        threshold,
      },
    );

    observer.observe(observedTarget);
    return () => observer.disconnect();
  }, [
    enabled,
    observedRoot,
    observedTarget,
    rootMargin,
    threshold,
  ]);
}
