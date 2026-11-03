import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export interface TableProps extends ComponentProps<"table"> {}

/**
 * Table component description, params, and example usage
 *
 * @param {ParamType} [props.optionalParam] - (optional) The prop description. @default value
 * @param {ParamType} props.requiredParam - The prop description
 *
 * @example
 * <Table />
 */
export function Table(props: TableProps) {
  const { className, ...rest } = props;
  return (
    <Typography
      {...rest}
      as="table"
      variant="label-sm"
      className={cn("vesper-table", className)}
    />
  );
}
