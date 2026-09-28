import { Fragment, isValidElement, ReactElement, ReactNode } from "react";

export function isSingleReactElement(
  children: ReactNode,
): children is ReactElement {
  return isValidElement(children) && children.type !== Fragment;
}
