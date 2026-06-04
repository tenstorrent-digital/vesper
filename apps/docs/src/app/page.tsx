import { AccordionPreview } from "@/components/accordion-preview";
import { ProgressBarPreview } from "@/components/progress-bar-preview";
import { ButtonsPreview } from "@/components/buttons-preview";
import { MenuPreview } from "@/components/menu-preview";
import { TypographyPreview } from "@/components/typography-preview";

export default function Page() {
  return (
    <div>
      <TypographyPreview />
      <AccordionPreview />
      <ProgressBarPreview />
      <MenuPreview />
      <ButtonsPreview />
    </div>
  );
}
