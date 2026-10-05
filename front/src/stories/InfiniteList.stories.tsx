import type { Meta, StoryObj } from "@storybook/react";
import { useMemo } from "react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import {
  InfiniteList,
  type CursorPage,
} from "@/components/InfiniteList";
import { fetchMockUsers } from "@/lib/mockData";
import { paginateMockData } from "@/lib/mockPagination";
import "@/pages/home/InfiniteListPage.css";

type DemoItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
};

const ROW_HEIGHT = 276;
const COLUMNS = 3;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

const fetchItems = async ({
  pageParam,
  signal,
}: {
  pageParam?: string | null;
  signal: AbortSignal;
}): Promise<CursorPage<DemoItem>> => {
  const users = await fetchMockUsers(signal);
  const { items: pageItems, nextCursor } = paginateMockData(users, {
    cursor: pageParam ?? null,
    size: 15,
  });
  const items = pageItems.map((user) => ({
    id: `story-${user.id}`,
    title: user.user_name,
    summary: user.email,
    imageUrl: user.profile_image,
  }));
  return { items, nextCursor };
};

function InfiniteListStory() {
  const queryKey = useMemo(() => ["storybook", "infinite"], []);

  return (
    <MemoryRouter>
      <QueryClientProvider client={createQueryClient()}>
        <Box>
          <Heading size="5">Infinite List</Heading>
          <Text as="p" size="2" color="gray">
            Storybook 환경에서 무한 스크롤 동작을 확인합니다.
          </Text>
          <Box mt="4" style={{ height: "520px" }}>
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
              itemsPerRow={COLUMNS}
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
                                } as React.CSSProperties
                              }
                            >
                              {rowItems.map((item) => (
                                <Card
                                  key={item.id}
                                  className="demo-infinite-card"
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
                              ))}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box
                      className="demo-infinite-grid"
                      style={{ "--demo-columns": COLUMNS } as React.CSSProperties}
                    >
                      {items.map((item) => (
                        <Card key={item.id} className="demo-infinite-card">
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
                      ))}
                    </Box>
                  )}
                  {isLoading && <Text size="2">로딩 중...</Text>}
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
      </QueryClientProvider>
    </MemoryRouter>
  );
}

const meta: Meta<typeof InfiniteListStory> = {
  title: "Data/InfiniteList",
  component: InfiniteListStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "IntersectionObserver + useInfiniteQuery + TanStack Virtual 기반 무한 스크롤 공통 컴포넌트 데모입니다.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof InfiniteListStory>;

export const Usage: Story = {
  render: () => <InfiniteListStory />,
};
