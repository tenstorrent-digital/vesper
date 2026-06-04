import type { ElementType } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/avatar/avatar";

export type AvatarGroupProps<E extends ElementType = "div"> = Polymorphic<
  {
    size: "lg" | "md" | "sm";
    avatars: (string | undefined)[];
    as?: E;
    className?: string;
  },
  E
>;

export function AvatarGroup<E extends ElementType = "div">(
  props: AvatarGroupProps<E>,
) {
  const { as: Component = "div", size, avatars, className, ...rest } = props;

  return (
    <Component className={cn("vesper-avatar-group", className)} {...rest}>
      {avatars.slice(0, 3).map((src, index) => (
        <Avatar key={index} size={size} src={src} />
      ))}
      {avatars.length > 3 && (
        <div
          className={`vesper-avatar-group-overflow vesper-avatar vesper-avatar-${size}`}
        >
          {`+${avatars.length - 3}`}
        </div>
      )}
    </Component>
  );
}
