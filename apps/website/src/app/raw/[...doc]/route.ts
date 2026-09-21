import { docs, getDoc } from "@/lib/filesystem/docs";

export const dynamic = "force-static";

// 404 paths not found at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ doc: slug }));
}

export async function GET(_: Request, context: RouteContext<"/raw/[...doc]">) {
  const { doc } = await context.params;

  // We should point to our sitemap in the 404 response here when it is available
  const entry = getDoc(doc);
  if (!entry) return new Response("Not found", { status: 404 });

  return new Response(entry.markdown, {
    headers: {
      // `text/plain` so browsers (and agents) display it instead of downloading
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
