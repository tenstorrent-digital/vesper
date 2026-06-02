import type { ComponentProps } from 'react';

export interface TypographyProps extends ComponentProps<'p'> {}

export function Typography(props: TypographyProps) {
  return <p {...props} />;
}
