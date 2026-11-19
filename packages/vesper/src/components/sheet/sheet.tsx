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

export const SHEET_SIDES = ["left", "right"] as const;

export type SheetSide = (typeof SHEET_SIDES)[number];

export interface SheetProps extends Omit<
  ComponentProps<"dialog">,
  "open" | "popover" | "title"
> {
  /** The title displayed in the sheet header. Also used for the sheet's `aria-labelledby` association. */
  title: NonNullable<ReactNode>;
  /** A description displayed below the title in the sheet header. Also used for the sheet's `aria-describedby` association. */
  description: NonNullable<ReactNode>;
  /** Whether the sheet is open. */
  open: boolean;
  /**
   * Callback fired when the sheet requests a change to its open state, with the requested open state as its argument.
   *
   * The sheet calls this with `false` when the user presses `Escape` or clicks the close button in the header, and when the user clicks the backdrop in modal mode. Update the state you pass to `open` in response, because the sheet doesn't close until `open` changes.
   *
   * It's also called with `false` if the browser closes the `<dialog>` element without asking first, such as when a `<form method="dialog">` inside it is submitted, so that `open` stays in sync.
   */
  onOpenChange: (open: boolean) => void;
  /** Forwarded to the underlying `<dialog>` element. The sheet only opens and closes when `open` changes, so don't call methods such as `showModal()` or `close()` on the `<dialog>` element yourself. */
  ref?: Ref<HTMLDialogElement>;
  /** The side of the viewport the sheet slides in from. @default right */
  side?: SheetSide;
  /** When `true`, renders the sheet as a popover instead of a modal dialog. Popovers do not render a backdrop, and allow interaction with the content behind them. @default false */
  popover?: boolean;
}

/**
 * whether the dialog is open, either as a modal dialog or as a popover
 */
function isDialogOpen(dialog: HTMLDialogElement) {
  // check for the `popover` attribute first, since `:popover-open` is an invalid selector in browsers that don't support popovers
  return (
    dialog.open ||
    (dialog.hasAttribute("popover") && dialog.matches(":popover-open"))
  );
}

/**
 * A slide-in panel component for supplementary content, supporting both modal and popover modes.
 *
 * Unlike `Modal`, which is meant to always block user interaction with underlying content, `Sheet` can be configured to allow the user to continue to interact with the rest of the page.
 *
 * @see packages/vesper/src/components/modal/modal.tsx
 *
 * @param {NonNullable<ReactNode>} props.title - The title displayed in the sheet header
 * @param {NonNullable<ReactNode>} props.description - A description displayed below the title
 * @param {boolean} props.open - Whether the sheet is open
 * @param {(open: boolean) => void} props.onOpenChange - Callback fired when the sheet requests a change to its open state, such as when the user dismisses it
 * @param {SheetSide} [props.side] - (optional) The side of the viewport the sheet slides in from. @default right
 * @param {boolean} [props.popover] - (optional) Render as a non-modal popover instead of a modal dialog. @default false
 *
 * You may also pass any additional props (including `ref`) to the underlying `dialog` element. The sheet only opens and closes when `open` changes, so don't call methods such as `showModal()` or `close()` on the `dialog` element through `ref`.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
 * <Sheet
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Settings"
 *   description="Manage your preferences."
 * >
 *   <p>Sheet content here</p>
 *   <Button onClick={() => setIsOpen(false)}>Done</Button>
 * </Sheet>
 */
export function Sheet(props: SheetProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    children,
    open,
    onOpenChange,
    side = "right",
    popover = false,
    title,
    description,
    ...rest
  } = props;

  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);

  // this only lets the consumer know that the sheet should close, and the sheet doesn't close until the `open` prop changes
  const requestClose = useStableCallback(() => onOpenChange(false));

  // open and close the `<dialog>` element to match the `open` prop
  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog || open === isDialogOpen(dialog)) return;

    if (open) {
      if (popover) dialog.showPopover();
      else dialog.showModal();
      return;
    }

    // close the dialog the same way it was opened, in case `popover` changed while it was open
    if (dialog.open) dialog.close();
    else dialog.hidePopover();
  }, [open, popover]);

  // the browser can still close the `<dialog>` element without asking first (eg. when a `<form method="dialog">` inside it is submitted,
  // when a button with a `popovertarget` hides it in popover mode, or for close requests that browsers don't allow to be prevented),
  // so let the consumer know, to keep the `open` prop in sync
  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // modal dialogs fire a `close` event after they close, and popovers fire a `toggle` event after they open or close,
    // so skip the event if the `<dialog>` element is open (again) by then
    const handleClose = () => {
      if (!isDialogOpen(dialog)) requestClose();
    };

    // only listen for one of these, since some browsers fire `toggle` for modal dialogs too
    const eventName = popover ? "toggle" : "close";
    dialog.addEventListener(eventName, handleClose);
    return () => dialog.removeEventListener(eventName, handleClose);
  }, [open, popover, requestClose]);

  // when rendered as a modal, clicking the backdrop requests to close the sheet
  useEffect(() => {
    if (popover) return undefined;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) requestClose();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [popover, requestClose]);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // when rendered as a modal, the native `<dialog>` fires a `cancel` event in response to a close request (eg. the Android back gesture), which closes the dialog unless prevented,
    // so prevent it, and ask the consumer to close the sheet instead
    const handleCancel = (e: Event) => {
      // leave the sheet open if something else prevented the event, eg. the `onCancel` prop,
      // which runs first since React adds its own `cancel` listener when it creates the `<dialog>` element
      if (e.defaultPrevented) return;

      e.preventDefault();
      requestClose();
    };

    // when rendered as a popover, the browser doesn't send a close request on `Escape` (since it's a manual popover).
    // when rendered as a modal, browsers ignore `preventDefault()` on the `cancel` event when `Escape` is pressed repeatedly without any other user interaction in between,
    // so the `Escape` key press is prevented, which stops the browser from sending the close request at all.
    // in both cases, a `cancel` event is fired in place of the browser, so that `cancel` listeners (eg. the `onCancel` prop) still hear about it, and can prevent it
    const handleKeyDown = (e: KeyboardEvent) => {
      // skip key presses that something else already handled (eg. a select popup inside the sheet closing itself), and key presses that end an IME composition
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;

      // let other dialogs (eg. a modal opened from inside this sheet) handle `Escape` themselves
      const owner =
        e.target instanceof Element ? e.target.closest("dialog") : null;
      if (owner && owner !== dialog) return;

      e.preventDefault();
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    };

    // listen on the window, so that this runs after any listeners on the document (eg. those of popups rendered inside the sheet),
    // and so that it still runs when focus is outside the sheet (eg. on the rest of the page, in popover mode)
    window.addEventListener("keydown", handleKeyDown);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [open, requestClose]);

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy = [ariaLabelledby, titleId].filter(Boolean).join(" ");

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy = [ariaDescribedby, descriptionId]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      {...(popover && { popover: "manual" })}
      ref={mergedRef}
      className={cn("vesper-sheet", `vesper-sheet-${side}`, className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      {...rest}
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
            onClick={requestClose}
          />
        </div>
        <div className="vesper-sheet-children">{children}</div>
      </div>
    </dialog>
  );
}
