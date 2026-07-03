import {
  type ComponentPropsWithoutRef,
  type RefObject,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";
import { Close } from "@/components/icons/icons";
import { type ButtonProps, Button } from "@/components/button/button";
import { useScrollLock } from "@/utils/useScrollLock";

export const MODAL_BUTTONS_ALIGNMENTS = [
  "start",
  "end",
  "fill",
  "between",
] as const;

export type ModalButtonsAlignment = (typeof MODAL_BUTTONS_ALIGNMENTS)[number];

export interface ModalRef {
  open(): void;
  close(): void;
}

export interface ModalProps extends Omit<
  ComponentPropsWithoutRef<"dialog">,
  "open"
> {
  title: string;
  description: string;
  width?: number | string;
  buttons?: Omit<ButtonProps, "size">[];
  buttonsAlignment?: ModalButtonsAlignment;
  ref?: RefObject<ModalRef>;
}

export function Modal({
  className,
  ref,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  title,
  description,
  width = 452,
  buttons,
  buttonsAlignment = "end",
  children,
  ...props
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const innerRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock(isOpen);

  const open = useCallback(() => {
    innerRef.current?.showModal();
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    innerRef.current?.close();
    setIsOpen(false);
  }, []);

  useImperativeHandle(ref, () => ({ open, close }));

  // If an additional aria-labelledby is supplied, this ensures that both ids get used
  const labelledBy =
    [ariaLabelledby, titleId].filter(Boolean).join(" ") || undefined;

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, descriptionId].filter(Boolean).join(" ") || undefined;

  return (
    <dialog
      ref={innerRef}
      className={cn("vesper-modal", className)}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      {...props}
    >
      <div className="vesper-modal-container" style={{ width }}>
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
            {description && (
              <Typography
                id={descriptionId}
                variant="copy-md"
                className="vesper-modal-description"
              >
                {description}
              </Typography>
            )}
          </div>
          <button
            aria-label="Close modal"
            type="button"
            className="vesper-modal-close-button"
            onClick={close}
          >
            <Close />
          </button>
        </div>
        <Typography as="div" variant="copy-md" className="vesper-modal-content">
          {children}
        </Typography>
        {!!buttons?.length && (
          <div
            className={cn(
              "vesper-modal-buttons",
              `vesper-modal-buttons-${buttonsAlignment}`,
            )}
          >
            {buttons!.map((button, index) => (
              <Button key={index} {...button} />
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}

export function useModalRef() {
  return useRef<ModalRef>({ open() {}, close() {} });
}
