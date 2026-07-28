# TT-631: Release pipeline — rename to `@tenstorrent/vesper` + Changesets (no npm publish yet)

Branch: `simon/tt-631-release-pipeline-changelog-changesets`

## Goal

Stand up the full Changesets release workflow (changelogs, version PRs, git tags, PR enforcement)
**while the repo is private and the `@tenstorrent` npm scope is unavailable**, so that going public +
publishing later is a small, well-understood diff rather than a new project.

---

## Current State

### Repo layout

- Yarn 1 (classic) workspaces + Turborepo (`turbo.jsonc` at root), Node `v24.13.1` (`.nvmrc`).
- Workspaces:
  - `packages/vesper` — `@repo/vesper`, `version: 0.0.0`, `"private": false`, ESM-only, `files: ["dist"]`,
    ~40 subpath `exports` (per-component + `./styles.css` + `./tailwind.css`), `peerDependencies` on React 19.
  - `apps/docs` — `docs` (private), Next.js site, depends on `"@repo/vesper": "*"`.
  - `packages/eslint-config` — `@repo/eslint-config` (private).
  - `packages/typescript-config` — `@repo/typescript-config` (private, oddly has `publishConfig.access: public`).
- Remote: `https://github.com/tenstorrent-digital/vesper.git`, default branch `main`, repo currently **private**.
- Root `.npmrc` exists but is empty.

### CI

- Only `.github/workflows/vesper-test.yml`: runs `yarn test:vesper` on PRs/pushes to `main`, path-filtered to
  `packages/vesper/**`, `packages/typescript-config/**`, `packages/eslint-config/**`.
- No release, versioning, changelog, or publish automation of any kind.
- No `CHANGELOG.md` anywhere; no git tags used for releases.

### `@repo/vesper` references

54 files reference `@repo/vesper` (excluding `node_modules`, `yarn.lock`, `dist`):

| Kind | Files |
| --- | --- |
| Package name | `packages/vesper/package.json` |
| Docs dependency | `apps/docs/package.json` |
| Turbo task refs | `turbo.jsonc` (`@repo/vesper#dev`, `@repo/vesper#watch`), `apps/docs/turbo.jsonc` (`@repo/vesper#build:storybook`) |
| Turbo filters | root `package.json` scripts (7 occurrences: `build:vesper`, `build:storybook`, `test:vesper`, `test:vesper:update`, `test:watch:vesper`, `generate:icons`, `scaffold:component`) |
| CSS import | `apps/docs/src/lib/style/css/globals.css` (`@import "@repo/vesper/tailwind.css"`) |
| Docs source | `apps/docs/src/**` — ~48 `.tsx`/`.mdx` files (component pages, demos, nav, `mdx-components.tsx`, `lib/constants.ts`) |
| Prose | `packages/vesper/README.md` (9 occurrences) |

