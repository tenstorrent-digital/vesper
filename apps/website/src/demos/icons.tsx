import { Icon, ICON_KINDS } from "@tenstorrent/vesper/icons";

export function IconsDemo() {
  return (
    <div className="flex flex-wrap gap-1">
      {ICON_KINDS.map((kind) => (
        <Icon key={kind} kind={kind} style={{ width: 24 }} />
      ))}
    </div>
  );
}
