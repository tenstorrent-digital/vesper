---
"@tenstorrent/vesper": patch
---

`<CodeBlock>` now highlights code with [`@pierre/highlights`](https://diffs.com/docs#highlights) instead of Shiki:

- The `lang` prop now takes a language name or alias as a string (eg. `lang="typescript"` or `lang="ts"`) instead of grammar objects from `@shikijs/langs`. Over 150 languages are built in, so there are no grammars to import or supply, and custom TextMate grammars are no longer supported. Unsupported languages render as plain text.
- The rendered markup no longer uses Shiki's class names: `pre.shiki` is now `pre.vesper-code-block-pre`, `.line` is now `.vesper-code-block-line`, and dark theme token styles are now stored in `--hls-dark*` custom properties instead of `--shiki-dark*`.
- ANSI colors now use Vesper's color palette.
- Copying a streamed code block now preserves its line breaks.
