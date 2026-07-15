import type { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export interface SnippetProps extends ComponentProps<'pre'> {}

export function Snippet({ className, ...props }: SnippetProps) {
  return <pre className={cn("vesper-snippet", className)} {...props} />;
}