`yarn.lock` contains **no** `@repo/vesper` entry (workspace deps aren't locked by Yarn 1), so the rename is
lockfile-neutral.

---

## Problems Identified

1. **Package is named for the wrong registry identity.** `@repo/*` is the Turborepo scaffold convention for
   internal-only packages. The publish target is `@tenstorrent/vesper`; every day we wait, more docs/source
   imports accumulate that will need rewriting.
2. **No versioning story.** `version: 0.0.0` never moves, there is no changelog, and nothing links merged PRs
   to a released artifact. Consumers (currently only `apps/docs`) can't tell what changed.
3. **No release automation.** Publishing later would be a manual, error-prone `npm publish` from a laptop.
4. **No enforcement.** Nothing prompts or requires contributors to describe user-facing changes at PR time.
   Retrofitting changelog discipline after the fact is much harder than starting with it.
5. **Accidental-publish risk.** `packages/vesper/package.json` currently has `"private": false` with no
   `publishConfig`, so a stray `npm publish` in `packages/vesper` would attempt a real publish.

---

## Proposed Changes

### P0 — Rename `@repo/vesper` → `@tenstorrent/vesper`

Do this **first and as its own commit/PR**, before Changesets exists, so the rename never shows up in a
changelog and never collides with a version PR.

**1. Package manifest** — `packages/vesper/package.json`:

```jsonc
{
  "name": "@tenstorrent/vesper",
  "version": "0.0.0",
  "private": true, // temporary publish guard — see P1
  // ...
}
```

Also add publish-facing metadata now (harmless while private, one less thing in Phase 2):

```jsonc
{
  "description": "Vesper — Tenstorrent's React design system.",
  "license": "MIT", // confirmed against packages/vesper/LICENSE
  "repository": {
    "type": "git",
    "url": "git+https://github.com/tenstorrent-digital/vesper.git",
    "directory": "packages/vesper"
  },
  "homepage": "https://github.com/tenstorrent-digital/vesper#readme",
  "bugs": { "url": "https://github.com/tenstorrent-digital/vesper/issues" },
  "publishConfig": { "access": "public" },
  "engines": { "node": ">=22" }
}
```

**2. Mechanical rewrite** of the remaining 53 files:

```bash
# from repo root
rg -l "@repo/vesper" --hidden -g '!node_modules' -g '!yarn.lock' -g '!dist' -g '!.git' \
  | xargs sed -i '' 's|@repo/vesper|@tenstorrent/vesper|g'
```

This covers `apps/docs/package.json`, both `turbo.jsonc` files, root `package.json` turbo filters,
`globals.css`, all docs `.mdx`/`.tsx`, and `packages/vesper/README.md`.

**3. Yarn 1 caveat.** `apps/docs` depends on `"@tenstorrent/vesper": "*"`. Yarn classic has no `workspace:`
protocol; `*` resolves to the local workspace because the local version satisfies the range. Keep `*` — it
stays satisfied after every version bump and never causes Changesets to rewrite the range. (Once the package
is on npm, verify `yarn install` still links the workspace copy and does not fetch the registry version;
`yarn workspaces info` should show `docs -> @tenstorrent/vesper` as a workspace dependency.)

**4. Verify** (in order):

```bash
yarn install                 # relink workspaces
yarn lint
yarn check-types
yarn build                   # vesper + docs (docs build depends on vesper#build:storybook)
yarn test:vesper
yarn dev:docs                # smoke-test the docs site renders
```

**5. Non-obvious follow-ups:**

- **ESLint import grouping.** `packages/eslint-config/base.js` has an explicit `simple-import-sort` group for
  monorepo-internal packages: `["^(@repo)(/.*|$)"]`. After the rename, vesper imports fall into the generic
  third-party group, and `eslint --fix` reshuffles imports in every docs file that imports it. Widen the group
  to `["^(@repo|@tenstorrent)(/.*|$)"]` so the existing convention (and the diff) is preserved.
- `turbo.jsonc` needs a `prettier --write` pass afterwards — the longer package name pushes `dev:docs.with`
  past the print width.

- Turbo cache: local `.turbo` entries are keyed by package name; expect full rebuilds after the rename. No action needed.
- Check the Vercel (or other host) project for `apps/docs`: any build command / ignored-build-step /
  `--filter=@repo/vesper` reference in the dashboard must be updated to `@tenstorrent/vesper`.
- `turbo/generators/config.ts` templates reference `packages/n` (stale scaffold paths) — out of scope here,
  but flag it: `yarn scaffold:component` may already be broken.
- Root `README.md` is known-stale; deliberately **not** updated in this plan.

### P1 — Install and configure Changesets

**1. Install** (root dev dependency, Yarn 1 requires `-W`):

```bash
yarn add -D -W @changesets/cli
npx changeset init
```

`changeset init` creates `.changeset/config.json` and `.changeset/README.md`.

**2. `.changeset/config.json`** — the interim (private, no-npm) configuration:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["docs", "@repo/eslint-config", "@repo/typescript-config"],
  "privatePackages": { "version": true, "tag": true }
}
```

Why each line matters:

- **`privatePackages: { version: true, tag: true }`** — this is the crux of "Changesets without npm".
  `packages/vesper` is `"private": true`, so `changeset publish` will **skip the npm publish** entirely but
  still create and push the git tag (`@tenstorrent/vesper@0.1.0`). We get versions + changelogs + tags now,
  and flipping `private` to `false` later turns on real publishing with no workflow rewrite.
- **`ignore`** — the other three workspaces are never released. Without this, `changeset status` would demand
  a changeset for docs-only or eslint-config-only PRs. (Safe here: `docs` is ignored and nothing depends on
  it; Changesets only errors when a *non-ignored* package depends on an ignored one.)
- **`changelog: "@changesets/cli/changelog"`** — the default generator, which needs no GitHub token. Switch to
  `@changesets/changelog-github` in Phase 2 (it enriches entries with PR/author links but requires a token at
  `changeset version` time, which is friction while private).
- **`access: "restricted"`** — belt-and-braces; flips to `"public"` in Phase 2.
- **`commit: false`** — the GitHub Action owns commits.

**3. Root `package.json` scripts:**

```jsonc
{
  "scripts": {
    "changeset": "changeset",
    "changeset:status": "changeset status --since=origin/main",
    "changeset:version": "changeset version && prettier --write \"**/CHANGELOG.md\" \".changeset/*.md\"",
    // interim: no-op for npm (package is private), still creates + pushes git tags
    "changeset:release": "changeset publish"
  }
}
```

The `prettier --write` in `changeset:version` keeps generated `CHANGELOG.md` files from failing `yarn format`
checks. (Alternative: add `**/CHANGELOG.md` to `.prettierignore`.)

**4. Versioning policy** (document it — see P2.4): leave `version` at `0.0.0` and make the **first changeset a
`minor`**, which lands `0.1.0`. Pre-1.0 semantics: `minor` = breaking change, `patch` = feature or fix.
Revisit at Phase 2 when we cut `1.0.0`.

**5. Add a first changeset** so the pipeline has something to release end-to-end:

```bash
yarn changeset            # select @tenstorrent/vesper, minor, "rename package to @tenstorrent/vesper"
```

### P2 — Workflows

**1. `.github/workflows/release.yml`** — version PR + tag on merge to `main`:

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write # commit version bumps, push tags
  pull-requests: write # open/update the "Version Packages" PR

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v5
        with:
          node-version: "24"
          cache: "yarn"

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: Create Release PR or Tag Release
        uses: changesets/action@v1
        with:
          version: yarn changeset:version
          publish: yarn changeset:release
          commit: "chore(release): version packages"
          title: "chore(release): version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Behaviour:

- Unreleased changesets on `main` → the action opens/updates a **"Version Packages"** PR containing the
  version bump + `packages/vesper/CHANGELOG.md` + deleted changeset files.
- That PR merged → no changesets remain → the action runs `publish` → `changeset publish` skips npm (private)
  and pushes tag `@tenstorrent/vesper@X.Y.Z`.

Repo settings this depends on (**do these before the first run**):

- Settings → Actions → General → **Allow GitHub Actions to create and approve pull requests** = on.
- Settings → Actions → General → Workflow permissions = **Read and write**.
- Known limitation: PRs opened with the default `GITHUB_TOKEN` **do not trigger other workflows**, so
  `vesper-test.yml` and the changeset gate will not run on the Version PR. Acceptable for now (the content is
  machine-generated). If we want checks there, swap in a GitHub App token
  (`actions/create-github-app-token`) or a fine-grained PAT.
- Optional: also add a step that creates a GitHub Release from the tag + changelog section
  (`changesets/action` only auto-creates releases for packages it actually published to npm). Cheap version:

  ```yaml
  - name: Create GitHub Release
    if: steps.changesets.outputs.published == 'true'
    run: gh release create "${{ fromJSON(steps.changesets.outputs.publishedPackages)[0].name }}@..." --generate-notes
  ```

  Defer unless we want release notes visible before going public.

**2. `.github/workflows/changeset-check.yml`** — require a changeset on every PR:

```yaml
name: Changeset Check

