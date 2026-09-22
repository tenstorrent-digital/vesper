/**
 * renders every `.md`/`.mdx` file in the monorepo root `docs/` folder
 *
 * (page routes declared explicitly in `src/app` (eg. `/components`) will
 * take precedence over this catch-all route)
 */

import type { Metadata } from "next";

import { BASE_URL } from "@/lib/constants";
import { docs, getDoc } from "@/lib/filesystem/docs";
import { loadDoc } from "@/lib/filesystem/docs/load";
import { getMetadata } from "@/lib/metadata";

// 404 paths not found at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ doc: slug }));
}

export async function generateMetadata(
  props: PageProps<"/[...doc]">,
): Promise<Metadata> {
  const { doc } = await props.params;
  const { title, description } = getDoc(doc)?.frontmatter ?? {};

  const path = `/${doc.join("/")}`;

  return getMetadata({
    title,
    description,
    path,
    alternates: {
      types: {
        "text/markdown": `${BASE_URL}${path}.md`,
      },
    },
  });
}

export default async function Page(props: PageProps<"/[...doc]">) {
  const { doc } = await props.params;

  const entry = getDoc(doc);
  const { default: Doc } = await loadDoc(entry!);

  return <Doc />;
}
