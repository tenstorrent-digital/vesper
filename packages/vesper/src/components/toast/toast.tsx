import { type ComponentProps, useEffect } from "react";
import { Button } from "@/components/button/button";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { createPortal } from "react-dom";
import { useToasts, dismissToast, type ToastOptions } from "./store";
export { addToast } from "./store";

interface ToastProps
  extends ToastOptions, Omit<ComponentProps<"div">, "children" | "content"> {
  id: string;
}

const TOAST_DEFAULT_TIMEOUT = 5000;

function Toast(toast: ToastProps) {
  const {
    buttons,
    content,
    className,
    dismissable,
    timeout = TOAST_DEFAULT_TIMEOUT,
    id,
    ...props
  } = toast;

  useEffect(() => {
    if (timeout === false) return;
    const t = setTimeout(() => dismissToast(id), timeout);
    return () => clearTimeout(t);
  }, [timeout, id]);

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
            onClick={() => dismissToast(id)}
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

export function Toasts() {
  const toasts = useToasts();

  return createPortal(
    <div className="vesper-toasts">
      {toasts.map(({ id, options }) => (
        <Toast key={id} id={id} {...options} />
      ))}
    </div>,
    document.body,
  );
}
