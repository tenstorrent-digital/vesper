import type { ComponentProps } from "react";

import { Typography } from "@/components/typography/typography";
import { cn } from "@/utils/cn";

/** Props for a `Table`, which accepts any props a native `<table>` element accepts. */
export interface TableProps extends ComponentProps<"table"> {}

/**
 * A styled `<table>` element for displaying structured data in rows and columns.
 *
 * @example
 * <Table aria-label="Deployments">
 *   <thead>
 *     <tr>
 *       <th>Model</th>
 *       <th>Device</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Llama-3.3-70B-Instruct</td>
 *       <td>n300</td>
 *     </tr>
 *     <tr>
 *       <td>Wan 2.2 14B</td>
 *       <td>n300</td>
 *     </tr>
 *   </tbody>
 * </Table>
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
