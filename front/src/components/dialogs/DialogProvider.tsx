/* eslint-disable react-refresh/only-export-components, react-hooks/refs */
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog } from "@radix-ui/themes";

type DialogRender = (params: { id: string; close: () => void }) => ReactNode;

type DialogOptions = {
  dismissible?: boolean;
  align?: "start" | "center";
  size?: "1" | "2" | "3" | "4";
  onClose?: () => void;
  ariaLabel?: string;
  contentStyle?: CSSProperties;
};

type DialogItem = {
  id: string;
  render: DialogRender;
  options?: DialogOptions;
};

type DialogContextValue = {
  openDialog: (render: DialogRender, options?: DialogOptions) => string;
  closeDialog: (id: string) => void;
  closeTopDialog: () => void;
  dialogs: DialogItem[];
};

const DialogContext = createContext<DialogContextValue | null>(null);

const createDialogId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `dialog_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

type DialogProviderProps = {
  children: ReactNode;
  overlayBaseOpacity?: number;
  overlayStep?: number;
  overlayMinOpacity?: number;
};

export function DialogProvider({
  children,
  overlayBaseOpacity = 0.32,
  overlayStep = 0.08,
  overlayMinOpacity = 0.1,
}: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);
  const scrollLockCount = useRef(0);
  const previousBodyOverflow = useRef<string>("");

  const openDialog = useCallback(
    (render: DialogRender, options?: DialogOptions) => {
      const id = createDialogId();
      setDialogs((prev) => [...prev, { id, render, options }]);
      return id;
    },
    [],
  );

  const closeDialog = useCallback((id: string) => {
    setDialogs((prev) => {
      const next = prev.filter((dialog) => dialog.id !== id);
      const removed = prev.find((dialog) => dialog.id === id);
      if (removed?.options?.onClose) removed.options.onClose();
      return next;
    });
  }, []);

  const closeTopDialog = useCallback(() => {
    setDialogs((prev) => {
      const next = prev.slice(0, -1);
      const removed = prev.at(-1);
      if (removed?.options?.onClose) removed.options.onClose();
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (dialogs.length > 0 && scrollLockCount.current === 0) {
      previousBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      scrollLockCount.current = 1;
      return;
    }

    if (dialogs.length === 0 && scrollLockCount.current === 1) {
      document.body.style.overflow = previousBodyOverflow.current;
      scrollLockCount.current = 0;
    }
  }, [dialogs.length]);

  const value = useMemo(
    () => ({
      openDialog,
      closeDialog,
      closeTopDialog,
      dialogs,
    }),
    [openDialog, closeDialog, closeTopDialog, dialogs],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <DialogLayer
        dialogs={dialogs}
        closeDialog={closeDialog}
        overlayBaseOpacity={overlayBaseOpacity}
        overlayStep={overlayStep}
        overlayMinOpacity={overlayMinOpacity}
      />
    </DialogContext.Provider>
  );
}

function DialogLayer({
  dialogs,
  closeDialog,
  overlayBaseOpacity,
  overlayStep,
  overlayMinOpacity,
}: {
  dialogs: DialogItem[];
  closeDialog: (id: string) => void;
  overlayBaseOpacity: number;
  overlayStep: number;
  overlayMinOpacity: number;
}) {
  return (
    <>
      {dialogs.map((dialog, index) => {
        const isTop = index === dialogs.length - 1;
        const dismissible = dialog.options?.dismissible ?? true;
        const depthFromTop = dialogs.length - 1 - index;
        const overlayOpacity = Math.max(
          overlayMinOpacity,
          overlayBaseOpacity - depthFromTop * overlayStep,
        );
        const contentStyle: CSSProperties = {
          ...(dialog.options?.contentStyle ?? {}),
        };
        if (!contentStyle.width && dialog.options?.size) {
          const sizeWidthMap: Record<NonNullable<DialogOptions["size"]>, number> =
            {
              "1": 320,
              "2": 380,
              "3": 480,
              "4": 600,
            };
          const widthPx = sizeWidthMap[dialog.options.size];
          contentStyle.width = `min(${widthPx}px, calc(100vw - 32px))`;
        }

        return (
          <DialogPortalContainer
            key={dialog.id}
            overlayOpacity={overlayOpacity}
            zIndex={1000 + index}
          >
            {(container) => (
              <Dialog.Root
                open
                onOpenChange={(open) => {
                  if (!open) closeDialog(dialog.id);
                }}
              >
                <Dialog.Content
                  container={container}
                  align={dialog.options?.align}
                  size={dialog.options?.size}
                  aria-label={dialog.options?.ariaLabel}
                  aria-hidden={!isTop}
                  onOpenAutoFocus={(event) => {
                    if (!isTop) event.preventDefault();
                  }}
                  onCloseAutoFocus={(event) => {
                    if (!isTop) event.preventDefault();
                  }}
                  onEscapeKeyDown={(event) => {
                    if (!isTop || !dismissible) event.preventDefault();
                  }}
                  onPointerDownOutside={(event) => {
                    if (!isTop || !dismissible) event.preventDefault();
                  }}
                  onInteractOutside={(event) => {
                    if (!isTop || !dismissible) event.preventDefault();
                  }}
                  style={{
                    pointerEvents: isTop ? "auto" : "none",
                    ...contentStyle,
                  }}
                >
                  {dialog.render({
                    id: dialog.id,
                    close: () => closeDialog(dialog.id),
                  })}
                </Dialog.Content>
              </Dialog.Root>
            )}
          </DialogPortalContainer>
        );
      })}
    </>
  );
}

function DialogPortalContainer({
  overlayOpacity,
  zIndex,
  children,
}: {
  overlayOpacity: number;
  zIndex: number;
  children: (container: HTMLElement) => ReactNode;
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  if (!containerRef.current && typeof document !== "undefined") {
    containerRef.current = document.createElement("div");
  }

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof document === "undefined") return;
    node.style.setProperty(
      "--color-overlay",
      `rgba(0, 0, 0, ${overlayOpacity})`,
    );
    node.style.position = "relative";
    node.style.zIndex = String(zIndex);
    if (!node.isConnected) {
      document.body.appendChild(node);
    }

    return () => {
      if (node.isConnected) {
        node.remove();
      }
    };
  }, [overlayOpacity, zIndex]);

  if (!containerRef.current) return null;

  return <>{children(containerRef.current)}</>;
}

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
