import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CODE_VARIANTS = ["default", "contrast"] as const;

export type CodeVariant = (typeof CODE_VARIANTS)[number];

export interface CodeProps extends ComponentProps<"code"> {
  variant?: CodeVariant;
}

export function Code({ className, variant = "default", ...props }: CodeProps) {
  return (
    <Typography
      as="code"
      variant="copy-xs-mono"
      className={cn("vesper-code", `vesper-code-${variant}`, className)}
      {...props}
    />
  );
}
