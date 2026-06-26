import type { ComponentProps, MouseEventHandler } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button/button";
import { CaretDown, CaretUp } from "@/components/icons/icons";

export interface ShowMoreProps extends Omit<ComponentProps<"div">, "onClick"> {
  showMore?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function ShowMore({
  className,
  showMore,
  onClick,
  ...props
}: ShowMoreProps) {
  return (
    <div className={cn("vesper-show-more", className)} {...props}>
      <Button
        size="sm"
        variant="tertiary"
        iconRight={showMore ? <CaretUp /> : <CaretDown />}
        onClick={onClick}
      >
        {showMore ? "Show less" : "Show more"}
      </Button>
    </div>
  );
}
