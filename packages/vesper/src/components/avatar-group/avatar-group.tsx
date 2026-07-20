import type { ElementType } from "react";

import { Avatar, type AvatarSize } from "@/components/avatar/avatar";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export type AvatarGroupProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size applied to all avatars in the group. Defaults to `"md"`. */
    size?: AvatarSize;
    /** The list of avatars to display. A maximum of 3 avatars are shown, with an overflow indicator for additional items. */
    avatars: { src: string | undefined; alt?: string }[];
  },
  E,
  "children"
>;

export function AvatarGroup<E extends ElementType = "div">(
  props: AvatarGroupProps<E>,
) {
  const {
    as: Component = "div",
    size = "md",
    avatars,
    className,
    ...rest
  } = props;

  return (
    <Component className={cn("vesper-avatar-group", className)} {...rest}>
      {avatars.slice(0, 3).map(({ src, alt }, index) => (
        <Avatar key={index} size={size} src={src} alt={alt} />
      ))}
      {avatars.length > 3 && (
        <div
          className={`vesper-avatar-group-overflow vesper-avatar vesper-avatar-${size}`}
        >
          {avatars.length <= 100 ? `+${avatars.length - 3}` : "99+"}
        </div>
      )}
    </Component>
  );
}
