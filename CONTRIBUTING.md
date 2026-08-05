# Contributing to Vesper

As Vesper is an open-source project, we welcome outside contributions. This document is meant to guide outside contributors who wish to participate in Vesper's development.

## Baseline requirements

**The most important rule for contributing to Vesper is that you must understand your code.** If you cannot explain the changes you have made on your own without the use of AI tools, then we cannot accept your contribution.

Using AI tools to contribute to and gain understanding of the codebase is encouraged, but submitting agent-generated code without understanding it yourself is not.

## Vouching/denouncement system

We use a vouching system to establish trust amongst contributors. If you have not been vouched for, you cannot contribute, and your pull requests will automatically be closed. If you have not been vouched and wish to contribute, please do the following:

1. Open a discussion in the "Vouch Request" category describing what you want to change and why. Please keep it brief and describe it using your own words. Do not have an AI write it.
2. If approved, a Vesper admin will comment `!vouch`
3. Once approved, you will be able to submit PRs

If you repeatedly submit low-quality contributions or otherwise do not respect the rules outlined in this document, you will be **denounced.** This adds your username to a public list of users that have not respected the contribution guidelines. If you are denounced, all future interactions with the Vesper project will be automatically closed by bots.

## Opening an issue

Typically issues will fall into one of three categories, each of which have issue templates:

1. **Bug Report** – Use this template to report a problem when using the `@tenstorrent/vesper` package itself. Issues related to css styling, rendering bugs, component prop behavior, etc. should use this template. You should _not_ use this template when opening an issue related to developing Vesper.
2. **Development Issue** – Use this template to report an issue when developing Vesper. Issues around tooling, mismatched dependencies, turbo, etc. are all considered development issues and not bug reports. You should _not_ use this template when opening an issue related to usage of the `@tenstorrent/vesper` package.
3. **Feature Request** – Use this template to propose a change to the `@tenstorrent/vesper` package itself. This template is limited to **component behavior and API changes**: new props, new variants of existing props, event handling, accessibility behavior, ref forwarding, exported types, etc. You should _not_ use this template to request visual/design changes or new components (see below).

> [!NOTE]
>
> Vesper implements a design system that is owned by the Tenstorrent design team. Requests for **visual/design changes** (colors, spacing, typography, iconography, motion, or new visual variants) and requests for **new components** cannot be resolved in this repository, and so are out of scope for the Feature Request template.
>
> If you'd like to propose a design change, please open a [discussion](https://github.com/tenstorrent-digital/vesper/discussions) instead. A maintainer must bring the request upstream to the design team first.

## Submitting a PR

As mentioned in [the vouching and denouncement system section](#vouchingdenouncement-system), you will not be able to submit a PR until you are vouched for. Once you have been approved by a Vesper admin, you will be able to submit PRs.

When submitting a PR, it is imperative that **you must understand the code you are submitting.** Low-quality contributions that are obviously AI-generated and not understood by the contributor will not be accepted and you may be denounced. AI-assisted contributions are welcome, but having a human-in-the-loop to edit and refine AI output is crucial. If you cannot explain and document the changes you are submitting without the help of an LLM, we cannot accept your contribution.

Prior to submitting a PR, it's highly preferred that you first [open an issue](#opening-an-issue), unless you are referencing an existing one in your PRs description.

For information on developing Vesper locally, as well as what is expected when making changes to the `@tenstorrent/vesper` package, please refer to the [README.md](README.md) in the root of this monorepo.

### Generating a changeset

Vesper uses [changesets](https://changesets.dev) to manage git tags, releases, changelogs, and publishing the `@tenstorrent/vesper` package to the npm registry. Whenever you make a contribution that impacts end-users who install Vesper, you _must_ generate a changeset or your PR will not pass checks and cannot be merged.

You can generate a changeset by running the following command:

```sh
yarn changeset
```

You will be asked to provide what kind of change you are making (patch, minor, or major), as well as a message describing the change. When you confirm the kind of change and the changeset message, a changeset file will be generated for you, which you should commit.

You can use these guidelines to determine which kind of change your contribution merits:

- `patch` – bug fixes and small tweaks that do not add new features, and do not change the behavior of an exported module for end users.
- `minor` – features that introduce new behavior or APIs, but are backwards-compatible and do not break existing implementations of exported modules.
- `major` – large changes or redesigns that introduce breaking changes to existing component implementations, and requires code updates prior to upgrading.

### Code review

Prior to merging your PR, any code changes you made must be reviewed. PRs require approvals from two contributors with write access, at least one of which must be a Vesper admin. All checks must also pass.

## AI Usage Policy

> [!NOTE]
>
> This AI usage policy was copied from [ghostty's AI usage policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md)

The Vesper project has strict rules for AI usage:

- **All AI usage in any form must be disclosed.** You must state
  the tool you used (e.g. Claude Code, Cursor, Amp) along with
  the extent that the work was AI-assisted.

- **The human-in-the-loop must fully understand all code.** If you
  can't explain what your changes do and how they interact with the
  greater system without the aid of AI tools, do not contribute
  to this project.

- **Issues and discussions can use AI assistance but must have a full
  human-in-the-loop.** This means that any content generated with AI
  must have been reviewed _and edited_ by a human before submission.
  AI is very good at being overly verbose and including noise that
  distracts from the main point. Humans must do their research and
  trim this down.

- **No AI-generated media is allowed (art, images, videos, audio, etc.).**
  Text and code are the only acceptable AI-generated content, per the
  other rules in this policy.

- **Bad AI drivers will be denounced** People who produce bad contributions
  that are clearly AI (slop) will be added to our public denouncement list.
  This list will block all future contributions. Additionally, the list
  is public and may be used by other projects to be aware of bad actors.
  We love to help junior developers learn and grow, but
  if you're interested in that then don't use AI, and we'll help you.
  I'm sorry that bad AI drivers have ruined this for you.

These rules apply only to outside contributions to Vesper. Maintainers
are exempt from these rules and may use AI tools at their discretion;
they've proven themselves trustworthy to apply good judgment.

## There are Humans Here

Please remember that Vesper is maintained by humans.

Every discussion, issue, and pull request is read and reviewed by
humans (and sometimes machines, too). It is a boundary point at which
people interact with each other and the work done. It is rude and
disrespectful to approach this boundary with low-effort, unqualified
work, since it puts the burden of validation on the maintainer.

In a perfect world, AI would produce high-quality, accurate work
every time. But today, that reality depends on the driver of the AI.
And today, most drivers of AI are just not good enough. So, until either
the people get better, the AI gets better, or both, we have to have
strict rules to protect maintainers.

## AI is Welcome Here

Vesper is written with plenty of AI assistance, and many maintainers embrace
AI tools as a productive tool in their workflow. As a project, we welcome
AI as a tool!

**Our reason for the strict AI policy is not due to an anti-AI stance**, but
instead due to the number of highly unqualified people using AI. It's the
people, not the tools, that are the problem.

I include this section to be transparent about the project's usage about
AI for people who may disagree with it, and to address the misconception
that this policy is anti-AI in nature.
