// wrapper for markdown content

import { ReactNode } from "react";

export const Prose = ({ children }: { children: ReactNode }) => {
  return <div className="prose">{children}</div>;
};
