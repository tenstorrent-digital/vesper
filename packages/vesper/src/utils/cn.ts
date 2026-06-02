export const cn = (...args: (string | boolean | null | undefined)[]) =>
  args.filter((a) => typeof a === "string" && !!a).join(" ");
