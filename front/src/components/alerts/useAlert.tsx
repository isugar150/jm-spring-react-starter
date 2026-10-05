import { type ReactNode, useCallback } from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useDialog } from "@/components/dialogs/DialogProvider";

export type AlertOptions = {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  variant?: "info" | "success" | "warning" | "error";
  onConfirm?: () => void;
  dismissible?: boolean;
  align?: "start" | "center";
  size?: "1" | "2" | "3" | "4";
  ariaLabel?: string;
};

type AlertRequest = {
  options: AlertOptions;
  resolve: () => void;
  openDialog: ReturnType<typeof useDialog>["openDialog"];
};

const alertQueue: AlertRequest[] = [];
let isShowing = false;

export const resetAlertQueue = () => {
  alertQueue.length = 0;
  isShowing = false;
};

const drainQueue = () => {
  if (isShowing) return;
  const next = alertQueue.shift();
  if (!next) return;
  isShowing = true;

  let settled = false;
  const resolveOnce = () => {
    if (settled) return;
    settled = true;
    next.resolve();
    isShowing = false;
    drainQueue();
  };

  const titleText =
    typeof next.options.title === "string" ? next.options.title : "알림";
  const sizeWidthMap: Record<NonNullable<AlertOptions["size"]>, number> = {
    "1": 320,
    "2": 380,
    "3": 480,
    "4": 600,
  };
  const sizeWidth = next.options.size
    ? sizeWidthMap[next.options.size]
    : undefined;

  const variant = next.options.variant ?? "info";
  const variantMap = {
    info: { color: "var(--gray-9)", icon: <Info size={16} /> },
    success: { color: "var(--green-9)", icon: <CheckCircle2 size={16} /> },
    warning: { color: "var(--amber-9)", icon: <AlertTriangle size={16} /> },
    error: { color: "var(--red-9)", icon: <XCircle size={16} /> },
  } as const;

  next.openDialog(
    ({ close }) => {
      const handleConfirm = () => {
        next.options.onConfirm?.();
        resolveOnce();
        close();
      };

      return (
        <>
          {next.options.title && (
            <Dialog.Title>
              <Flex align="center" gap="2">
                <span aria-hidden style={{ color: variantMap[variant].color }}>
                  {variantMap[variant].icon}
                </span>
                <span>{next.options.title}</span>
              </Flex>
            </Dialog.Title>
          )}
          {next.options.description && (
            <Dialog.Description>{next.options.description}</Dialog.Description>
          )}
          <Flex gap="2" mt="4" justify="end">
            <Button onClick={handleConfirm}>
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
      contentStyle: sizeWidth
        ? { width: sizeWidth, maxWidth: "calc(100vw - 32px)" }
        : undefined,
      onClose: resolveOnce,
    },
  );
};

export function useAlert() {
  const { openDialog } = useDialog();

  const alert = useCallback(
    (options: AlertOptions) =>
      new Promise<void>((resolve) => {
        alertQueue.push({ options, resolve, openDialog });
        drainQueue();
      }),
    [openDialog],
  );

  return { alert };
}
