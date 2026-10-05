import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container size="2" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <Flex direction="column" gap="4" align="center">
        <Heading size="8">404</Heading>
        <Text color="gray" align="center">
          요청하신 페이지를 찾을 수 없습니다.
        </Text>

        <Flex gap="3">
          <Button asChild>
            <Link to="/">홈으로</Link>
          </Button>

          <Button variant="soft" color="gray" onClick={() => history.back()}>
            이전 페이지
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
