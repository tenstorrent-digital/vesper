import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleProps,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

import { CaretRight } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export interface AccordionProps extends Omit<
  CollapsibleProps,
  "disabled" | "asChild"
> {
  title: string;
}

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
