"use client";

import { useControlled } from "@base-ui/utils/useControlled";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useStableCallback } from "@base-ui/utils/useStableCallback";
import { type ComponentProps, useEffect, useId, useRef } from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export interface ModalProps extends Omit<ComponentProps<"dialog">, "open"> {
  /** The title text displayed in the modal header. Also used for the modal's `aria-labelledby` association. */
  title: string;
  /** A description displayed below the title in the modal header. Also used for the modal's `aria-describedby` association. */
  description: string;
  /** Whether the modal is open (controlled mode). Leave this out to let the modal manage its own open state (uncontrolled mode). */
  open?: boolean;
  /** Whether the modal is open when it first renders (uncontrolled mode). @default false */
  defaultOpen?: boolean;
  /**
   * Callback fired when the open state changes, with the new open state as its argument.
   *
   * The modal calls this with `false` when the user presses `Escape` or clicks the close button in the header, and when the user clicks the backdrop if `closeOnClickOutside` is `true`. It's also called when the `<dialog>` element itself opens or closes, such as when `showModal()` or `close()` is called on it through `ref`.
   *
   * In controlled mode, update the state you pass to `open` in response, because the modal doesn't open or close until `open` changes.
   */
  onOpenChange?: (open: boolean) => void;
  /** The width of the modal container. Accepts a number (interpreted as pixels) or a CSS string value. @default 452 */
  width?: number | string;
  /** When `true`, clicking the backdrop outside the modal will request to close it. @default false */
  closeOnClickOutside?: boolean;
  /**
   * When `false`, prevents the user from dismissing the modal: pressing `Escape` and clicking the backdrop are ignored, and the close button in the header is disabled. You can still close the modal yourself, by setting `open` to `false` or by calling `close()` on the `<dialog>` element.
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
 * @param {boolean} [props.open] - (optional) Whether the modal is open (controlled)
 * @param {boolean} [props.defaultOpen] - (optional) Whether the modal is open when it first renders (uncontrolled). @default false
 * @param {(open: boolean) => void} [props.onOpenChange] - (optional) Callback fired when the open state changes
 * @param {number | string} [props.width] - (optional) The width of the modal container. @default 452
 * @param {boolean} [props.closeOnClickOutside] - (optional) Whether clicking the backdrop dismisses the modal. @default false
 * @param {boolean} [props.dismissible] - (optional) Set to `false` to stop the user from closing the modal during critical flows. @default true
 *
 * You may also pass any additional props (including `ref`) to the underlying `dialog` element
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
 *
 * @example
 * const ref = useRef<HTMLDialogElement>(null);
 *
 * <Modal ref={ref} title="Settings" description="Manage your preferences" />
 * <Button onClick={() => ref.current?.showModal()}>Open Modal</Button>
 */
export function Modal(props: ModalProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    title,
    description,
    open: openProp,
    defaultOpen = false,
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

  const [open, setOpenUncontrolled] = useControlled({
    controlled: openProp,
    default: defaultOpen,
    name: "Modal",
    state: "open",
  });

  // when controlled, this only lets the consumer know about the change, and the modal doesn't open or close until the `open` prop changes
  const changeOpen = useStableCallback((nextOpen: boolean) => {
    setOpenUncontrolled(nextOpen);
    onOpenChange?.(nextOpen);
  });

  // the open state that the `<dialog>` element was last synced to, which starts out closed like the `<dialog>` element itself
  const syncedOpenRef = useRef(false);

  // keep the `<dialog>` element in sync with the open state, but only when the open state changes, so that a `<dialog>` element
  // opened through `ref` before this first runs (eg. from a parent's `useLayoutEffect`) isn't closed again, and is picked up by `syncOpen` instead
  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog || open === syncedOpenRef.current) return;

    syncedOpenRef.current = open;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // keep the open state in sync with the `<dialog>` element, which can also open or close by itself,
  // eg. when `showModal()` or `close()` is called on it through `ref`, or when a `<form method="dialog">` inside it is submitted
  const syncOpen = useStableCallback(() => {
    const dialog = innerRef.current;
    if (dialog && dialog.open !== open) changeOpen(dialog.open);
  });

  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return undefined;

    // `showModal()`, `show()` and `close()` all add or remove the `open` attribute, and unlike the dialog's
    // `toggle` event, observing the attribute works in every browser
    const observer = new MutationObserver(syncOpen);
    observer.observe(dialog, { attributeFilter: ["open"] });

    // pick up any changes made before the observer was set up
    syncOpen();
    return () => observer.disconnect();
  }, [syncOpen]);

  useEffect(() => {
    if (!closeOnClickOutside || !dismissible) return undefined;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) changeOpen(false);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [closeOnClickOutside, dismissible, changeOpen]);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // the native `<dialog>` fires a `cancel` event in response to a close request (eg. the Android back gesture), which closes the dialog unless prevented,
    // so prevent it, and update the open state instead (which, when controlled, leaves closing the modal up to the consumer)
    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (dismissible) changeOpen(false);
    };

    // browsers ignore `preventDefault()` on the `cancel` event when `Escape` is pressed repeatedly without any other user interaction in between,
    // so the `Escape` key press is also prevented, which stops the browser from sending the close request at all
    const handleKeyDown = (e: KeyboardEvent) => {
      // skip key presses that something else already handled (eg. a select popup inside the modal closing itself), and key presses that end an IME composition
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;

      // let other dialogs rendered inside this modal handle `Escape` themselves
      const owner =
        e.target instanceof Element ? e.target.closest("dialog") : null;
      if (owner && owner !== dialog) return;

      e.preventDefault();
      if (dismissible) changeOpen(false);
    };

    // listen on the window, so that this runs after any listeners on the document (eg. those of popups rendered inside the modal),
    // and so that it still runs when focus has moved outside the dialog (eg. if the focused element became disabled)
    window.addEventListener("keydown", handleKeyDown);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [open, dismissible, changeOpen]);

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
            onClick={() => changeOpen(false)}
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
