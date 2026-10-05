import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";

export default function InfiniteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Heading size="5">상세 페이지</Heading>
      <Text as="p" size="2" color="gray">
        리스트에서 클릭한 항목의 상세입니다.
      </Text>

      <Box mt="4">
        <Text size="2">아이디: {id}</Text>
      </Box>

      <Flex mt="4" gap="2">
        <Button variant="soft" onClick={() => navigate(-1)}>
          뒤로 가기
        </Button>
        <Button onClick={() => navigate("/infinite")}>리스트로 이동</Button>
      </Flex>
    </Box>
  );
}
