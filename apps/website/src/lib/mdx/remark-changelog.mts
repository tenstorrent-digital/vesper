/**
 * remark plugin that adapts the changelog of `@tenstorrent/vesper` (written by
 * changesets) to the site without changing the file itself
 *
 * - the commit at the start of each change (eg. `ed0452c: `) moves to the end
 *   of the change as a link to that commit on github
 * - images render at avatar size (the only images in the changelog are its
 *   authors' avatars, which have no size of their own)
 *
 * every other document is left alone
 *
 * @see [`src/lib/changelog.mts`](apps/website/src/lib/changelog.mts)
 */

import type { Nodes, Root } from "mdast";
import type { Transformer } from "unified";

import { isChangelog, REPOSITORY_URL } from "../changelog.mts";

/** a short (or full) commit hash at the start of a change, eg. `ed0452c: ` */
const COMMIT_PREFIX = /^([0-9a-f]{7,40}): /;

/** size of the avatars in the changelog, in pixels */
const AVATAR_SIZE = 40;

/** moves the commit a change starts with (eg. `ed0452c: `) into a link */
const linkCommit = (node: Nodes) => {
  if (node.type !== "listItem") return;

  const [paragraph] = node.children;
  if (paragraph?.type !== "paragraph") return;

  const [text] = paragraph.children;
  if (text?.type !== "text") return;

  const match = text.value.match(COMMIT_PREFIX);
  if (!match?.[1]) return;

  const [prefix, commit] = match;
  text.value = text.value.slice(prefix.length);
  paragraph.children.push(
    { type: "text", value: " " },
    {
      type: "link",
      url: `${REPOSITORY_URL}/commit/${commit}`,
      title: `View commit ${commit} on GitHub`,
      children: [{ type: "inlineCode", value: commit }],
    },
  );
};

const sizeAvatar = (node: Nodes) => {
  if (node.type !== "image") return;

  node.data = {
    ...node.data,
    hProperties: { width: AVATAR_SIZE, height: AVATAR_SIZE },
  };
};

const visit = (node: Nodes, visitor: (node: Nodes) => void): void => {
  visitor(node);
  if ("children" in node)
    node.children.forEach((child) => visit(child, visitor));
};

export default function remarkChangelog(): Transformer<Root> {
  return (tree, file) => {
    if (!isChangelog(file.path)) return;

    visit(tree, (node) => {
      linkCommit(node);
      sizeAvatar(node);
    });
  };
}
