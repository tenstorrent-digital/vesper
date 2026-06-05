import { BadgePreview } from "@/components/badge-preview";
import { AccordionPreview } from "@/components/accordion-preview";
import { AvatarPreview } from "@/components/avatar-preview";
import { ProgressBarPreview } from "@/components/progress-bar-preview";
import { ButtonsPreview } from "@/components/buttons-preview";
import { MenuPreview } from "@/components/menu-preview";
import { TypographyPreview } from "@/components/typography-preview";
import { BannerAlertPreview } from "@/components/banner-alert-preview";

export default function Page() {
  return (
    <div>
      <TypographyPreview />
      <BannerAlertPreview />
      <BadgePreview />
      <AccordionPreview />
      <AvatarPreview />
      <ProgressBarPreview />
      <MenuPreview />
      <ButtonsPreview />
    </div>
  );
}
