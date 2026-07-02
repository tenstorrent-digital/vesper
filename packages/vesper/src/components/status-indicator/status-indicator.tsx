import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface StatusIndicatorProps extends ComponentProps<'div'> {}

export function StatusIndicator({ className, ...props }: StatusIndicatorProps) {
  return <div className={cn("vesper-status-indicator", className)} {...props} />;
}
