import type { Meta, StoryObj } from "@storybook/react";
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { DialogProvider } from "@/components/dialogs/DialogProvider";
import { resetAlertQueue, useAlert, useConfirm } from "@/components/alerts";

type AlertDemoProps = {
  title: string;
  description: string;
  confirmText: string;
  variant: "info" | "success" | "warning" | "error";
  dismissible: boolean;
  align: "start" | "center";
  size: "1" | "2" | "3" | "4";
};

function AlertDemo({
  title,
  description,
  confirmText,
  variant,
  dismissible,
  align,
  size,
}: AlertDemoProps) {
  const { alert } = useAlert();
  const [lastResult, setLastResult] = useState("아직 실행되지 않았습니다.");

  const handleAlert = async () => {
    const titleValue = title.trim().length ? title : undefined;
    const descriptionValue = description.trim().length
      ? description
      : undefined;

    await alert({
      title: titleValue,
      description: descriptionValue,
      confirmText,
      variant,
      dismissible,
      align,
      size,
      onConfirm: () => setLastResult("확인 버튼을 눌렀습니다."),
    });

    if (!dismissible) return;
    setLastResult((prev) =>
      prev === "확인 버튼을 눌렀습니다." ? prev : "오버레이/ESC로 닫았습니다.",
    );
  };

  return (
    <Box>
      <Heading size="5">Alert</Heading>
      <Text as="p" size="2" color="gray">
        공통 알림 다이얼로그를 호출합니다.
      </Text>
      <Flex mt="4" gap="2" align="center">
        <Button onClick={handleAlert}>알림 열기</Button>
        <Text size="2" color="gray">
          {lastResult}
        </Text>
      </Flex>
    </Box>
  );
}

function AlertStoryWrapper(props: AlertDemoProps) {
  useEffect(() => () => resetAlertQueue(), []);
  return (
    <DialogProvider>
      <AlertDemo {...props} />
    </DialogProvider>
  );
}

function AlertQueueDemo() {
  const { alert } = useAlert();
  const [result, setResult] = useState("아직 실행되지 않았습니다.");

  const handleQueue = async () => {
    setResult("첫 번째 알림 대기 중입니다.");
    alert({
      title: "첫 번째 알림",
      description: "다음 알림은 큐에서 대기합니다.",
      confirmText: "확인",
      onConfirm: () => setResult("첫 번째 알림을 확인했습니다."),
    });

    await alert({
      title: "두 번째 알림",
      description: "첫 번째 알림 이후 순서대로 표시됩니다.",
      confirmText: "확인",
      onConfirm: () => setResult("두 번째 알림을 확인했습니다."),
    });
  };

  return (
    <Box>
      <Heading size="5">Alert Queue</Heading>
      <Text as="p" size="2" color="gray">
        연속 호출로 알림이 큐에 들어가 순서대로 표시됩니다.
      </Text>
      <Flex mt="4" gap="2" align="center">
        <Button onClick={handleQueue}>알림 두 개 열기</Button>
        <Text size="2" color="gray">
          {result}
        </Text>
      </Flex>
    </Box>
  );
}

function AlertQueueStoryWrapper() {
  useEffect(() => () => resetAlertQueue(), []);
  return (
    <DialogProvider>
      <AlertQueueDemo />
    </DialogProvider>
  );
}

const meta: Meta<typeof AlertStoryWrapper> = {
  title: "Overlays/Alert",
  component: AlertStoryWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`useAlert` 훅으로 공통 알림 다이얼로그를 호출합니다. DialogProvider 내부에서 사용하세요.",
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
    confirmText: {
      control: "text",
    },
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "error"],
    },
    dismissible: {
      control: "boolean",
    },
    align: {
      control: "inline-radio",
      options: ["start", "center"],
    },
    size: {
      control: "inline-radio",
      options: ["1", "2", "3", "4"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof AlertStoryWrapper>;
type ConfirmStory = StoryObj<typeof ConfirmStoryWrapper>;

export const Usage: Story = {
  args: {
    title: "알림",
    description: "저장이 완료되었습니다.",
    confirmText: "확인",
    variant: "info",
    dismissible: true,
    align: "center",
    size: "2",
  },
  render: (args) => <AlertStoryWrapper {...args} />,
};

export const NonDismissible: Story = {
  args: {
    title: "알림",
    description: "작업을 완료하려면 확인 버튼을 눌러주세요.",
    confirmText: "확인",
    variant: "warning",
    dismissible: false,
    align: "center",
    size: "2",
  },
  render: (args) => <AlertStoryWrapper {...args} />,
};

export const QueuedAlerts: Story = {
  render: () => <AlertQueueStoryWrapper />,
};

export const StackedAlerts: Story = {
  name: "QueuedAlerts (legacy link)",
  render: () => <AlertQueueStoryWrapper />,
};

type ConfirmDemoProps = {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: "info" | "success" | "warning" | "error";
  dismissible: boolean;
  align: "start" | "center";
  size: "1" | "2" | "3" | "4";
  contentWidth: number;
};

function ConfirmDemo({
  title,
  description,
  confirmText,
  cancelText,
  variant,
  dismissible,
  align,
  size,
  contentWidth,
}: ConfirmDemoProps) {
  const { confirm } = useConfirm();
  const [result, setResult] = useState("아직 실행되지 않았습니다.");

  const handleConfirm = async () => {
    const ok = await confirm({
      title: title.trim().length ? title : undefined,
      description: description.trim().length ? description : undefined,
      confirmText,
      cancelText,
      variant,
      dismissible,
      align,
      size,
      contentWidth,
    });

    setResult(ok ? "확인되었습니다." : "취소되었습니다.");
  };

  return (
    <Box>
      <Heading size="5">Confirm</Heading>
      <Text as="p" size="2" color="gray">
        확인/취소 다이얼로그 예시입니다.
      </Text>
      <Flex mt="4" gap="2" align="center">
        <Button onClick={handleConfirm}>확인 열기</Button>
        <Text size="2" color="gray">
          {result}
        </Text>
      </Flex>
    </Box>
  );
}

function ConfirmStoryWrapper(props: ConfirmDemoProps) {
  return (
    <DialogProvider>
      <ConfirmDemo {...props} />
    </DialogProvider>
  );
}

export const Confirm: ConfirmStory = {
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["info", "success", "warning", "error"],
    },
    cancelText: {
      control: "text",
    },
    contentWidth: {
      control: { type: "number", min: 240, max: 720, step: 20 },
    },
  },
  args: {
    title: "삭제 확인",
    description: "선택한 항목을 삭제할까요?",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "error",
    dismissible: true,
    align: "center",
    size: "2",
    contentWidth: 360,
  },
  render: (args) => <ConfirmStoryWrapper {...args} />,
};
