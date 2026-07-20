import {
  type ComponentPropsWithoutRef,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Button,
  type ButtonProps,
  type ButtonVariant,
} from "@/components/button/button";
import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

interface SheetRef {
  open(): void;
  close(): void;
}

export const SHEET_SIDES = ["left", "right"] as const;

export type SheetSide = (typeof SHEET_SIDES)[number];

export interface SheetProps extends Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open" | "popover"
> {
  /** The title text displayed in the sheet header. Also used for the sheet's `aria-labelledby` association. */
  title: string;
  /** A description displayed below the title in the sheet header. Also used for the sheet's `aria-describedby` association. */
  description: string;
  /** A ref that exposes imperative `open()` and `close()` methods for controlling the sheet. Can be obtained via the `useSheet` hook. */
  ref?: RefObject<SheetRef>;
  /** The side of the viewport the sheet slides in from. Defaults to `"right"`. */
  side?: SheetSide;
  /** When `true`, renders the sheet as a popover instead of a modal dialog. Popovers do not render a backdrop, and allow interaction with the content behind them. Defaults to `false`. */
  popover?: boolean;
  /** An optional array of button props to render as action buttons at the bottom of the sheet. The last button defaults to `"contrast"` variant; all others default to `"tertiary"`. */
  buttons?: Omit<ButtonProps, "size" | "as">[];
}

export function Sheet({
  className,
  ref,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  children,
  side = "right",
  popover = false,
  title,
  description,
  buttons = [],
  ...props
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    if (!innerRef.current) return;

    if (!popover) {
      if (!innerRef.current.open) innerRef.current.showModal();
    } else {
      innerRef.current?.showPopover();
    }
  }, [popover]);

  const close = useCallback(() => {
    if (!innerRef.current) return;

    if (!popover) innerRef.current.close();
    else innerRef.current.hidePopover();
  }, [popover]);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  useEffect(() => {
    // when rendered as a modal, ensure clicking outside the container closes the sheet
    if (!popover) {
      const handleClick = (e: PointerEvent) => {
        if (e.target === innerRef.current) close();
      };
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }

    // when rendered as a popover, ensure pressing the escape key closes the sheet
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, popover]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      {...(popover && { popover: "manual" })}
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

/**
 * A convenience hook that returns a ref and imperative `open()` and `close()` functions for controlling a `Sheet` component.
 *
 * @example
 * const { ref, open, close } = useSheet();
 * <Sheet ref={ref} title="Example" description="An example sheet." />
 * <Button onClick={open}>Open sheet</Button>
 */
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
