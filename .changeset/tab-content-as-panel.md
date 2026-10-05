---
"@tenstorrent/vesper": minor
---

Added a new prop to `TabItem`, `contentAsPanel`, that allows consumers to control whether a tab panel's `content` renders as the tab panel itself via prop forwarding. The behavior prior to this change was to _always_ treat a tab's `content` as the panel itself.
