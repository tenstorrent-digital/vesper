// wrapper for markdown content

import { ReactNode } from "react";

const Prose = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col gap-4 p-4 w-full mt-16 mx-auto max-w-prose">
      {children}
    </main>
  );
};

export default Prose;
