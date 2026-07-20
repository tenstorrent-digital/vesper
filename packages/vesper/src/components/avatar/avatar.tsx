import type { ElementType } from "react";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const AVATAR_SIZES = ["sm", "md", "lg"] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];

export type AvatarProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size of the avatar. Defaults to `"md"`. */
    size?: AvatarSize;
    /** The image source URL for the avatar. When not provided, the avatar renders as an empty placeholder. */
    src?: string;
    /** The alt text for the avatar image. */
    alt?: string;
  },
  E,
  "children"
>;

/**
 * A circular avatar component that displays a user image or an empty placeholder.
 *
 * @example
 * <Avatar src="/img/user.png" alt="Jane Doe" size="lg" />
 *
 * @example
 * // Empty placeholder
 * <Avatar size="sm" />
 *
 * @example
 * // Polymorphic usage
 * <Avatar
 *   src="/img/user.png"
 *   alt="Jane Doe"
 *   as="a"
 *   href="/settings/profile"
 * />
 */
export function Avatar<E extends ElementType = "div">(props: AvatarProps<E>) {
  const {
    as: Component = "div",
    size = "md",
    className,
    src,
    alt = "",
    ...rest
  } = props;
  return (
    <Component
      className={cn("vesper-avatar", `vesper-avatar-${size}`, className)}
      {...rest}
    >
      {src && <img className="vesper-avatar-image" src={src} alt={alt} />}
    </Component>
  );
}
