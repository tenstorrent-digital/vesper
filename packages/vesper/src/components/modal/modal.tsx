"use client";

import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useStableCallback } from "@base-ui/utils/useStableCallback";
import {
  type ComponentProps,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
} from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export interface ModalProps extends Omit<
  ComponentProps<"dialog">,
  "open" | "title" | "popover"
> {
  /** The title displayed in the modal header. Also used for the modal's `aria-labelledby` association. */
  title: NonNullable<ReactNode>;
  /** A description displayed below the title in the modal header. Also used for the modal's `aria-describedby` association. */
  description: NonNullable<ReactNode>;
  /** Whether the modal is open. */
  open: boolean;
  /**
   * Callback fired when the modal requests a change to its open state, with the requested open state as its argument.
   *
   * The modal calls this with `false` when the user presses `Escape` or clicks the close button in the header, and when the user clicks the backdrop if `closeOnClickOutside` is `true`. Update the state you pass to `open` in response, because the modal doesn't close until `open` changes.
   *
   * It's also called with `false` if the browser closes the `<dialog>` element without asking first, such as when a `<form method="dialog">` inside it is submitted, so that `open` stays in sync.
   */
  onOpenChange: (open: boolean) => void;
  /** Forwarded to the underlying `<dialog>` element. The modal only opens and closes when `open` changes, so don't call `showModal()` or `close()` on the `<dialog>` element yourself. */
  ref?: Ref<HTMLDialogElement>;
  /** The width of the modal container. Accepts a number (interpreted as pixels) or a CSS string value. @default 452 */
  width?: number | string;
  /** When `true`, clicking the backdrop outside the modal will request to close it. @default false */
  closeOnClickOutside?: boolean;
  /**
   * When `false`, prevents the user from dismissing the modal: pressing `Escape` and clicking the backdrop are ignored, and the close button in the header is disabled. You can still close the modal yourself, by setting `open` to `false`.
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
 * @param {NonNullable<ReactNode>} props.title - The title displayed in the modal header
 * @param {NonNullable<ReactNode>} props.description - A description displayed below the title
 * @param {boolean} props.open - Whether the modal is open
 * @param {(open: boolean) => void} props.onOpenChange - Callback fired when the modal requests a change to its open state, such as when the user dismisses it
 * @param {number | string} [props.width] - (optional) The width of the modal container. @default 452
 * @param {boolean} [props.closeOnClickOutside] - (optional) Whether clicking the backdrop dismisses the modal. @default false
 * @param {boolean} [props.dismissible] - (optional) Set to `false` to stop the user from closing the modal during critical flows. @default true
 *
 * You may also pass any additional props (including `ref`) to the underlying `dialog` element. The modal only opens and closes when `open` changes, so don't call `showModal()` or `close()` on the `dialog` element through `ref`.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Confirm"
 *   description="Are you sure?"
 * >
 *   <p>This action cannot be undone.</p>
 * </Modal>
 */
export function Modal(props: ModalProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    title,
    description,
    open,
    onOpenChange,
    width = 452,
    children,
    closeOnClickOutside = false,
    dismissible = true,
    ...rest
  } = props;

  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);

  // this only lets the consumer know that the modal should close, and the modal doesn't close until the `open` prop changes
  const requestClose = useStableCallback(() => onOpenChange(false));

  // open and close the `<dialog>` element to match the `open` prop
  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // the browser can still close the `<dialog>` element without asking first (eg. when a `<form method="dialog">` inside it is submitted,
  // or for close requests that browsers don't allow to be prevented), so let the consumer know, to keep the `open` prop in sync
  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // the `close` event fires after the `<dialog>` element closes, so skip it if the `<dialog>` element has been opened again since
    const handleClose = () => {
      if (!dialog.open) requestClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, requestClose]);

  useEffect(() => {
    if (!closeOnClickOutside || !dismissible) return undefined;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) requestClose();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [closeOnClickOutside, dismissible, requestClose]);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // the native `<dialog>` fires a `cancel` event in response to a close request (eg. the Android back gesture), which closes the dialog unless prevented,
    // so prevent it, and ask the consumer to close the modal instead
    const handleCancel = (e: Event) => {
      // leave the modal open if something else prevented the event, eg. the `onCancel` prop,
      // which runs first since React adds its own `cancel` listener when it creates the `<dialog>` element
      if (e.defaultPrevented) return;

      e.preventDefault();
      if (dismissible) requestClose();
    };

    // browsers ignore `preventDefault()` on the `cancel` event when `Escape` is pressed repeatedly without any other user interaction in between,
    // so the `Escape` key press is also prevented, which stops the browser from sending the close request at all,
    // and a `cancel` event is fired in its place, so that `cancel` listeners (eg. the `onCancel` prop) still hear about it, and can prevent it
    const handleKeyDown = (e: KeyboardEvent) => {
      // skip key presses that something else already handled (eg. a select popup inside the modal closing itself), and key presses that end an IME composition
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;

      // let other dialogs rendered inside this modal handle `Escape` themselves
      const owner =
        e.target instanceof Element ? e.target.closest("dialog") : null;
      if (owner && owner !== dialog) return;

      e.preventDefault();
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    };

    // listen on the window, so that this runs after any listeners on the document (eg. those of popups rendered inside the modal),
    // and so that it still runs when focus has moved outside the dialog (eg. if the focused element became disabled)
    window.addEventListener("keydown", handleKeyDown);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [open, dismissible, requestClose]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      ref={mergedRef}
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
            onClick={requestClose}
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