on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened, labeled, unlabeled]

concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  changeset:
    # skip the bot's own version PR, and allow an explicit opt-out label
    if: >-
      github.head_ref != 'changeset-release/main' &&
      !contains(github.event.pull_request.labels.*.name, 'skip-changeset')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0

      - name: Fetch base branch
        run: git fetch origin ${{ github.base_ref }}:${{ github.base_ref }} --depth=1 || git fetch origin ${{ github.base_ref }}

      - name: Setup Node.js
        uses: actions/setup-node@v5
        with:
          node-version: "24"
          cache: "yarn"

      - name: Install Dependencies
        run: yarn install --frozen-lockfile

      - name: Verify a changeset exists for changed packages
        run: yarn changeset status --since=origin/${{ github.base_ref }}
```

`changeset status --since` exits non-zero when a **non-ignored** package changed without a covering changeset.
Because of the `ignore` list, PRs that only touch `apps/docs` or the config packages pass automatically.

Escape hatches for genuinely non-releasing `packages/vesper` changes (tests, comments, internal refactors):

1. `yarn changeset --empty` → commits an empty changeset (preferred: explicit, self-documenting), or
2. apply the `skip-changeset` label to the PR (create the label as part of this work).

**3. Branch protection** on `main`: add **`Changeset Check / changeset`** to required status checks alongside
the existing Vesper test job. Also require branches to be up to date so `--since` diffs stay meaningful.

**4. Contributor documentation:**

- Add `CONTRIBUTING.md` (or a `## Releases` section in it) covering: when a changeset is required, how to run
  `yarn changeset`, choosing patch/minor under 0.x, the empty-changeset escape hatch, and what the Version PR is.
