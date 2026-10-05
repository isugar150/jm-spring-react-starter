import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import {
  DialogProvider,
  useDialog,
} from "@/components/dialogs/DialogProvider";

type DialogDemoProps = {
  overlayBaseOpacity: number;
  overlayStep: number;
  overlayMinOpacity: number;
  dismissible: boolean;
};

function DialogDemo({
  overlayBaseOpacity,
  overlayStep,
  overlayMinOpacity,
  dismissible,
}: DialogDemoProps) {
  return (
    <DialogProvider
      overlayBaseOpacity={overlayBaseOpacity}
      overlayStep={overlayStep}
      overlayMinOpacity={overlayMinOpacity}
    >
      <DialogDemoContent dismissible={dismissible} />
    </DialogProvider>
  );
}

function DialogDemoContent({ dismissible }: { dismissible: boolean }) {
  const { openDialog } = useDialog();

  return (
    <Box>
      <Heading size="5">Dialog Stack Demo</Heading>
      <Text as="p" size="2" color="gray">
        다이얼로그를 여러 번 호출하면 스택으로 쌓입니다.
      </Text>
      <Flex mt="4" gap="2">
        <Button
          onClick={() =>
            openDialog(
              ({ close }) => (
                <>
                  <Dialog.Title>첫 번째 다이얼로그</Dialog.Title>
                  <Dialog.Description>
                    다음 다이얼로그를 열어서 스택을 확인하세요.
                  </Dialog.Description>
                  <Flex gap="2" mt="4" justify="end">
                    <Button
                      variant="soft"
                      onClick={() =>
                        openDialog(({ close: closeNext }) => (
                          <>
                            <Dialog.Title>두 번째 다이얼로그</Dialog.Title>
                            <Dialog.Description>
                              오버레이 투명도가 단계별로 달라집니다.
                            </Dialog.Description>
                            <Flex gap="2" mt="4" justify="end">
                              <Button
                                variant="soft"
                                onClick={() =>
                                  openDialog(({ close: closeThird }) => (
                                    <>
                                      <Dialog.Title>세 번째 다이얼로그</Dialog.Title>
                                      <Dialog.Description>
                                        최상단만 포커스 트랩과 ESC 닫힘이
                                        동작합니다.
                                      </Dialog.Description>
                                      <Flex gap="2" mt="4" justify="end">
                                        <Button variant="soft" onClick={closeThird}>
                                          닫기
                                        </Button>
                                      </Flex>
                                    </>
                                  ))
                                }
                              >
                                하나 더 열기
                              </Button>
                              <Button onClick={closeNext}>닫기</Button>
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
              { size: "3", dismissible },
            )
          }
        >
          다이얼로그 열기
        </Button>
      </Flex>
    </Box>
  );
}

const meta: Meta<typeof DialogDemo> = {
  title: "Overlays/Dialog",
  component: DialogDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "컨텍스트 기반 다이얼로그 스택 예시입니다. `openDialog`로 다이얼로그를 열고, 중첩 호출 시 스택으로 쌓입니다.\n\n```tsx\nconst { openDialog } = useDialog();\nopenDialog(({ close }) => (\n  <>\n    <Dialog.Title>제목</Dialog.Title>\n    <Dialog.Description>설명</Dialog.Description>\n    <Button onClick={close}>닫기</Button>\n  </>\n));\n```\n",
      },
    },
  },
  argTypes: {
    overlayBaseOpacity: {
      control: { type: "number", min: 0, max: 1, step: 0.02 },
    },
    overlayStep: {
      control: { type: "number", min: 0, max: 0.3, step: 0.02 },
    },
    overlayMinOpacity: {
      control: { type: "number", min: 0, max: 0.5, step: 0.02 },
    },
    dismissible: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DialogDemo>;

export const Usage: Story = {
  args: {
    overlayBaseOpacity: 0.32,
    overlayStep: 0.08,
    overlayMinOpacity: 0.1,
    dismissible: true,
  },
  render: (args) => <DialogDemo {...args} />,
};

export const NonDismissible: Story = {
  args: {
    overlayBaseOpacity: 0.32,
    overlayStep: 0.08,
    overlayMinOpacity: 0.1,
    dismissible: false,
  },
  render: (args) => <DialogDemo {...args} />,
};
