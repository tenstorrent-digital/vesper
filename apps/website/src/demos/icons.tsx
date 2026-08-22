import { Icon, ICON_KINDS } from "@tenstorrent/vesper/icons";
import { Tooltip } from "@tenstorrent/vesper/tooltip";

export function IconsDemo() {
  return (
    <div className="flex flex-wrap gap-1">
      {ICON_KINDS.map((kind) => (
        <Tooltip key={kind} content={kind}>
          <Icon
            kind={kind}
            tabIndex={0}
            aria-label={`${kind} icon`}
            className="focus-visible:shadow-vesper-focus-ring outline-none"
            style={{ width: 24 }}
          />
        </Tooltip>
      ))}
    </div>
  );
}