- Add a short "Changesets" section to `AGENTS.md` so agents add a changeset when they modify `packages/vesper`.
- Note explicitly in both: **nothing publishes to npm yet** — releases currently produce a changelog + git tag only.

**5. Optional: install the [changeset-bot](https://github.com/apps/changeset-bot) GitHub App** on the repo. It
comments on every PR with an "Add a changeset" link and a live status. Works on private repos. It does *not*
block merges — the `Changeset Check` job is the actual gate; the bot is UX sugar.

### P3 — Nice-to-haves (after the pipeline is green)

- Surface `packages/vesper/CHANGELOG.md` on the docs site (`apps/docs`) as a `/changelog` page.
- Snapshot/canary releases for testing pre-release builds (only useful once we can publish — see Phase 2).
- Dependabot / renovate config so dependency PRs come with `skip-changeset` applied automatically.

---

## Implementation Priority

| Priority | Work | Ships as |
| --- | --- | --- |
| **P0** | Rename `@repo/vesper` → `@tenstorrent/vesper` (+ manifest metadata, `private: true`) | PR 1 |
| **P1** | Install Changesets, `.changeset/config.json`, root scripts, first changeset | PR 2 |
| **P2** | `release.yml`, `changeset-check.yml`, `skip-changeset` label, branch protection, CONTRIBUTING/AGENTS docs | PR 2 (or PR 3) |
| **P3** | Changelog page in docs, dependabot, canary tooling | Later |

Suggested split: **PR 1 = rename only** (big mechanical diff, easy to review, no changeset needed since
Changesets doesn't exist yet). **PR 2 = Changesets + workflows** (small diff, includes the first changeset,
which then exercises the full pipeline on merge).

### Definition of done (interim)

- [ ] `packages/vesper/package.json` is `@tenstorrent/vesper`, `private: true`, with repo/license metadata.
- [ ] Zero `@repo/vesper` references outside `node_modules`/`dist`.
- [ ] `yarn lint`, `yarn check-types`, `yarn build`, `yarn test:vesper` all pass.
- [ ] Merging a PR with a changeset produces a "Version Packages" PR.
- [ ] Merging the Version PR bumps `version`, writes `packages/vesper/CHANGELOG.md`, and pushes tag
      `@tenstorrent/vesper@0.1.0`.
- [ ] **No npm publish occurs** (confirm the release job logs `No unpublished projects to publish` / skips private).
- [ ] A PR touching `packages/vesper` without a changeset fails `Changeset Check`.
- [ ] `Changeset Check` is a required status check on `main`.

---

## Phase 2 — Going public and publishing to npm

Everything below is deliberately deferred; it becomes a **single small PR plus a few settings changes** once
IT hands over the `@tenstorrent` npm org.

### 2.1 Prerequisites (not code)

- [ ] npm organization `tenstorrent` created; our team added with publish rights.
- [ ] Decide 2FA policy for the org. If "2FA required for publishing", use a **granular access token** with
      *automation* type (bypasses 2FA in CI) scoped to `@tenstorrent/vesper` only.
- [ ] Store it as repository secret `NPM_TOKEN` (or an org secret shared with this repo). Long term this
      secret can go away entirely — see the Trusted Publishing note in 2.6.
- [ ] Legal/branding sign-off to make `tenstorrent-digital/vesper` public.

### 2.2 Pre-publicization repo hygiene

- [ ] Scan git **history** for secrets (`gitleaks detect --log-opts="--all"` or `trufflehog git file://.`).
- [ ] Rewrite the stale root `README.md` (install instructions, links to docs site, badge row).
- [ ] Add `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/CODEOWNERS`, PR/issue templates.
- [ ] Confirm `LICENSE` at root and `packages/vesper/LICENSE` agree, and that the `license` field matches.
- [ ] Remove/relocate anything internal-only (`test-results/`, `debug-storybook.log`, `.helix`/`.zed`
      settings if undesired, internal Linear references in committed plans).
- [ ] Re-check branch protection + required checks survive the visibility change.

### 2.3 Package changes (`packages/vesper/package.json`)

- [ ] `"private": false` (this alone re-enables npm publishing through the existing workflow).
- [ ] `"publishConfig": { "access": "public", "registry": "https://registry.npmjs.org" }` — required for the
      first publish of a scoped package.
- [ ] Confirm `files`, `exports`, `sideEffects`, `peerDependencies`, `engines` are correct for consumers.
- [ ] Validate the tarball before the first publish:

  ```bash
  yarn build:vesper
  cd packages/vesper && npm pack --dry-run
  npx publint                              # manifest/exports lint
  npx @arethetypeswrong/cli --pack .       # ESM/types resolution across bundlers
  ```

- [ ] Decide whether the first public release is `0.x` (still evolving) or `1.0.0` (API frozen). If `1.0.0`,
      exit 0.x semantics and update the versioning policy in `CONTRIBUTING.md`.

### 2.4 Changesets config changes (`.changeset/config.json`)

```diff
-  "changelog": "@changesets/cli/changelog",
+  "changelog": ["@changesets/changelog-github", { "repo": "tenstorrent-digital/vesper" }],
-  "access": "restricted",
+  "access": "public",
-  "privatePackages": { "version": true, "tag": true }
+  "privatePackages": { "version": false, "tag": false }
```

- `@changesets/changelog-github` needs `yarn add -D -W @changesets/changelog-github` and a `GITHUB_TOKEN` in
  the environment when `changeset version` runs (already present in the release workflow).
- `privatePackages` can revert to defaults because `@tenstorrent/vesper` is no longer private; the other three
  workspaces stay excluded via `ignore`.

### 2.5 Release workflow changes (`.github/workflows/release.yml`)

```diff
 permissions:
   contents: write
   pull-requests: write
+  id-token: write            # npm provenance — see 2.6

       - name: Setup Node.js
         uses: actions/setup-node@v5
         with:
           node-version: "24"
           cache: "yarn"
+          registry-url: "https://registry.npmjs.org"

+      - name: Build
+        run: yarn build:vesper
+
       - name: Create Release PR or Publish
         uses: changesets/action@v1
         with:
           version: yarn changeset:version
           publish: yarn changeset:release
         env:
           GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
+          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
+          NPM_CONFIG_PROVENANCE: true
```

And make the build part of the release script so it can never publish stale `dist/`:

```jsonc
"changeset:release": "turbo run build --filter=@tenstorrent/vesper && changeset publish"
```

With `publish` wired up and packages actually published, `changesets/action` will also create **GitHub
Releases** automatically (`createGithubReleases` defaults to true) — drop any interim `gh release create` step.

### 2.6 npm provenance (detail)

**What it is.** When npm publishes with provenance, the npm CLI asks GitHub Actions for a short-lived OIDC
token, builds a signed [SLSA](https://slsa.dev) build attestation ("this tarball was built by *this* workflow,
from *this* repo, at *this* commit"), signs it via [Sigstore](https://www.sigstore.dev/), and records it in
the public Rekor transparency log. npmjs.com then renders a **"Built and signed on GitHub Actions"** badge on
the package page linking to the source commit and workflow run, and consumers can verify it locally. It is the
cheapest available defence against a compromised token silently shipping a tarball that doesn't match our
source.

**Hard requirements** (all must be true, or `npm publish` fails):

| Requirement | Our status after Phase 2 | Notes |
| --- | --- | --- |
| Package published **publicly** | ✅ `publishConfig.access: "public"` (2.3) | Provenance is rejected for private/restricted packages: `ENEEDAUTH`/`Provenance generation not supported for private packages`. This is why provenance can only land **after** `private: false`. |
| Source repo **public** | ✅ (2.2) | Sigstore/Rekor entries are world-readable, and npm links to the source commit. A private repo produces a dead link and npm refuses. |
| Run on **GitHub Actions**, GitHub-hosted runner | ✅ `runs-on: ubuntu-latest` | GitLab CI is also supported. Self-hosted runners are not a supported provenance environment — keep the release job on hosted runners. |
| `permissions: id-token: write` on the job/workflow | ✅ (2.5 diff) | Without it the OIDC token request fails with `Failed to get ID token`. Note that setting any `permissions:` block resets the rest to `none`, so `contents: write` and `pull-requests: write` must stay listed. |
| npm CLI **≥ 9.5.0** | ✅ Node 24 ships npm 11 | Changesets shells out to whatever `npm` is on `PATH`, not to Yarn — so this is Node's bundled npm, not our `packageManager` field. |
| `repository` field present and matching | ✅ added in P0 | npm validates `repository.url` against the running repo. A mismatch (or the `directory` field missing for a monorepo) fails with `Provenance generation failed: package.json repository field must match`. Ours is `git+https://github.com/tenstorrent-digital/vesper.git` + `"directory": "packages/vesper"`. |

**How to turn it on.** Changesets invokes `npm publish` itself, so we can't pass `--provenance` on the command
line. Two supported routes — pick **one**:

1. **Env var in the workflow** (what 2.5 shows):

   ```yaml
   env:
     NPM_CONFIG_PROVENANCE: true
   ```

   Applies to every package published in that run. Easy to grep for, easy to toggle off in an incident.

2. **Per-package manifest** (`packages/vesper/package.json`):

   ```jsonc
   "publishConfig": {
     "access": "public",
     "provenance": true
   }
   ```

   Scoped to the one package we publish, and it also applies to a manual `npm publish` from a laptop — which
   will then **fail**, because a laptop can't produce an OIDC token. That's arguably a feature (it forces
   publishes through CI), but it makes the emergency manual publish in 2.7 step 5 impossible without editing
   the manifest first.

   **Recommendation:** use the **env var** (option 1) so CI is the only thing that changes behaviour, and keep
   `publishConfig` to `access` only.

**Verifying it worked:**

```bash
# 1. package page: https://www.npmjs.com/package/@tenstorrent/vesper — look for the
#    "Built and signed on GitHub Actions" provenance panel

# 2. attestation metadata is attached to the published version
npm view @tenstorrent/vesper --json | jq '.dist.attestations'

# 3. verify signatures + attestations from a clean consumer install
mkdir /tmp/vesper-verify && cd /tmp/vesper-verify
npm init -y && npm i @tenstorrent/vesper
npm audit signatures        # expects: "1 package has a verified attestation"
```

Add `npm audit signatures` to the post-publish checklist (2.8) rather than to CI — it only tells you something
after a publish has landed.

**Gotchas / operational notes:**

- **Order matters.** Enable provenance in the *same* PR that flips `private: false`, not before. Turning it on
  while the package is still private/restricted breaks the release job at the publish step, after versioning
  and tagging have already happened — a messy state to unwind.
- **Attestations are public and permanent.** The Rekor entry records the repo URL, commit SHA, workflow file
  path and run ID. Fine once the repo is public; another reason not to enable it while private.
- **Snapshot/canary publishes** (2.8) run through the same `npm publish`, so they'd also attempt provenance.
  They're public dist-tags on a public package, so this is fine — but if canaries run from PR branches of
  forks, `id-token: write` is not granted to fork PRs and the publish will fail. Restrict canary releases to
  branches on this repo.
- **Provenance ≠ auth.** We still need `NODE_AUTH_TOKEN` (2.1). Provenance signs *what* was built; the token
  authorises *who* may publish.
- **Upgrade path — npm Trusted Publishing.** npm now supports OIDC "trusted publishers": you register this
  repo + workflow file on the package's npm settings page, and CI publishes with **no `NPM_TOKEN` at all**
  (provenance is generated automatically). Requires npm ≥ 11.5.1 and that the package already exists, so it
  can only be configured **after** the first publish. Worth doing as a follow-up: it removes the
  long-lived automation token, which is the single highest-value secret in the repo. Migration sketch:
  1. publish once with `NPM_TOKEN` (2.7);
  2. on npmjs.com → package → Settings → Trusted Publisher, add `tenstorrent-digital/vesper` +
     `.github/workflows/release.yml`;
  3. drop `NODE_AUTH_TOKEN` from the workflow and delete the `NPM_TOKEN` secret;
  4. keep `id-token: write`; optionally drop `NPM_CONFIG_PROVENANCE` (implied by trusted publishing).

### 2.7 First publish

1. Merge the Phase 2 PR to `main` with a changeset (e.g. `minor`: "publish to npm as `@tenstorrent/vesper`").
2. Let the Version PR open, review the changelog, merge it.
3. Watch the release job: expect `🦋  Publishing "@tenstorrent/vesper" at "X.Y.Z"` and a new git tag.
4. Verify: `npm view @tenstorrent/vesper`, then in a scratch dir `npm i @tenstorrent/vesper` and import a
   component + `@tenstorrent/vesper/styles.css`.
5. Verify provenance per 2.6 (`npm audit signatures` + the npmjs.com provenance panel).
6. If the very first publish is rejected for scope permissions, do **one** manual
   `npm publish --access public` from `packages/vesper` with a personal token, then let CI own it thereafter.
   Note this manual publish will have **no provenance** (no OIDC outside CI) — the next CI release fixes that
   for subsequent versions; provenance cannot be added retroactively to a published version.

### 2.8 Post-publish follow-ups

- [ ] Update docs site install instructions to `npm i @tenstorrent/vesper` (drop workspace-only wording).
- [ ] Confirm `apps/docs` still resolves the **workspace** copy, not the registry copy, after publish.
- [ ] Add a `Releases`/`Changelog` link to the docs nav.
- [ ] Consider canary releases for consumer testing:
      `changeset version --snapshot canary && changeset publish --tag canary --no-git-tag`, triggered by a
      label or `workflow_dispatch`.
- [ ] Consider pre-release mode for a `1.0.0` runway: `changeset pre enter next` → publishes `1.0.0-next.N`.
- [ ] Run `npm audit signatures` against a clean install to confirm the attestation verifies (2.6).
- [ ] Optionally add an npm version badge to the README; the provenance badge is rendered by npmjs.com automatically.
- [ ] Migrate from `NPM_TOKEN` to npm **Trusted Publishing** and delete the secret (2.6).

### Phase 2 rollback

If publishing misbehaves, revert to interim mode by setting `"private": true` on the package and
`privatePackages: { version: true, tag: true }` in the Changesets config. The workflow keeps producing
changelogs and tags with no npm side effects.
