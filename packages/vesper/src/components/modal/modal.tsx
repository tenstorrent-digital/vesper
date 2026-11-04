"use client";

import {
  type ComponentPropsWithoutRef,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

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
  /** The width of the modal container. Accepts a number (interpreted as pixels) or a CSS string value. @default 452 */
  width?: number | string;
  /** A ref that exposes imperative `open()` and `close()` methods for controlling the modal. Obtained via the `useModal` hook. */
  ref?: Ref<ModalRef>;
  /** When `true`, clicking the backdrop outside the modal will close it. Defaults to `false`. */
  closeOnClickOutside?: boolean;
  /**
   * When `false`, prevents the user from dismissing the modal: pressing `Escape` and clicking the backdrop are ignored, and the close button in the header is disabled. The modal can still be closed programmatically with `close()`.
   *
   * Use this to keep the modal open during critical flows, such as while a form is submitting. @default true
   */
  dismissible?: boolean;
}

/**
 * A dialog overlay component for focused user interactions.
 *
 * Unlike `Sheet`, which can be configured to allow the user to continue to interact with the rest of the page, `Modal` is meant to always block user interaction with underlying content.
 *
 * @see packages/vesper/src/components/sheet/sheet.tsx
 *
 * @param {string} props.title - The title text displayed in the modal header
 * @param {string} props.description - A description displayed below the title
 * @param {number | string} [props.width] - (optional) The width of the modal container. @default 452
 * @param {Ref<ModalRef>} [props.ref] - (optional) A ref exposing imperative `open()` and `close()` methods
 * @param {boolean} [props.closeOnClickOutside] - (optional) Whether clicking the backdrop closes the modal. @default false
 * @param {boolean} [props.dismissible] - (optional) Set to `false` to stop the user from closing the modal during critical flows. Calling `close()` still closes it. @default true
 *
 * You may also pass any additional props to the underlying `dialog` element
 *
 * @example
 * const { ref, open, close } = useModal();
 *
 * <Modal ref={ref} title="Confirm" description="Are you sure?">
 *   <p>This action cannot be undone.</p>
 * </Modal>
 * <Button onClick={open}>Open Modal</Button>
 */
export function Modal(props: ModalProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    title,
    description,
    width = 452,
    children,
    closeOnClickOutside = false,
    dismissible = true,
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
    if (!closeOnClickOutside || !dismissible) return undefined;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) close();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [closeOnClickOutside, dismissible, close]);

  useEffect(() => {
    const dialog = innerRef.current;
    if (dismissible || !dialog) return undefined;

    // the native `<dialog>` fires a `cancel` event in response to a close request (eg. pressing `Escape`), which closes the dialog unless prevented
    const handleCancel = (e: Event) => e.preventDefault();

    // browsers ignore `preventDefault()` on the `cancel` event when `Escape` is pressed repeatedly without any other user interaction in between,
    // so the `Escape` key press is also prevented, which stops the browser from sending the close request at all
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !dialog.open) return;

      // let other dialogs rendered inside this modal handle `Escape` themselves
      const owner =
        e.target instanceof Element ? e.target.closest("dialog") : null;
      if (owner && owner !== dialog) return;

      e.preventDefault();
    };

    // listen on the document, since focus may have moved outside the dialog (eg. if the focused element became disabled)
    document.addEventListener("keydown", handleKeyDown);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [dismissible]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      ref={innerRef}
      className={cn("vesper-modal", className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      {...rest}
    >
      <div
        className="vesper-modal-container"
        style={{
          width:
            typeof width === "number" ? `calc(${width} * (1rem / 16))` : width,
        }}
      >
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
            disabled={!dismissible}
            icon={<Close />}
          />
        </div>
        {children && (
          <Typography
            as="div"
            variant="copy-md"
            className="vesper-modal-content"
          >
            {children}
          </Typography>
        )}
      </div>
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
