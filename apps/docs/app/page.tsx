import { Icon } from "@repo/react/Icon";

import "@repo/tokens/style.css";

export default function Page() {
  return (
    <div style={{ colorScheme: "dark" }}>
      <Icon
        kind="tenstorrent"
        style={{ color: "var(--stone-500)" }}
        width={48}
        height={48}
      />
    </div>
  );
}
