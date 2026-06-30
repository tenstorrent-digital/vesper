import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface ChoiceboxProps extends ComponentProps<'fieldset'> {}

export function Choicebox({ className, ...props }: ChoiceboxProps) {
  return <fieldset className={cn("vesper-choicebox", className)} {...props} />;
}
