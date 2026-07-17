import type { ComponentProps, MouseEventHandler } from "react";

import { Button } from "@/components/button/button";
import { CaretDown, CaretUp } from "@/components/icons/icons";

import { cn } from "@/utils/cn";

export interface ShowMoreProps extends Omit<ComponentProps<"div">, "onClick"> {
  expanded?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function ShowMore({
  className,
  expanded,
  disabled,
  onClick,
  ...props
}: ShowMoreProps) {
  return (
    <div className={cn("vesper-show-more", className)} {...props}>
      <Button
        aria-expanded={expanded ?? false}
        disabled={disabled}
        size="sm"
        variant="tertiary"
        iconRight={expanded ? <CaretUp /> : <CaretDown />}
        onClick={onClick}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </div>
  );
}
