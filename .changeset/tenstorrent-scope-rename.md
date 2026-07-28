---
"@tenstorrent/vesper": minor
---

Rename the package from `@repo/vesper` to `@tenstorrent/vesper`.

All imports must be updated to the new scope:

```diff
-import { Button } from "@repo/vesper/button";
-import "@repo/vesper/styles.css";
+import { Button } from "@tenstorrent/vesper/button";
+import "@tenstorrent/vesper/styles.css";
```

This is the first release managed by changesets. The package is not published to npm yet — releases
currently produce a changelog entry and a git tag only.
