import { Avatar, type AvatarProps } from "@repo/vesper/avatar";
import { AvatarGroup } from "@repo/vesper/avatar-group";

const SIZES: AvatarProps["size"][] = ["sm", "md", "lg"];

export function AvatarPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      {SIZES.map((size) => (
        <div key={size} className="flex gap-vesper-4">
          <Avatar size={size} src="https://unsplash.it/300/400" />
          <AvatarGroup
            size={size}
            avatars={[
              { src: "https://unsplash.it/300/300" },
              { src: "https://unsplash.it/200/300" },
              { src: "https://unsplash.it/300/200" },
            ]}
          />
          <AvatarGroup
            size={size}
            avatars={[
              { src: "https://unsplash.it/300/300" },
              { src: "https://unsplash.it/200/300" },
              { src: "https://unsplash.it/300/200" },
              { src: "https://unsplash.it/200/200" },
              { src: "https://unsplash.it/400/300" },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
