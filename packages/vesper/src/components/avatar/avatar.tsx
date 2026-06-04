import type { ElementType } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

export type AvatarProps<E extends ElementType = "div"> = Polymorphic<
  {
    size: "lg" | "md" | "sm";
    src?: string;
    as?: E;
    className?: string;
  },
  E
>;

export function Avatar<E extends ElementType = "div">(props: AvatarProps<E>) {
  const { as: Component = "div", size, className, src, ...rest } = props;
  return (
    <Component
      className={cn("vesper-avatar", `vesper-avatar-${size}`, className)}
      {...rest}
    >
      {src && <img className="vesper-avatar-image" src={src} />}
    </Component>
  );
}
