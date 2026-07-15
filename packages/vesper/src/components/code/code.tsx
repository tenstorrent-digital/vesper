import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface CodeProps extends ComponentProps<'code'> {}

export function Code({ className, ...props }: CodeProps) {
  return <code className={cn("vesper-code", className)} {...props} />;
}
