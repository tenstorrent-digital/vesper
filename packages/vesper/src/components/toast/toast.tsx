import { type ComponentProps, useSyncExternalStore } from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { createPortal } from "react-dom";

export interface ToastProps extends ComponentProps<"div"> {
  buttons?: Omit<ButtonProps, "size" | "as">[];
  dismissable?: boolean;
  dismiss?(): void;
}

export function Toast(toast: ToastProps) {
  const { buttons, children, className, dismissable, dismiss, ...props } =
    toast;

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
          <button className="vesper-toast-close-button" onClick={dismiss}>
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

let toasts: { toast: ToastProps; key: string }[] = [];

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

export const addToast = (
  toast: ToastProps,
  dismiss = 5000 as number | false,
) => {
  currentKey++;
  const key = `vesper-toast-${currentKey}`;

  toasts = [...toasts, { toast, key }];

  if (dismiss !== false) {
    const timeout = setTimeout(() => {
      dismissToast(key);
      timeouts = timeouts.filter((t) => t !== timeout);
    }, dismiss);
    timeouts.push(timeout);
  }

  emitChange();
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
