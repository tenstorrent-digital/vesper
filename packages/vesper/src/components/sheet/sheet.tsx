import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface SheetProps extends ComponentProps<'dialog'> {}

export function Sheet({ className, ...props }: SheetProps) {
  return <dialog className={cn("vesper-sheet", className)} {...props} />;
}
