import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface CodeBlockProps extends ComponentProps<'div'> {}

export function CodeBlock({ className, ...props }: CodeBlockProps) {
  return <div className={cn("vesper-code-block", className)} {...props} />;
}
