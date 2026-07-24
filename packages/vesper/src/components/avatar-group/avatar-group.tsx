import type { ElementType } from "react";

import { Avatar, type AvatarSize } from "@/components/avatar/avatar";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export type AvatarGroupProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size applied to all avatars in the group. @default md */
    size?: AvatarSize;
    /** The list of avatars to display. A maximum of 3 avatars are shown, with an overflow indicator for additional items. */
    avatars: { src: string | undefined; alt?: string }[];
  },
  E,
  "children"
>;

/**
 * A polymorphic component that displays a row of avatars with an overflow indicator for groups larger than three.
 *
 * @param {AvatarGroupProps["avatars"]} props.avatars - The list of avatars to display (max 3 shown, with overflow count)
 * @param {AvatarSize} [props.size] - (optional) The size applied to all avatars. @default md
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default div
 *
 * You may also pass any additional props to the underlying element.
 *
 * @example
 * <AvatarGroup
 *   avatars={[
 *     { src: "/avatar1.png", alt: "Alice" },
 *     { src: "/avatar2.png", alt: "Bob" },
 *     { src: "/avatar3.png", alt: "Charlie" },
 *     { src: "/avatar4.png", alt: "Dana" },
 *   ]}
 * />
 *
 * @example
 * <AvatarGroup size="lg" avatars={teamMembers} />
 */
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
