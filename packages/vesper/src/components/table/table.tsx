import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface TableProps extends ComponentProps<'table'> {}

/**
 * Table component description, params, and example usage
 *
 * @param {ParamType} [props.optionalParam] - (optional) The prop description. @default value
 * @param {ParamType} props.requiredParam - The prop description
 *
 * @example
 * <Table />
 */
export function Table({ className, ...props }: TableProps) {
  return <table className={cn("vesper-table", className)} {...props} />;
}
