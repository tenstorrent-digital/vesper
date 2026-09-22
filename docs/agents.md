---
title: Usage with Agents
description: Published resources for coding agents working with Vesper
order: 3
---

# Using Vesper with Agents

## For Humans

Vesper's documentation was created to be easily intuited by agents. You can simply point your agent at `vesper.tenstorrent.com` and it should be able to handle the rest:

```
Check out the Vesper docs here: vesper.tenstorrent.com
```

Every page of this documentation is also published as plain Markdown, so agents can access Vesper's documentation directly in agent-friendly format by:

1. Appending `.md` to any documentation route URL
2. Going to `/llms.txt` for an overview of Vesper, its APIs, and other agent resources
3. Going to `/llms-full.txt` for everything in one network call

> [!TIP]
> 
> You can also use the **copy as markdown** and **copy as prompt** buttons at the bottom of each page to paste into an agent chat directly.

## For Agents

### Start here

Two entry points cover the whole documentation set:

- [llms.txt](https://vesper.tenstorrent.com/llms.txt): an index of every page, linking to its Markdown source. Start here and fetch only the pages you need.
- [llms-full.txt](https://vesper.tenstorrent.com/llms-full.txt): the full text of every page, inlined in a single response.

### Markdown for any page

Append `.md` to any documentation URL to get the Markdown source of that page. These responses are served as plain text, so an agent can fetch and read them as they are. This works for every page listed in `llms.txt`, including this one.
