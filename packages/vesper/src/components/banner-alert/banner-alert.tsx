import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { ErrorSolid } from "@/components/icon/error-solid";
import { InfoSolid } from "@/components/icon/info-solid";
import { Info } from "@/components/icon/info";
import { SuccessSolid } from "@/components/icon/success-solid";
import { WarningSolid } from "@/components/icon/warning-solid";

export interface BannerAlertProps extends ComponentProps<"div"> {
  size: "sm" | "md";
  variant: "info" | "success" | "warning" | "danger" | "secondary";
  cta?: {
    text: string;
    onClick(): void;
  };
}

export function BannerAlert({
  className,
  size,
  variant,
  cta,
  ...props
}: BannerAlertProps) {
  return (
    <div className={cn("vesper-banner-alert", className)} {...props}>
      <span className="vesper-banner-alert-icon">
        {variant === "danger" && <ErrorSolid />}
        {variant === "info" && <InfoSolid />}
        {variant === "secondary" && <Info />}
        {variant === "success" && <SuccessSolid />}
        {variant === "warning" && <WarningSolid />}
      </span>
    </div>
  );
}
