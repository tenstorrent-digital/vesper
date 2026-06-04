import type { ComponentProps } from 'react';

export interface BadgeProps extends ComponentProps<'div'> {}

export function Badge(props: BadgeProps) {
  return <div {...props} />;
}
