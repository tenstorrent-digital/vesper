---
title: Agents
description: Published resources for coding agents working with Vesper
order: 3
---

# Agents

Every page of this documentation is published as plain Markdown, so a coding agent can work from Vesper's real component APIs instead of guessing at them.

## Start here

Two entry points cover the whole documentation set:

- [llms.txt](https://vesper.tenstorrent.com/llms.txt): an index of every page, linking to its Markdown source. Start here and fetch only the pages you need.
- [llms-full.txt](https://vesper.tenstorrent.com/llms-full.txt): the full text of every page, inlined in a single response.

## Markdown for any page

Append `.md` to any documentation URL to get the Markdown source of that page. These responses are served as plain text, so an agent can fetch and read them as they are. This works for every page listed in `llms.txt`, including this one.

## Copying a page by hand

On the [documentation site](https://vesper.tenstorrent.com), every page has two buttons at the bottom:

- **copy as markdown** copies that page's Markdown source.
- **copy as prompt** copies the same Markdown behind a short instruction, ready to paste into a chat.

## Automatic discovery

Every response from the documentation site advertises the files above in its headers, so an agent that lands on any URL can find them without being told where to look:

```http
Link: </llms.txt>; rel="llms-txt", </llms-full.txt>; rel="llms-full-txt"
X-Llms-Txt: /llms.txt
```

The index is also mirrored at [`/.well-known/llms.txt`](https://vesper.tenstorrent.com/.well-known/llms.txt), for tools that look there first.
