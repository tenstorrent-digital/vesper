import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CODE_VARIANTS = ["default", "contrast"] as const;

export type CodeVariant = (typeof CODE_VARIANTS)[number];

export interface CodeProps extends ComponentProps<"code"> {
  /** The visual style variant to render. @default default */
  variant?: CodeVariant;
}

/**
 * An inline code element with consistent monospace typography and visual styling.
 *
 * @param {CodeVariant} [props.variant] - (optional) The visual style variant. @default default`
 * @param {string} [props.className] - (optional) Additional CSS class names to apply
 *
 * You may also pass any additional props to the underlying `code` element
 *
 * @example
 * <Code>npm install vesper</Code>
 *
 * @example
 * <Code variant="contrast">const x = 42</Code>
 */
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
