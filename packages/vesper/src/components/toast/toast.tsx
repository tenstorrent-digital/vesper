import {
  type ComponentProps,
  ReactNode,
  useEffect,
  useSyncExternalStore,
} from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { createPortal } from "react-dom";

export interface ToastOptions {
  content: ReactNode;
  buttons?: Omit<ButtonProps, "size" | "as">[];
  timeout?: number | false;
  dismissable?: boolean;
}

interface ToastProps
  extends ToastOptions, Omit<ComponentProps<"div">, "children" | "content"> {
  _id: string;
}

const TOAST_DEFAULT_TIMEOUT = 5000;

function Toast(toast: ToastProps) {
  const {
    buttons,
    content,
    className,
    dismissable,
    timeout = TOAST_DEFAULT_TIMEOUT,
    _id,
    ...props
  } = toast;

  useEffect(() => {
    if (timeout === false) return;
    const t = setTimeout(() => dismissToast(_id), timeout);
    return () => clearTimeout(t);
  }, [timeout, _id]);

  return (
    <div className={cn("vesper-toast", className)} {...props}>
      <div className="vesper-toast-content">
        <Typography
          as="span"
          className="vesper-toast-children"
          variant="copy-sm"
        >
          {content}
        </Typography>
        {dismissable && (
          <button
            aria-label="Dismiss"
            className="vesper-toast-close-button"
            onClick={() => dismissToast(_id)}
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

let currentId = -1;

let toasts: { toast: ToastOptions; _id: string }[] = [];

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

export const addToast = (toast: ToastOptions) => {
  currentId++;
  const _id = `vesper-toast-${currentId}`;

  const timeoutDuration = toast.timeout ?? TOAST_DEFAULT_TIMEOUT;

  toasts = [...toasts, { toast: { ...toast, timeout: timeoutDuration }, _id }];

  if (timeoutDuration !== false) {
    const timeout = setTimeout(() => {
      dismissToast(_id);
      timeouts = timeouts.filter((t) => t !== timeout);
    }, timeoutDuration);

    timeouts.push(timeout);
  }

  emitChange();

  return () => dismissToast(_id);
};

const dismissToast = (_id: string) => {
  toasts = toasts.filter((t) => t._id !== _id);
  emitChange();
};

export function Toasts() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return createPortal(
    <div className="vesper-toasts">
      {toasts.map(({ _id, toast }) => (
        <Toast key={_id} _id={_id} {...toast} />
      ))}
    </div>,
    document.body,
  );
}
