"use client";

import { useControlled } from "@base-ui/utils/useControlled";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useStableCallback } from "@base-ui/utils/useStableCallback";
import { type ComponentProps, useEffect, useId, useRef } from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Close } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export const SHEET_SIDES = ["left", "right"] as const;

export type SheetSide = (typeof SHEET_SIDES)[number];

export interface SheetProps extends Omit<
  ComponentProps<"dialog">,
  "open" | "popover"
> {
  /** The title text displayed in the sheet header. Also used for the sheet's `aria-labelledby` association. */
  title: string;
  /** A description displayed below the title in the sheet header. Also used for the sheet's `aria-describedby` association. */
  description: string;
  /** Whether the sheet is open (controlled mode). Leave this out to let the sheet manage its own open state (uncontrolled mode). */
  open?: boolean;
  /** Whether the sheet is open when it first renders (uncontrolled mode). @default false */
  defaultOpen?: boolean;
  /**
   * Callback fired when the open state changes, with the new open state as its argument.
   *
   * The sheet calls this with `false` when the user presses `Escape` or clicks the close button in the header, and when the user clicks the backdrop in modal mode. It's also called when the `<dialog>` element itself opens or closes, such as when `showModal()`, `showPopover()`, `close()` or `hidePopover()` is called on it through `ref`.
   *
   * In controlled mode, update the state you pass to `open` in response, because the sheet doesn't open or close until `open` changes.
   */
  onOpenChange?: (open: boolean) => void;
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
 * @param {string} props.title - The title text displayed in the sheet header
 * @param {string} props.description - A description displayed below the title
 * @param {boolean} [props.open] - (optional) Whether the sheet is open (controlled)
 * @param {boolean} [props.defaultOpen] - (optional) Whether the sheet is open when it first renders (uncontrolled). @default false
 * @param {(open: boolean) => void} [props.onOpenChange] - (optional) Callback fired when the open state changes
 * @param {SheetSide} [props.side] - (optional) The side of the viewport the sheet slides in from. @default right
 * @param {boolean} [props.popover] - (optional) Render as a non-modal popover instead of a modal dialog. @default false
 *
 * You may also pass any additional props (including `ref`) to the underlying `dialog` element
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
 *
 * @example
 * const ref = useRef<HTMLDialogElement>(null);
 *
 * <Sheet
 *   ref={ref}
 *   title="Filters"
 *   description="Apply filters"
 *   side="left"
 *   popover
 * >
 *   <p>Sheet content here</p>
 * </Sheet>
 * <Button onClick={() => ref.current?.showPopover()}>Open Sheet</Button>
 */
export function Sheet(props: SheetProps) {
  const {
    className,
    ref,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    children,
    open: openProp,
    defaultOpen = false,
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

  const [open, setOpenUncontrolled] = useControlled({
    controlled: openProp,
    default: defaultOpen,
    name: "Sheet",
    state: "open",
  });

  // when controlled, this only lets the consumer know about the change, and the sheet doesn't open or close until the `open` prop changes
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
    if (open === isDialogOpen(dialog)) return;

    if (open) {
      if (popover) dialog.showPopover();
      else dialog.showModal();
      return;
    }

    // close the dialog the same way it was opened, in case `popover` changed while it was open
    if (dialog.open) dialog.close();
    else dialog.hidePopover();
  }, [open, popover]);

  // keep the open state in sync with the `<dialog>` element, which can also open or close by itself,
  // eg. when `showModal()`, `showPopover()`, `close()` or `hidePopover()` is called on it through `ref`,
  // or when a `<form method="dialog">` inside it is submitted
  const syncOpen = useStableCallback(() => {
    const dialog = innerRef.current;
    if (!dialog) return;

    const dialogOpen = isDialogOpen(dialog);
    if (dialogOpen !== open) changeOpen(dialogOpen);
  });

  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return undefined;

    // popovers don't have an `open` attribute, but fire a `toggle` event whenever they're shown or hidden
    if (popover) {
      dialog.addEventListener("toggle", syncOpen);

      // pick up any changes made before the listener was added
      syncOpen();
      return () => dialog.removeEventListener("toggle", syncOpen);
    }

    // `showModal()`, `show()` and `close()` all add or remove the `open` attribute, and unlike the dialog's
    // `toggle` event, observing the attribute works in every browser
    const observer = new MutationObserver(syncOpen);
    observer.observe(dialog, { attributeFilter: ["open"] });

    // pick up any changes made before the observer was set up
    syncOpen();
    return () => observer.disconnect();
  }, [popover, syncOpen]);

  // when rendered as a modal, clicking the backdrop requests to close the sheet
  useEffect(() => {
    if (popover) return undefined;

    const handleClick = (e: PointerEvent) => {
      if (e.target === innerRef.current) changeOpen(false);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [popover, changeOpen]);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!open || !dialog) return undefined;

    // when rendered as a modal, the native `<dialog>` fires a `cancel` event in response to a close request (eg. the Android back gesture), which closes the dialog unless prevented,
    // so prevent it, and update the open state instead (which, when controlled, leaves closing the sheet up to the consumer)
    const handleCancel = (e: Event) => {
      // leave the sheet open if something else prevented the event, eg. the `onCancel` prop,
      // which runs first since React adds its own `cancel` listener when it creates the `<dialog>` element
      if (e.defaultPrevented) return;

      e.preventDefault();
      changeOpen(false);
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
  }, [open, changeOpen]);

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
            onClick={() => changeOpen(false)}
          />
        </div>
        <div className="vesper-sheet-children">{children}</div>
      </div>
    </dialog>
  );
}
