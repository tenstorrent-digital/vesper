import type { ComponentProps } from 'react';

export interface SplitButtonProps extends ComponentProps<'button'> {}

export function SplitButton(props: SplitButtonProps) {
  return <button {...props} />;
}
