import type { ComponentProps } from 'react';

export interface ThemeSwitcherProps extends ComponentProps<'div'> {}

export function ThemeSwitcher(props: ThemeSwitcherProps) {
  return <div {...props} />;
}
