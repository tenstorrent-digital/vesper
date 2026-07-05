import { type ComponentProps, useSyncExternalStore } from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { createPortal } from "react-dom";

export interface ToastProps extends ComponentProps<"div"> {
  buttons?: Omit<ButtonProps, "size" | "as">[];
  timeout?: number | false;
  dismissable?: boolean;
  dismiss?(): void;
}

const TOAST_DEFAULT_TIMEOUT = 5000;

export function Toast(toast: ToastProps) {
  const {
    buttons,
    children,
    className,
    dismissable,
    dismiss,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeout = TOAST_DEFAULT_TIMEOUT,
    ...props
  } = toast;

  return (
    <div className={cn("vesper-toast", className)} {...props}>
      <div className="vesper-toast-content">
        <Typography
          as="span"
          className="vesper-toast-children"
          variant="copy-sm"
        >
          {children}
        </Typography>
        {dismissable && (
          <button
            aria-label="Dismiss"
            className="vesper-toast-close-button"
            onClick={dismiss}
          >
            <Close />
          </button>
        )}
      </div>
      {!!buttons?.length && (
        <div className="vesper-toast-buttons">
          {buttons.map((button, index) => {
            const variant =
              button.variant ||
              (index === buttons.length - 1 ? "contrast" : "ghost");

            return (
              <Button key={index} size="xs" {...button} variant={variant} />
            );
          })}
        </div>
      )}
    </div>
  );
}

let currentKey = -1;

let toasts: { toast: Omit<ToastProps, "dismiss">; key: string }[] = [];

let listeners: (() => void)[] = [];

let timeouts: NodeJS.Timeout[] = [];

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = () => toasts;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const addToast = (toast: Omit<ToastProps, "dismiss">) => {
  currentKey++;
  const key = `vesper-toast-${currentKey}`;

  const timeoutDuration = toast.timeout ?? TOAST_DEFAULT_TIMEOUT;

  toasts = [...toasts, { toast: { ...toast, timeout: timeoutDuration }, key }];

  if (timeoutDuration !== false) {
    const timeout = setTimeout(() => {
      dismissToast(key);
      timeouts = timeouts.filter((t) => t !== timeout);
    }, timeoutDuration);

    timeouts.push(timeout);
  }

  emitChange();

  return () => dismissToast(key);
};

const dismissToast = (key: string) => {
  toasts = toasts.filter((t) => t.key !== key);
  emitChange();
};

export function Toasts() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return createPortal(
    <div className="vesper-toasts">
      {toasts.map(({ key, toast }) => (
        <Toast key={key} {...toast} dismiss={() => dismissToast(key)} />
      ))}
    </div>,
    document.body,
  );
}
