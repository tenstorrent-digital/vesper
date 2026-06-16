import { Badge, BADGE_SIZES, BADGE_VARIANTS } from "@repo/vesper/badge";
import { Globe } from "@repo/vesper/icons";

export function BadgePreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-wrap gap-vesper-4 p-vesper-4">
      {BADGE_VARIANTS.map((variant) => (
        <div className="flex flex-col gap-vesper-4" key={variant}>
          {BADGE_SIZES.map((size) => (
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
