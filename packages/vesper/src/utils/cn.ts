export const cn = (...args: (string | number | boolean | null | undefined)[]) =>
  args.filter((a) => typeof a === "string" && !!a).join(" ");
