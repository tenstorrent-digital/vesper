import type { ComponentProps } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import { CaretRight } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export interface AccordionProps extends ComponentProps<"div"> {
  /** Whether the accordion is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** Controls the open state of the accordion (controlled mode). */
  open?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(open: boolean): void;
  /** The title text displayed in the accordion trigger. */
  title: string;
}

/**
 * A collapsible content section with a trigger that toggles visibility of its children.
 *
 * @param {string} props.title - The title text displayed in the accordion trigger
 * @param {boolean} [props.defaultOpen] - (optional) Whether the accordion is open by default (uncontrolled)
 * @param {boolean} [props.open] - (optional) Controls the open state (controlled)
 * @param {(open: boolean) => void} [props.onOpenChange] - (optional) Callback fired when the open state changes
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Accordion title="FAQ">
 *   <p>Answer to the question goes here.</p>
 * </Accordion>
 *
 * @example
 * <Accordion title="Advanced" open={isOpen} onOpenChange={setIsOpen}>
 *   <p>Controlled accordion content.</p>
 * </Accordion>
 */
export function Accordion(props: AccordionProps) {
  const {
    defaultOpen,
    open,
    onOpenChange,
    children,
    title,
    className,
    ...rest
  } = props;

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("vesper-accordion", className)}
      {...rest}
    >
      <Typography
        as={CollapsibleTrigger}
        variant="label-md-bold"
        className="vesper-accordion-trigger"
      >
        <span>{title}</span>
        <CaretRight className="vesper-accordion-trigger-icon" />
      </Typography>
      <CollapsibleContent className="vesper-accordion-content">
        <Typography
          variant="copy-sm"
          as="div"
          className="vesper-accordion-content-children"
        >
          {children}
        </Typography>
      </CollapsibleContent>
    </Collapsible>
  );
}
