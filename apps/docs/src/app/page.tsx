import { BadgePreview } from "@/components/badge-preview";
import { AccordionPreview } from "@/components/accordion-preview";
import { AvatarPreview } from "@/components/avatar-preview";
import { ProgressBarPreview } from "@/components/progress-bar-preview";
import { ButtonsPreview } from "@/components/buttons-preview";
import { MenuPreview } from "@/components/menu-preview";
import { TypographyPreview } from "@/components/typography-preview";
import { AdmonitionPreview } from "@/components/admonition-preview";
import { TooltipPreview } from "@/components/tooltip-preview";

export default function Page() {
  return (
    <div>
      <TypographyPreview />
      <TooltipPreview />
      <AdmonitionPreview />
      <BadgePreview />
      <AccordionPreview />
      <AvatarPreview />
      <ProgressBarPreview />
      <MenuPreview />
      <ButtonsPreview />
    </div>
  );
}
