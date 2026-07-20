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
 * A collapsible section with a trigger that expands/collapses its content.
 * Built on top of Radix Collapsible, supporting both controlled and uncontrolled modes.
 *
 * @example
 * <Accordion title="Details">
 *   Here is some additional content that can be expanded.
 * </Accordion>
 *
 * @example
 * // Controlled usage
 * const [open, setOpen] = useState(false);
 *
 * <Accordion title="Details" open={open} onOpenChange={setOpen}>
 *   Controlled content
 * </Accordion>
 */
export function Accordion({
  defaultOpen,
  open,
  onOpenChange,
  children,
  title,
  className,
  ...props
}: AccordionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("vesper-accordion", className)}
      {...props}
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
