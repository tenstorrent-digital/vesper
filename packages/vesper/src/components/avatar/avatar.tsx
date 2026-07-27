import type { ElementType } from "react";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const AVATAR_SIZES = ["sm", "md", "lg"] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];

export type AvatarProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size of the avatar. @default md */
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
 * A polymorphic avatar component that displays a user image or an empty placeholder.
 *
 * @param {AvatarSize} [props.size] - (optional) The size of the avatar. @default md
 * @param {string} [props.src] - (optional) The image source URL for the avatar.
 * @param {string} [props.alt] - (optional) The alt text for the avatar image.
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default div
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <Avatar src="/profile.png" alt="Jane Doe" />
 *
 * @example
 * <Avatar size="lg" as="a" href="/profile/jane-doe" />
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
