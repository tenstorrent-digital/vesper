import type { ComponentProps } from 'react';

export interface BannerAlertProps extends ComponentProps<'div'> {}

export function BannerAlert(props: BannerAlertProps) {
  return <div {...props} />;
}
