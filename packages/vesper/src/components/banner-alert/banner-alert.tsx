import type { ComponentProps, ElementType } from "react";
import { cn } from "@/utils/cn";
import { Polymorphic } from "@/utils/polymorphic";
import { ErrorSolid } from "@/components/icon/error-solid";
import { InfoSolid } from "@/components/icon/info-solid";
import { Info } from "@/components/icon/info";
import { SuccessSolid } from "@/components/icon/success-solid";
import { WarningSolid } from "@/components/icon/warning-solid";
import { Button, ButtonProps } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";

export type BannerAlertProps<
  E extends ElementType = "div",
  C extends ElementType = "button",
> = Polymorphic<
  {
    size: "sm" | "md";
    variant: "info" | "success" | "warning" | "danger" | "secondary";
    subtle?: boolean;
    ctaAs?: C;
    cta?: Omit<ButtonProps<C>, "size" | "variant" | "as">;
  },
  E
>;

const BANNER_ALERT_TYPOGRAPHY_SIZES = {
  md: "sm",
  sm: "xs",
} as const;

export function BannerAlert<
  E extends ElementType = "div",
  C extends ElementType = "button",
>(props: BannerAlertProps<E, C>) {
  const {
    as: Component = "div",
    className,
    size,
    variant,
    ctaAs,
    cta,
    children,
    subtle,
    ...rest
  } = props;
  return (
    <Component
      className={cn(
        "vesper-banner-alert",
        `vesper-banner-alert-${size}`,
        `vesper-banner-alert-${variant}`,
        subtle && "vesper-banner-alert-subtle",
        className,
      )}
      {...rest}
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
      {cta && (
        <Button
          {...(cta as ButtonProps<E>)}
          as={ctaAs}
          variant="contrast"
          size="sm"
        />
      )}
    </Component>
  );
}
