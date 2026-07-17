import type { ElementType } from "react";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const AVATAR_SIZES = ["sm", "md", "lg"] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];

export type AvatarProps<E extends ElementType = "div"> = Polymorphic<
  {
    size?: AvatarSize;
    src?: string;
    alt?: string;
  },
  E,
  "children"
>;

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
