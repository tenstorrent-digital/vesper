"use client";

import {
  ComponentProps,
  type ComponentPropsWithoutRef,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

import { Button, type ButtonProps } from "@/components/button/button";
import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const MODAL_BUTTONS_ALIGNMENTS = [
  "start",
  "end",
  "fill",
  "between",
] as const;

export type ModalButtonsAlignment = (typeof MODAL_BUTTONS_ALIGNMENTS)[number];

interface ModalRef {
  open(): void;
  close(): void;
}

export interface ModalProps extends Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open"
> {
  /** The title text displayed in the modal header. Also used for the modal's `aria-labelledby` association. */
  title: string;
  /** A description displayed below the title in the modal header. Also used for the modal's `aria-describedby` association. */
  description: string;
  /** The width of the modal container. Accepts a number (interpreted as pixels) or a CSS string value. Defaults to `452`. */
  width?: number | string;
  /**
   * The maximum height of the modal container. Accepts a number (interpreted as pixels)
   * or a CSS string value. The effective max height is the minimum of this value and
   * `calc(100vh - var(--vesper-spacing-16))`, ensuring the modal never exceeds the
   * viewport height minus spacing. Defaults to `640`.
   */
  maxHeight?: number | string;
  /** An optional array of button props to render as action buttons at the bottom of the modal. The last button defaults to `"primary"` variant; all others default to `"tertiary"`. */
  buttons?: Omit<ButtonProps, "size" | "as">[];
  /** Controls the horizontal alignment of the action buttons. Defaults to `"end"`. */
  buttonsAlignment?: ModalButtonsAlignment;
  /** A ref that exposes imperative `open()` and `close()` methods for controlling the modal. Obtained via the `useModal` hook. */
  ref?: RefObject<ModalRef>;
  /** When `true`, clicking the backdrop outside the modal will close it. Defaults to `false`. */
  closeOnClickOutside?: boolean;
  /** When provided, wraps the modal content in a `<form>` element with the given form attributes, enabling native form submission from within the modal. */
  form?: Pick<
    ComponentProps<"form">,
    | "id"
    | "name"
    | "action"
    | "method"
    | "encType"
    | "acceptCharset"
    | "autoCapitalize"
    | "autoComplete"
    | "autoCorrect"
    | "spellCheck"
    | "noValidate"
    | "onReset"
    | "onSubmit"
    | "target"
    | "rel"
  >;
}

export function Modal(props: ModalProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    title,
    description,
    width = 452,
    maxHeight = 640,
    buttons,
    buttonsAlignment = "end",
    children,
    form,
    closeOnClickOutside = false,
    ...rest
  } = props;

  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    if (!innerRef.current) return;
    if (!innerRef.current.open) innerRef.current.showModal();
  }, []);

  const close = useCallback(() => {
    if (!innerRef.current) return;
    innerRef.current.close();
  }, []);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) close();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [closeOnClickOutside, close]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  const modalContents = (
    <>
      <div className="vesper-modal-header">
        <div>
          <Typography
            id={titleId}
            as="h2"
            variant="heading-md"
            className="vesper-modal-title"
          >
            {title}
          </Typography>
          <Typography
            id={descriptionId}
            variant="copy-md"
            className="vesper-modal-description"
          >
            {description}
          </Typography>
        </div>
        <IconButton
          aria-label="Close modal"
          size="sm"
          variant="subtle"
          type="button"
          onClick={close}
          icon={<Close />}
        />
      </div>
      {children && (
        <Typography as="div" variant="copy-md" className="vesper-modal-content">
          {children}
        </Typography>
      )}
      {!!buttons?.length && (
        <div
          className={cn(
            "vesper-modal-buttons",
            `vesper-modal-buttons-${buttonsAlignment}`,
          )}
        >
          {buttons!.map((button, index) => {
            const variant =
              button.variant ||
              (index === buttons.length - 1 ? "primary" : "tertiary");

            return <Button key={index} {...button} variant={variant} />;
          })}
        </div>
      )}
    </>
  );

  const computedMaxHeight =
    typeof maxHeight === "number"
      ? `calc(${maxHeight} * (1rem / 16))`
      : maxHeight;

  const containerProps = {
    className: "vesper-modal-container",
    style: {
      width: typeof width === "number" ? `calc(${width} * (1rem / 16))` : width,
      maxHeight: `min(calc(100vh - var(--vesper-spacing-16)), ${computedMaxHeight})`,
    },
  };

  return (
    <dialog
      ref={innerRef}
      className={cn("vesper-modal", className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      {...rest}
    >
      {form ? (
        <form {...containerProps} {...form}>
          {modalContents}
        </form>
      ) : (
        <div {...containerProps}>{modalContents}</div>
      )}
    </dialog>
  );
}

/**
 * A convenience hook that returns a ref and imperative `open()` and `close()` functions for controlling a `Modal` component.
 *
 * @example
 * const { ref, open, close } = useModal();
 * <Modal ref={ref} title="Example" description="An example modal." />
 * <Button onClick={open}>Open modal</Button>
 */
export function useModal() {
  const ref = useRef<ModalRef>({ open() {}, close() {} });

  const open = useCallback(() => {
    ref.current.open();
  }, [ref]);

  const close = useCallback(() => {
    ref.current.close();
  }, [ref]);

  return { open, close, ref };
}
