import type { ComponentProps, MouseEventHandler } from "react";

import { Button } from "@/components/button/button";
import { CaretDown, CaretUp } from "@/components/icons/icons";

import { cn } from "@/utils/cn";

export interface ShowMoreProps extends Omit<ComponentProps<"div">, "onClick"> {
  /** Whether or not the content is currently expanded. Controls the button label ("Show more" / "Show less") and the `aria-expanded` attribute. */
  expanded?: boolean;
  /** When `true`, renders the button in a disabled state and prevents interaction. */
  disabled?: boolean;
  /** Callback fired when the show more/less button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * A button that toggles between "Show more" and "Show less" states,
 * typically used to reveal or hide additional content.
 *
 * @example
 * const [expanded, setExpanded] = useState(false);
 *
 * {expanded && <p>Additional content...</p>}
 * <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />
 */
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
