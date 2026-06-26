import type { ComponentProps, MouseEventHandler } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button/button";
import { CaretDown, CaretUp } from "@/components/icons/icons";

export interface ShowMoreProps extends Omit<ComponentProps<"div">, "onClick"> {
  isOpen?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function ShowMore({
  className,
  isOpen,
  onClick,
  ...props
}: ShowMoreProps) {
  return (
    <div className={cn("vesper-show-more", className)} {...props}>
      <Button
        size="sm"
        variant="tertiary"
        iconRight={isOpen ? <CaretUp /> : <CaretDown />}
        onClick={onClick}
      >
        {isOpen ? "Show less" : "Show more"}
      </Button>
    </div>
  );
}
