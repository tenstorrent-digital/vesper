import { Admonition } from "@tenstorrent/vesper/admonition";

export default function NotFound() {
  return (
    <main>
      <Admonition variant="danger">
        Could not find requested resource
      </Admonition>
    </main>
  );
}
