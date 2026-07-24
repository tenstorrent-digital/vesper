import type { ComponentProps, MouseEventHandler } from "react";

import { Button } from "@/components/button/button";
import { CaretDown, CaretUp } from "@/components/icons/icons";

import { cn } from "@/utils/cn";

export interface ShowMoreProps extends Omit<ComponentProps<"div">, "onClick"> {
  /** Whether or not the content is currently expanded. Controls the button label ("Show more" / "Show less") and the `aria-expanded` attribute. @default false */
  expanded?: boolean;
  /** When `true`, renders the button in a disabled state and prevents interaction. @default false */
  disabled?: boolean;
  /** Callback fired when the show more/less button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * A toggle button for expanding and collapsing content sections with an accessible "Show more" / "Show less" label.
 *
 * @param {boolean} [props.expanded] - (optional) Whether the content is currently expanded. @default false
 * @param {boolean} [props.disabled] - (optional) Renders the button in a disabled state. @default false
 * @param {MouseEventHandler<HTMLButtonElement>} [props.onClick] - (optional) Callback fired when the button is clicked
 *
 * You may also pass any additional props to the underlying `div` element.
 *
 * @example
 * const [expanded, setExpanded] = useState(false);
 *
 * <ShowMore expanded={expanded} onClick={() => setExpanded(!expanded)} />
 *
 * @example
 * <ShowMore expanded={false} disabled />
 */
export function ShowMore(props: ShowMoreProps) {
  const {
    className,
    expanded = false,
    disabled = false,
    onClick,
    ...rest
  } = props;

  return (
    <div className={cn("vesper-show-more", className)} {...rest}>
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
