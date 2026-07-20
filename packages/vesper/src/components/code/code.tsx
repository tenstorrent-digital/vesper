import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CODE_VARIANTS = ["default", "contrast"] as const;

export type CodeVariant = (typeof CODE_VARIANTS)[number];

export interface CodeProps extends ComponentProps<"code"> {
  /** The visual style variant to render. Defaults to `"default"` */
  variant?: CodeVariant;
}

/**
 * An inline code element for displaying short code snippets within body text.
 *
 * Body text that renders inline `Code` should always be the `copy-sm` variant.
 *
 * @example
 * <Typography variant="copy-sm">
 *   Run <Code>yarn install</Code> to get started.
 * </Typography>
 */
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
