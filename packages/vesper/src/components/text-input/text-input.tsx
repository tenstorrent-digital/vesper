import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface TextInputProps extends ComponentProps<'input'> {}

export function TextInput({ className, ...props }: TextInputProps) {
  return <input className={cn("vesper-text-input", className)} {...props} />;
}
