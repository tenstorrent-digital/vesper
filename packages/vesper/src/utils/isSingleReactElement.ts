import { Fragment, isValidElement, ReactNode } from "react";

export function isSingleReactElement(children: ReactNode) {
  return isValidElement(children) && children.type !== Fragment;
}
