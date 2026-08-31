# Contributing to Vesper

As Vesper is an open-source project, we welcome outside contributions. This document is meant to guide outside contributors who wish to participate in Vesper's development.

## Baseline Requirements

> [!IMPORTANT]
>
> **The most important rule for contributing to Vesper is that you must understand your code.** If you cannot explain the changes you have made on your own without the use of AI tools, then we cannot accept your contribution.

Using AI tools to contribute to and gain understanding of the codebase is allowed, but submitting agent-generated code without understanding it yourself is not.

For more information, please read our [AI policy](AI_POLICY.md).

## Vouch/Denounce System

We use a vouching system to establish trust amongst contributors. If you have not been vouched for, you cannot contribute, and your pull requests will automatically be closed. If you have not been vouched and wish to contribute, please do the following:

1. Open a discussion in the "Vouch Request" category describing what you want to change and why. Please keep it brief and describe it using your own words. Do not have an AI write it.
2. If approved, a Vesper admin will comment `!vouch`
3. Once approved, you will be able to submit PRs

> [!WARNING]
>
> If you repeatedly submit low-quality contributions or otherwise do not respect the rules outlined in this document, you will be **denounced.** This adds your username to a public list of users that have not respected the contribution guidelines. If you are denounced, all future interactions with the Vesper project will be automatically closed by bots.

## Opening Issues

Typically issues will fall into one of three categories, each of which have issue templates:

1. **Bug Report** – Use this template to report a problem when using the `@tenstorrent/vesper` package itself. Issues related to css styling, rendering bugs, component prop behavior, etc. should use this template. You should _not_ use this template when opening an issue related to developing Vesper.
2. **Development Issue** – Use this template to report an issue when developing Vesper. Issues around tooling, mismatched dependencies, turbo, etc. are all considered development issues and not bug reports. You should _not_ use this template when opening an issue related to usage of the `@tenstorrent/vesper` package.
3. **Feature Request** – Use this template to propose a change to the `@tenstorrent/vesper` package itself. This template is limited to **component behavior and API changes**: new props, new variants of existing props, event handling, accessibility behavior, ref forwarding, exported types, etc. You should _not_ use this template to request visual/design changes or new components (see below).

> [!NOTE]
>
> Vesper implements a design system that is owned by the Tenstorrent design team. Requests for **visual/design changes** (colors, spacing, typography, iconography, motion, or new visual variants) and requests for **new components** cannot be resolved in this repository, and so are out of scope for the Feature Request template.
>
> If you'd like to propose a design change, please open a [discussion](https://github.com/tenstorrent-digital/vesper/discussions) instead. A maintainer must bring the request upstream to the design team first.

## Branch Naming Conventions

Branch names follow the convention `<username>/[<issue-id>-]<branch-name>`, where:

- `<username>`: contributor's name, username, etc
- `<issue-id>`: Github issue ID (optional but preferred)
- `<branch-name>`: descriptive branch name

Issue IDs are optional but preferred. Ideally, if there is no issue, open one first and then use the issue ID in your branch name. In the case where your PR addresses multiple issues, use the issue ID for the main issue and then make sure to reference all of the related issues in your PR description.

## Submitting PRs

As mentioned in [the vouching and denouncement system section](#vouchingdenouncement-system), you will not be able to submit a PR until you are vouched for. Once you have been approved by a Vesper admin, you will be able to submit PRs.

When submitting a PR, it is imperative that **you must understand the code you are submitting.** Low-quality contributions that are obviously AI-generated and not understood by the contributor will not be accepted and you may be denounced. AI-assisted contributions are welcome, but having a human-in-the-loop to edit and refine AI output is crucial. If you cannot explain and document the changes you are submitting without the help of an LLM, we cannot accept your contribution.

Prior to submitting a PR, it's highly preferred that you first [open an issue](#opening-an-issue), unless you are referencing an existing one in your PRs description.

For information on developing Vesper locally, as well as what is expected when making changes to the `@tenstorrent/vesper` package, please refer to the [README.md](README.md) in the root of this monorepo.

### Generating changesets

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

#### PRs requiring multiple changesets

Sometimes you will want to generate multiple changesets for a PR. It is recommended to keep your PRs scoped to a single change, though sometimes this is unavoidable. In such cases, you can generate multiple changesets to describe each change made.

An example of when this could happen is if a change to module `A` depends on a change to module `B`, with both changes happening in a single PR.

### Reviews

Prior to merging your PR, any code changes you made must be reviewed. PRs require approvals from two contributors with write access, at least one of which must be a Vesper admin. All checks must also pass.
