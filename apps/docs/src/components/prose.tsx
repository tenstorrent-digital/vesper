// wrapper for markdown content

import { ReactNode } from "react";

export const Prose = ({ children }: { children: ReactNode }) => {
  return <main className="prose">{children}</main>;
};
