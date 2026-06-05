import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { ErrorSolid } from "@/components/icon/error-solid";
import { InfoSolid } from "@/components/icon/info-solid";
import { Info } from "@/components/icon/info";
import { SuccessSolid } from "@/components/icon/success-solid";
import { WarningSolid } from "@/components/icon/warning-solid";
import { Button, ButtonProps } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";

export interface BannerAlertProps extends ComponentProps<"div"> {
  size: "sm" | "md";
  variant: "info" | "success" | "warning" | "danger" | "secondary";
  subtle?: boolean;
  cta?: Omit<ButtonProps, "as" | "variant" | "size" | "disabled">;
}

const BANNER_ALERT_TYPOGRAPHY_SIZES = {
  md: "sm",
  sm: "xs",
} as const;

export function BannerAlert({
  className,
  size,
  variant,
  cta,
  children,
  subtle,
  ...props
}: BannerAlertProps) {
  return (
    <div
      className={cn(
        "vesper-banner-alert",
        `vesper-banner-alert-${size}`,
        `vesper-banner-alert-${variant}`,
        subtle && "vesper-banner-alert-subtle",
        className,
      )}
      {...props}
    >
      <div className="vesper-banner-alert-content">
        <span className="vesper-banner-alert-icon">
          {variant === "danger" && <ErrorSolid />}
          {variant === "info" && <InfoSolid />}
          {variant === "secondary" && <Info />}
          {variant === "success" && <SuccessSolid />}
          {variant === "warning" && <WarningSolid />}
        </span>
        <Typography
          as="span"
          variant="copy"
          size={BANNER_ALERT_TYPOGRAPHY_SIZES[size]}
        >
          {children}
        </Typography>
      </div>
      {cta && <Button {...cta} variant="contrast" size="sm" />}
    </div>
  );
}
