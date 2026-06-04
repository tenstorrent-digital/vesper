import { Badge, type BadgeProps } from "@repo/vesper/badge";
import { Globe } from "@repo/vesper/icons";

const VARIANTS: BadgeProps["variant"][] = [
  "accent",
  "contrast",
  "danger",
  "info",
  "mint",
  "pink",
  "purple",
  "success",
  "warning",
];

const SIZES: BadgeProps["size"][] = ["sm", "md", "lg"];

export function BadgePreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-wrap gap-vesper-4 p-vesper-4">
      {VARIANTS.map((variant) => (
        <div className="flex flex-col gap-vesper-4" key={variant}>
          {SIZES.map((size) => (
            <div key={size} className="flex gap-vesper-4">
              <Badge size={size} variant={variant} icon={<Globe />}>
                {variant}
              </Badge>
              <Badge size={size} subtle variant={variant} icon={<Globe />}>
                {variant} subtle
              </Badge>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
