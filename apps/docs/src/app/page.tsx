import { BadgePreview } from "@/components/badge-preview";
import { AccordionPreview } from "@/components/accordion-preview";
import { AvatarPreview } from "@/components/avatar-preview";
import { ProgressBarPreview } from "@/components/progress-bar-preview";
import { ButtonsPreview } from "@/components/buttons-preview";
import { MenuPreview } from "@/components/menu-preview";
import { TypographyPreview } from "@/components/typography-preview";

export default function Page() {
  return (
    <div>
      <TypographyPreview />
      <BadgePreview />
      <AccordionPreview />
      <AvatarPreview />
      <ProgressBarPreview />
      <MenuPreview />
      <ButtonsPreview />
    </div>
  );
}
