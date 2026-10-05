import { useState } from "react";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useDialog } from "@/components/dialogs/DialogProvider";
import api, { getApiErrorMessage } from "@/lib/api";

export default function HomePage() {
  const { openDialog } = useDialog();
  const [tokenTestStatus, setTokenTestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [tokenTestMessage, setTokenTestMessage] = useState("");

  const handleTokenTest = async () => {
    setTokenTestStatus("loading");
    setTokenTestMessage("");
    try {
      const { data } = await api.get<{ valid: boolean; username: string }>(
        "/token/validate",
      );
      setTokenTestStatus("success");
      setTokenTestMessage(`유효한 토큰입니다. 사용자: ${data.username}`);
    } catch (error) {
      setTokenTestStatus("error");
      setTokenTestMessage(getApiErrorMessage(error));
    }
  };

  return (
    <Box>
      <Heading size="5">홈</Heading>
      <Text as="p" size="2" color="gray">
        홈 화면을 준비 중입니다.
      </Text>
      <Flex mt="4">
        <Button
          onClick={() =>
            openDialog(
              ({ close }) => (
                <>
                  <Dialog.Title>테스트 다이얼로그</Dialog.Title>
                  <Dialog.Description>
                    버튼을 눌러 새 다이얼로그를 위에 띄울 수 있습니다.
                  </Dialog.Description>
                  <Flex gap="2" mt="4" justify="end">
                    <Button
                      variant="soft"
                      onClick={() =>
                        openDialog(({ close: closeNext }) => (
                          <>
                            <Dialog.Title>두 번째 다이얼로그</Dialog.Title>
                            <Dialog.Description>
                              기존 다이얼로그 위에 쌓여서 표시됩니다.
                            </Dialog.Description>
                            <Flex gap="2" mt="4" justify="end">
                              <Button variant="soft" onClick={closeNext}>
                                닫기
                              </Button>
                            </Flex>
                          </>
                        ))
                      }
                    >
                      하나 더 열기
                    </Button>
                    <Button onClick={close}>닫기</Button>
                  </Flex>
                </>
              ),
              { size: "3", dismissible: true },
            )
          }
        >
          다이얼로그 테스트
        </Button>
      </Flex>
      <Flex mt="4" direction="column" gap="2">
        <Button
          variant="soft"
          onClick={handleTokenTest}
          disabled={tokenTestStatus === "loading"}
        >
          {tokenTestStatus === "loading"
            ? "토큰 확인 중..."
            : "토큰 유효성 테스트"}
        </Button>
        {tokenTestStatus !== "idle" && (
          <Text size="2" color={tokenTestStatus === "error" ? "red" : "green"}>
            {tokenTestMessage}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
