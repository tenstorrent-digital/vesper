import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type RefObject,
} from "react";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import {
  type ButtonProps,
  Button,
  type ButtonVariant,
} from "@/components/button/button";

interface SheetRef {
  open(): void;
  close(): void;
}

export interface SheetProps extends Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open"
> {
  title: string;
  description: string;
  ref?: RefObject<SheetRef>;
  side?: "left" | "right";
  buttons?: Omit<ButtonProps, "size" | "as">[];
}

export function Sheet({
  className,
  ref,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  children,
  side = "right",
  title,
  description,
  buttons = [],
  ...props
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    innerRef.current?.showPopover();
  }, []);

  const close = useCallback(() => {
    innerRef.current?.hidePopover();
  }, []);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  useEffect(() => {
    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) close();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [close]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      popover=""
      ref={innerRef}
      className={cn("vesper-sheet", `vesper-sheet-${side}`, className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      {...props}
    >
      <div className="vesper-sheet-content">
        <div className="vesper-sheet-header">
          <div className="vesper-sheet-title-description">
            <Typography
              variant="heading-sm"
              className="vesper-sheet-title"
              id={titleId}
            >
              {title}
            </Typography>
            <Typography
              variant="copy-sm"
              className="vesper-sheet-description"
              id={descriptionId}
            >
              {description}
            </Typography>
          </div>
          <IconButton
            aria-label="Close sheet"
            type="button"
            icon={<Close />}
            size="md"
            variant="tertiary"
            onClick={close}
          />
        </div>
        <div className="vesper-sheet-children">{children}</div>
        {buttons.length > 0 && (
          <div className="vesper-sheet-buttons">
            {buttons.map((button, index) => {
              const variant: ButtonVariant =
                button.variant ||
                (index === buttons.length - 1 ? "contrast" : "tertiary");

              return (
                <Button size="lg" key={index} {...button} variant={variant} />
              );
            })}
          </div>
        )}
      </div>
    </dialog>
  );
}

export function useSheet() {
  const ref = useRef<SheetRef>({ open() {}, close() {} });

  const open = useCallback(() => {
    ref.current.open();
  }, [ref]);

  const close = useCallback(() => {
    ref.current.close();
  }, [ref]);

  return { open, close, ref };
}
