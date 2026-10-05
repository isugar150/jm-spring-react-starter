/* eslint-disable react-refresh/only-export-components */
import * as Toast from "@radix-ui/react-toast";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
};

type ToastItem = ToastOptions & {
  id: string;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const createToastId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const DEFAULT_DURATION = 3500;

const toastIcons: Record<ToastVariant, ReactNode> = {
  info: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  warning: <AlertTriangle size={16} />,
  error: <XCircle size={16} />,
};

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export function ToastProvider({
  children,
  position = "bottom-right",
}: {
  children: ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = createToastId();
    setToasts((prev) => [...prev, { id, ...options }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss, clear }), [toast, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right" duration={DEFAULT_DURATION}>
        {children}
        {toasts.map((item) => {
          const variant = item.variant ?? "info";
          const duration = item.duration ?? DEFAULT_DURATION;
          const showProgress = duration > 0;

          return (
            <Toast.Root
              key={item.id}
              className="ToastRoot"
              data-variant={variant}
              duration={item.duration}
              onOpenChange={(open) => {
                if (!open) dismiss(item.id);
              }}
              defaultOpen
            >
              <div className="ToastIcon" aria-hidden>
                {toastIcons[variant]}
              </div>
              <div className="ToastContent">
                {item.title && (
                  <Toast.Title className="ToastTitle">{item.title}</Toast.Title>
                )}
                {item.description && (
                  <Toast.Description className="ToastDescription">
                    {item.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.Close className="ToastClose" aria-label="닫기">
                <X size={14} />
              </Toast.Close>
              {item.action && (
                <Toast.Action
                  className="ToastAction"
                  asChild
                  altText={item.action.altText ?? item.action.label}
                >
                  <button
                    type="button"
                    className="ToastActionButton"
                    onClick={() => {
                      item.action?.onClick();
                    }}
                  >
                    {item.action.label}
                  </button>
                </Toast.Action>
              )}
              {showProgress && (
                <div
                  className="ToastProgress"
                  style={{ animationDuration: `${duration}ms` }}
                />
              )}
            </Toast.Root>
          );
        })}
        <Toast.Viewport className="ToastViewport" data-position={position} />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
