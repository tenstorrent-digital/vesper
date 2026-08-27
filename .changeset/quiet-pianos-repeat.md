---
"@tenstorrent/vesper": patch
---

Warn in development when a prop passed to a form input can't be applied, and document where props are routed.

Props that are refused rather than forwarded — `role`, `aria-hidden`, and attributes an underlying primitive manages, such as `aria-expanded` on `Select` — now log a warning explaining why, instead of disappearing silently. Two mistakes that types can't catch are also reported:

- `aria-errormessage` supplied without the control being marked invalid, in which case assistive technology ignores it
- `aria-label` and `aria-labelledby` supplied together, where `aria-labelledby` wins and the `aria-label` goes unused

Warnings are stripped from production builds and logged at most once per message.

Attributes reserved by a component's underlying primitive are now type errors too, matching the props that were already refused at the type level.

Adds a [Prop Forwarding](/prop-forwarding) page documenting which element each prop lands on, and links it from every form input's page.
