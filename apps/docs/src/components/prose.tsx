// wrapper for markdown content

import { ReactNode } from "react";

const Prose = ({ children }: { children: ReactNode }) => {
  return <main className="prose">{children}</main>;
};

export default Prose;
