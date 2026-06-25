import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface TagProps extends ComponentProps<'div'> {}

export function Tag({ className, ...props }: TagProps) {
  return <div className={cn("vesper-tag", className)} {...props} />;
}
