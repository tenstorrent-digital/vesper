import type { ComponentProps } from 'react';

export interface AccordionProps extends ComponentProps<'div'> {}

export function Accordion(props: AccordionProps) {
  return <div {...props} />;
}
