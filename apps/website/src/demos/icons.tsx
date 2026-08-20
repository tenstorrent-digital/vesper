import { Icon, ICON_KINDS } from "@tenstorrent/vesper/icons";
import { Tooltip } from "@tenstorrent/vesper/tooltip";

export function IconsDemo() {
  return (
    <div className="flex flex-wrap gap-1">
      {ICON_KINDS.map((kind) => (
        <Tooltip key={kind} content={kind}>
          <Icon kind={kind} style={{ width: 24 }} />
        </Tooltip>
      ))}
    </div>
  );
}
