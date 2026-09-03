import type { Metadata } from "next";

import { Gallery } from "@/components/showcase/gallery";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Every component in the Vesper design system, previewed live and filterable by category.",
};

export default function Page() {
  return <Gallery />;
}
