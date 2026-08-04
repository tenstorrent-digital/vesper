/** checkerboard pattern shown underneath the token color */
const CHECKERBOARD =
  "repeating-conic-gradient(var(--vesper-alpha-contrast-200) 0% 25%, transparent 0% 50%) 0 0 / 0.5rem 0.5rem";

/**
 * Renders a small chip previewing the value of a vesper color token
 *
 * The chip resolves the token against the active theme, and is layered over a
 * checkerboard so that transparent/alpha tokens stay readable
 */
export const ColorChip = ({ token }: { token: string }) => (
  <span
    aria-hidden
    title={token}
    className="outline-vesper-base outline-vesper-border-primary rounded-vesper-half size-vesper-5 inline-block align-middle"
    style={{
      background: [
        `linear-gradient(var(--vesper-${token})`,
        `var(--vesper-${token}))`,
        CHECKERBOARD,
      ].join(","),
    }}
  />
);
