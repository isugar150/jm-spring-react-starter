import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { ToastProvider, useToast } from "@/components/toasts";

type ToastDemoProps = {
  title: string;
  description: string;
  duration: number;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

function ToastDemo({ title, description, duration }: ToastDemoProps) {
  const { toast, clear } = useToast();

  const handleToast = (variant: "info" | "success" | "warning" | "error") => {
    toast({
      title: title.trim().length ? title : "알림",
      description: description.trim().length ? description : undefined,
      variant,
      duration,
    });
  };

  return (
    <Box>
      <Heading size="5">Toast</Heading>
      <Text as="p" size="2" color="gray">
        Radix Toast 공통 모듈 예시입니다.
      </Text>
      <Flex mt="4" gap="2" wrap="wrap">
        <Button onClick={() => handleToast("info")}>Info</Button>
        <Button color="green" onClick={() => handleToast("success")}>
          Success
        </Button>
        <Button color="amber" onClick={() => handleToast("warning")}>
          Warning
        </Button>
        <Button color="red" onClick={() => handleToast("error")}>Error</Button>
        <Button variant="soft" onClick={clear}>
          모두 닫기
        </Button>
      </Flex>
    </Box>
  );
}

function ToastStoryWrapper(props: ToastDemoProps) {
  return (
    <ToastProvider position={props.position}>
      <div
        style={{
          minHeight: "calc(100vh - 48px)",
          backgroundColor: "#f2f2f2",
          padding: 24,
          borderRadius: 12,
        }}
      >
        <ToastDemo {...props} />
      </div>
    </ToastProvider>
  );
}

const meta: Meta<typeof ToastStoryWrapper> = {
  title: "Overlays/Toast",
  component: ToastStoryWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "`useToast` 훅으로 토스트 알림을 표시합니다.",
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    duration: {
      control: { type: "number", min: 0, max: 10000, step: 250 },
    },
    position: {
      control: "inline-radio",
      options: ["top-left", "top-right", "bottom-left", "bottom-right"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ToastStoryWrapper>;

export const Usage: Story = {
  args: {
    title: "알림",
    description: "저장이 완료되었습니다.",
    duration: 3500,
    position: "top-left",
  },
  render: (args) => <ToastStoryWrapper {...args} />,
};
