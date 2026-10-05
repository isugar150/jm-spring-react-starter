import { type ReactNode, useCallback } from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useDialog } from "@/components/dialogs/DialogProvider";

export type ConfirmOptions = {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "success" | "warning" | "error";
  confirmColor?: "red" | "blue" | "green" | "amber" | "gray" | "indigo";
  onConfirm?: () => void;
  onCancel?: () => void;
  dismissible?: boolean;
  align?: "start" | "center";
  size?: "1" | "2" | "3" | "4";
  contentWidth?: string | number;
  ariaLabel?: string;
};

type ConfirmRequest = {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
  openDialog: ReturnType<typeof useDialog>["openDialog"];
};

const confirmQueue: ConfirmRequest[] = [];
let isShowing = false;

const drainQueue = () => {
  if (isShowing) return;
  const next = confirmQueue.shift();
  if (!next) return;
  isShowing = true;

  let settled = false;
  const resolveOnce = (value: boolean) => {
    if (settled) return;
    settled = true;
    next.resolve(value);
    isShowing = false;
    drainQueue();
  };

  const titleText =
    typeof next.options.title === "string" ? next.options.title : "확인";

  const sizeWidthMap: Record<NonNullable<ConfirmOptions["size"]>, number> = {
    "1": 320,
    "2": 380,
    "3": 480,
    "4": 600,
  };
  const sizeWidth = next.options.size
    ? sizeWidthMap[next.options.size]
    : undefined;

  const variant = next.options.variant ?? "info";
  const variantColorMap: Record<
    NonNullable<ConfirmOptions["variant"]>,
    NonNullable<ConfirmOptions["confirmColor"]>
  > = {
    info: "gray",
    success: "green",
    warning: "amber",
    error: "red",
  };
  const resolvedConfirmColor =
    next.options.confirmColor ?? variantColorMap[variant];
  const variantIconMap = {
    info: { color: "var(--gray-9)", icon: <Info size={16} /> },
    success: { color: "var(--green-9)", icon: <CheckCircle2 size={16} /> },
    warning: { color: "var(--amber-9)", icon: <AlertTriangle size={16} /> },
    error: { color: "var(--red-9)", icon: <XCircle size={16} /> },
  } as const;

  next.openDialog(
    ({ close }) => {
      const handleConfirm = () => {
        next.options.onConfirm?.();
        resolveOnce(true);
        close();
      };

      const handleCancel = () => {
        next.options.onCancel?.();
        resolveOnce(false);
        close();
      };

      return (
        <>
          {next.options.title && (
            <Dialog.Title>
              <Flex align="center" gap="2">
                <span
                  aria-hidden
                  style={{ color: variantIconMap[variant].color }}
                >
                  {variantIconMap[variant].icon}
                </span>
                <span>{next.options.title}</span>
              </Flex>
            </Dialog.Title>
          )}
          {next.options.description && (
            <Dialog.Description>{next.options.description}</Dialog.Description>
          )}
          <Flex gap="2" mt="4" justify="end">
            <Button variant="soft" onClick={handleCancel}>
              {next.options.cancelText ?? "취소"}
            </Button>
            <Button color={resolvedConfirmColor} onClick={handleConfirm}>
              {next.options.confirmText ?? "확인"}
            </Button>
          </Flex>
        </>
      );
    },
    {
      dismissible: next.options.dismissible ?? true,
      align: next.options.align ?? "center",
      size: next.options.size ?? "2",
      ariaLabel: next.options.ariaLabel ?? titleText,
      contentStyle: next.options.contentWidth
        ? { width: next.options.contentWidth }
        : sizeWidth
          ? { width: sizeWidth, maxWidth: "calc(100vw - 32px)" }
          : undefined,
      onClose: () => resolveOnce(false),
    },
  );
};

export function useConfirm() {
  const { openDialog } = useDialog();

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        confirmQueue.push({ options, resolve, openDialog });
        drainQueue();
      }),
    [openDialog],
  );

  return { confirm };
}
