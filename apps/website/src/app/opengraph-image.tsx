import { ImageResponse } from "next/og";

import { Tenstorrent } from "@tenstorrent/vesper/icons";

export const alt = "Vesper";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const PADDING = 60;

export default async function OpenGraphImage() {
  const iconSize = size.height - PADDING * 2;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: PADDING,
        background: "#f8fcfb",
        color: "#32ABD2",
      }}
    >
      <Tenstorrent width={iconSize} height={iconSize} />
    </div>,
    { ...size },
  );
}
