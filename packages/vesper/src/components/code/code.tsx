import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CODE_VARIANTS = ["default", "contrast"] as const;

export type CodeVariant = (typeof CODE_VARIANTS)[number];

export interface CodeProps extends ComponentProps<"code"> {
  /** The visual style variant to render. Defaults to `"default"` */
  variant?: CodeVariant;
}

export function Code(props: CodeProps) {
  const { className, variant = "default", ...rest } = props;

  return (
    <Typography
      as="code"
      variant="copy-xs-mono"
      className={cn("vesper-code", `vesper-code-${variant}`, className)}
      {...rest}
    />
  );
}
