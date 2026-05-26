import { Icon } from "@repo/react/Icon";

import "@repo/tokens/styles.css";

export default function Page() {
  return (
    <Icon
      kind="tenstorrent"
      style={{ color: "var(--teal-500)" }}
      width={48}
      height={48}
    />
  );
}
