import { Icon } from "@repo/react";
import { colors } from "@repo/tokens";

export default function Page() {
  return (
    <Icon
      kind="tenstorrent"
      style={{ color: colors.light["teal-500"] }}
      width={48}
      height={48}
    />
  );
}
