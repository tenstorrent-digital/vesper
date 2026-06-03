import { ButtonsPreview } from "@/components/buttons-preview";
import { MenuPreview } from "@/components/menu-preview";
import { TypographyPreview } from "@/components/typography-preview";

export default function Page() {
  return (
    <div>
      <TypographyPreview />
      <MenuPreview />
      <ButtonsPreview />
    </div>
  );
}
