# TT-631: Release pipeline — rename to `@tenstorrent/vesper` + Changesets (no npm publish yet)

Plan: `.agents/plans/TT-631_PLAN.md`

Branch: `simon/tt-631-release-pipeline-changelog-changesets`

Suggested PR split: **PR 1 = P0 (rename only)**, **PR 2 = P1 + P2 (Changesets + workflows)**.
P3 and Phase 2 are follow-up work — do not block PR 2 on them.

## TODO

### P0 — Rename `@repo/vesper` → `@tenstorrent/vesper` (PR 1)

- [x] `packages/vesper/package.json`: set `"name": "@tenstorrent/vesper"`, keep `"version": "0.0.0"`, and change
      `"private": false` → `"private": true` (temporary publish guard; Changesets still versions + tags it via
      `privatePackages` config in P1)
- [x] `packages/vesper/package.json`: add publish-facing metadata — `description`, `license` (**confirmed MIT**
      from `packages/vesper/LICENSE`, not Apache-2.0), `repository`
      (`git+https://github.com/tenstorrent-digital/vesper.git` + `"directory": "packages/vesper"` — required
      later for npm provenance), `homepage`, `bugs`, `publishConfig: { "access": "public" }`,
      `engines: { "node": ">=22" }`
- [x] Run the mechanical rewrite across the remaining 53 files:
      ```bash
      rg -l "@repo/vesper" --hidden -g '!node_modules' -g '!yarn.lock' -g '!dist' -g '!.git' \
        | xargs sed -i '' 's|@repo/vesper|@tenstorrent/vesper|g'
      ```
- [x] Spot-check the non-source hits the codemod touched: root `package.json` (7 turbo `--filter` flags),
      `turbo.jsonc` (`@tenstorrent/vesper#dev`, `#watch`), `apps/docs/turbo.jsonc`
      (`@tenstorrent/vesper#build:storybook`), `apps/docs/package.json` dependency,
      `apps/docs/src/lib/style/css/globals.css` (`@import "@tenstorrent/vesper/tailwind.css"`),
      `packages/vesper/README.md`
- [x] **(unplanned, required)** `packages/eslint-config/base.js`: widen the `simple-import-sort` "internal
      packages from monorepo" group from `["^(@repo)(/.*|$)"]` to `["^(@repo|@tenstorrent)(/.*|$)"]`. Without
      this the rename reclassifies vesper imports as third-party and `--fix` reshuffles imports across ~50
      docs files, burying the rename in noise.
- [x] `npx prettier --write turbo.jsonc` (the longer package name pushed `dev:docs.with` past print width)
- [x] Confirm `apps/docs` still depends on `"@tenstorrent/vesper": "*"` (Yarn 1 has no `workspace:` protocol —
      keep the `*` range) and that `yarn workspaces info` lists it as a workspace dependency
- [x] Verify: `yarn install` → `yarn lint` → `yarn check-types` → `yarn build` → `yarn test:vesper`
      (`yarn.lock` unchanged, as predicted; `node_modules/@tenstorrent/vesper` symlink created)
- [x] Smoke-test the docs site with `yarn dev:docs` (components render, tailwind theme vars still load)
- [x] Confirm zero remaining references: `rg "@repo/vesper" --hidden -g '!node_modules' -g '!dist' -g '!.git'`
- [ ] Check the Vercel (or other host) project for `apps/docs` for any dashboard-level build command /
      ignored-build-step referencing `@repo/vesper` and update it — **needs dashboard access, cannot be done
      from the repo**
- [ ] Open PR 1 with body `Closes [TT-631]` (or reference it if TT-631 stays open for PR 2)
- [ ] (Optional, out of scope — file a separate issue) `turbo/generators/config.ts` references stale
      `packages/n` paths, so `yarn scaffold:component` may be broken
- [x] **(unplanned, follow-on fix)** `apps/docs/eslint.config.mjs`: add `{ ignores: ["public/**"] }`. Without
      it `yarn lint` fails for anyone who has run a build, because eslint walks the gitignored storybook
      bundle in `apps/docs/public/storybook` and reports ~19k warnings from minified JS. Pre-existing, but it
      blocked `yarn lint` as a validation gate for this work. (Docs lint now runs in ~1.4s instead of ~25s.)

### P1 — Install and configure Changesets (PR 2)

- [x] Install at the root: `yarn add -D -W @changesets/cli` (Yarn 1 requires `-W` for root deps)
- [x] Run `npx changeset init` (creates `.changeset/config.json` + `.changeset/README.md`)
- [x] Replace `.changeset/config.json` with the interim config from the plan:
      `changelog: "@changesets/cli/changelog"`, `commit: false`, `access: "restricted"`,
      `baseBranch: "main"`, `updateInternalDependencies: "patch"`,
      `ignore: ["docs", "@repo/eslint-config", "@repo/typescript-config"]`,
      `privatePackages: { "version": true, "tag": true }` ← the key setting that gives us versions +
      changelogs + git tags with **no npm publish**
- [x] Add root `package.json` scripts: `changeset`, `changeset:status`
      (`changeset status --since=origin/main`), `changeset:version`
      (`changeset version && prettier --write "**/CHANGELOG.md" ".changeset/*.md"`), `changeset:release`
      (`changeset publish` — a verified no-op while the package is private; kept as the placeholder that
      Phase 2 expands into the real publish command)
- [x] Verify the `ignore` list behaves: `changeset status --since=<ref>` passes for docs-only and
      plans-only ranges, and fails for a range containing `packages/vesper` changes
- [x] Sanity-check locally: scratch `changeset version` run produced `0.1.0`, generated
      `packages/vesper/CHANGELOG.md`, consumed the changeset file, and left `apps/docs/package.json`
      untouched (the `"*"` range needs no rewrite, as predicted). Scratch state restored.
- [x] Confirm generated changelogs pass prettier (the `changeset:version` prettier step reports the
      generated `CHANGELOG.md` as already-formatted — no `.prettierignore` change needed)
- [x] Add the real first changeset: `.changeset/tenstorrent-scope-rename.md` — `@tenstorrent/vesper`,
      **minor**, describing the rename (0.x policy: minor = breaking, patch = feature/fix; first release
      lands `0.1.0`)
- [x] **Finding (documented in `AGENTS.md`):** `changeset status --since=<ref>` only sees changeset files
      that git **tracks** — it runs `git diff --name-only <divergedAt>`, which excludes untracked files. An
      unstaged new changeset appears missing. Always `git add` the changeset. Non-issue in CI (the file is
      committed on the PR branch), but confusing locally.

### P2 — Workflows and enforcement (PR 2)

- [x] Create `.github/workflows/release.yml`: `on: push: branches: [main]` + `workflow_dispatch`,
      `permissions: { contents: write, pull-requests: write }`, checkout `fetch-depth: 0` + `fetch-tags: true`,
      Node 24 + yarn cache, `yarn install --frozen-lockfile`, `changesets/action@v1` with
      `version: yarn changeset:version` (**no `publish` input**), then an explicit "Tag release" step
- [x] **Design correction (found by testing):** `privatePackages.tag` is now `false`, and the workflow tags
      `@tenstorrent/vesper` itself. With `tag: true`, `changeset publish` tagged **every** private workspace
      — `docs@0.1.0`, `@repo/eslint-config@0.0.0`, `@repo/typescript-config@0.0.0` — because `ignore` is not
      applied to tagging. `changeset:release` is kept but left unwired — it publishes and tags nothing today.
- [x] Create `.github/workflows/changeset-check.yml`: `on: pull_request` (types include
      `labeled`/`unlabeled`), `permissions: { contents: read }`, job `if` skips `changeset-release/main` and
      the `skip-changeset` label, checkout `fetch-depth: 0`, explicit `git fetch origin <base>`, then
      `yarn changeset status --since=origin/${{ github.base_ref }}`. Job is named **`changeset-required`** so
      the required-status-check name is unambiguous (the existing test job reports as `run`).
- [ ] Create the `skip-changeset` label — **the team is doing this themselves**
- [ ] Repo settings → Actions → General: enable **Allow GitHub Actions to create and approve pull requests**
      (verified `can_approve_pull_request_reviews: false` — this is the one hard blocker). Leave workflow
      permissions on **read**; both workflows request what they need explicitly.
- [x] ~~Add `CONTRIBUTING.md`~~ — **dropped by decision**; the team will write one later. The essential
      contributor guidance (when a changeset is required, 0.x bump policy, `yarn changeset --empty` and the
      `skip-changeset` label, the Version PR flow, the "`git add` your changeset" gotcha, and that nothing
      publishes to npm yet) lives in the `AGENTS.md` section instead. Fold it into `CONTRIBUTING.md` when that
      file is created.
- [x] Add a `## Changesets and Releases` section to `AGENTS.md` — currently the single source of truth for the
      release workflow, since `CONTRIBUTING.md` is deferred
- [ ] Open PR 2 (it contains the first changeset, so it exercises the whole pipeline on merge)
- [ ] After merging PR 2: confirm the **"Version Packages"** PR opens automatically
- [ ] Merge the Version PR and confirm: `packages/vesper/package.json` → `0.1.0`,
      `packages/vesper/CHANGELOG.md` written, changeset file deleted, git tag `@tenstorrent/vesper@0.1.0`
      pushed **and no other package tagged**, and no npm publish attempted
- [ ] ~~Branch protection: add `changeset-required` to required status checks~~ — **deferred by decision**: the
      `main` ruleset stays in `evaluate` mode, so the gate is advisory (visible red X, does not block merge).
      When switching to `active`, decide how Version PRs get merged (admin bypass — option (a) — or a GitHub
      App token), since they receive no check runs at all.
- [ ] Verify the gate works end-to-end: a PR touching `packages/vesper` without a changeset **fails**; adding a
      changeset (or the `skip-changeset` label) makes it pass
- [ ] (Optional) Install the [changeset-bot](https://github.com/apps/changeset-bot) GitHub App for PR comments
      — UX sugar only, and more valuable while the CI gate is advisory rather than blocking
- [ ] (Optional) Add a `gh release create` step to `release.yml` so interim tags get GitHub Releases
      (`changesets/action` only auto-creates releases off a `publish` run, which we don't do yet)
- [ ] Known limitation to note in the PR description: PRs created with the default `GITHUB_TOKEN` do not
      trigger other workflows, so CI will not run on the Version PR. Swap to `actions/create-github-app-token`
      later if we want checks there.

### P3 — Nice-to-haves (follow-up, not blocking)

- [ ] Surface `packages/vesper/CHANGELOG.md` on the docs site as an `apps/docs` `/changelog` page
- [ ] Add dependabot/renovate config that applies `skip-changeset` to dependency PRs automatically

---

## Phase 2 — Going public + publishing to npm (BLOCKED)

**Blocked on:** IT creating the `@tenstorrent` npm org, and sign-off to make
`tenstorrent-digital/vesper` public. Do not start until both are done. Full detail in §2 of the plan.

### 2.1 Prerequisites (not code)

- [ ] npm organization `tenstorrent` created; our team added with publish rights
- [ ] Decide the org 2FA policy; create a **granular access token, automation type**, scoped to
      `@tenstorrent/vesper` only
- [ ] Add it as repository secret `NPM_TOKEN` (removable later via Trusted Publishing — see 2.6)
- [ ] Legal/branding sign-off to make the repo public

### 2.2 Pre-publicization repo hygiene

- [ ] Scan git **history** for secrets (`gitleaks detect --log-opts="--all"` or `trufflehog git file://.`)
- [ ] Rewrite the stale root `README.md` (install instructions, docs-site links, badges)
- [ ] Add `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/CODEOWNERS`, PR/issue templates
- [ ] Confirm root `LICENSE` and `packages/vesper/LICENSE` agree with the manifest `license` field
- [ ] Remove/relocate internal-only artifacts (`test-results/`, `debug-storybook.log`, editor settings,
      internal Linear references in committed plans)
- [ ] Re-check branch protection and required checks survive the visibility change

### 2.3 Package changes (`packages/vesper/package.json`)

- [ ] Set `"private": false` (this alone re-enables publishing through the existing workflow)
- [ ] Set `"publishConfig": { "access": "public", "registry": "https://registry.npmjs.org" }` — keep
      `provenance` **out** of `publishConfig` (see 2.6; env var is preferred)
- [ ] Review `files`, `exports`, `sideEffects`, `peerDependencies`, `engines` for consumer correctness
- [ ] Validate the tarball: `yarn build:vesper`, then in `packages/vesper` run `npm pack --dry-run`,
      `npx publint`, `npx @arethetypeswrong/cli --pack .`
- [ ] Decide whether the first public release is `0.x` or `1.0.0`; if `1.0.0`, update the versioning policy in
      `AGENTS.md` (and `CONTRIBUTING.md`, if it exists by then)

### 2.4 Changesets config (`.changeset/config.json`)

- [ ] `yarn add -D -W @changesets/changelog-github` and switch `changelog` to
      `["@changesets/changelog-github", { "repo": "tenstorrent-digital/vesper" }]`
- [ ] `access: "restricted"` → `"public"`
- [ ] `privatePackages` → `{ "version": false, "tag": false }` (vesper is no longer private; the other three
      workspaces stay excluded via `ignore`). Keep `tag: false` — it only applies to private packages and
      would tag `docs` and the config packages.
- [ ] Expand the `changeset:release` script to build first and **delete the hand-rolled "Tag release" step**
      from `release.yml` — `changeset publish` tags correctly once the package really publishes

### 2.5 Release workflow (`.github/workflows/release.yml`)

- [ ] Add `id-token: write` to `permissions` (keep `contents: write` + `pull-requests: write` — a
      `permissions` block resets everything not listed to `none`)
- [ ] Add `registry-url: "https://registry.npmjs.org"` to the `actions/setup-node` step
- [ ] Add `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` and `NPM_CONFIG_PROVENANCE: true` to the
      `changesets/action` env
- [ ] Add the `publish: yarn changeset:release` input to `changesets/action` (the script already exists; it is
      a no-op until the package goes public)
- [ ] Change `changeset:release` to build first:
      `turbo run build --filter=@tenstorrent/vesper && changeset publish`
- [ ] Remove the hand-rolled "Tag release" step (superseded by `changeset publish`)
- [ ] Remove any interim `gh release create` step (`changesets/action` now creates GitHub Releases itself)

### 2.6 npm provenance

- [ ] Enable provenance in the **same PR** that flips `private: false` — never before (a private/restricted
      package fails the publish step *after* versioning and tagging have landed, which is messy to unwind)
- [ ] Confirm all hard requirements hold: public package, public repo, GitHub-hosted runner,
      `id-token: write`, npm ≥ 9.5 (Node 24 ships npm 11), and `repository.url` + `directory` matching the repo
- [ ] Use `NPM_CONFIG_PROVENANCE: true` in the workflow env rather than `publishConfig.provenance`, so the
      emergency manual publish in 2.7 stays possible
- [ ] Restrict any canary/snapshot release workflow to branches on this repo — fork PRs are not granted
      `id-token: write` and their publishes would fail

### 2.7 First publish

- [ ] Merge the Phase 2 PR to `main` with a changeset (e.g. minor: "publish to npm as `@tenstorrent/vesper`")
- [ ] Review the resulting Version PR changelog and merge it
- [ ] Watch the release job for `🦋  Publishing "@tenstorrent/vesper" at "X.Y.Z"` and a new git tag
- [ ] Verify install: `npm view @tenstorrent/vesper`, then in a scratch dir `npm i @tenstorrent/vesper` and
      import a component + `@tenstorrent/vesper/styles.css`
- [ ] Verify provenance: npmjs.com provenance panel, `npm view @tenstorrent/vesper --json | jq
      '.dist.attestations'`, and `npm audit signatures` from a clean install
- [ ] If the first publish is rejected for scope permissions: do **one** manual `npm publish --access public`
      from `packages/vesper` with a personal token, then hand publishing back to CI (note: that manual publish
      has no provenance, and provenance cannot be added retroactively)

### 2.8 Post-publish follow-ups

- [ ] Update docs-site install instructions to `npm i @tenstorrent/vesper`
- [ ] Confirm `apps/docs` still resolves the **workspace** copy, not the registry copy
- [ ] Add a `Releases`/`Changelog` link to the docs nav
- [ ] Consider canary releases: `changeset version --snapshot canary && changeset publish --tag canary
      --no-git-tag`, behind a label or `workflow_dispatch`
- [ ] Consider pre-release mode for a `1.0.0` runway: `changeset pre enter next`
- [ ] Migrate to npm **Trusted Publishing**: publish once with `NPM_TOKEN` → register
      `tenstorrent-digital/vesper` + `.github/workflows/release.yml` as a trusted publisher on npmjs.com →
      drop `NODE_AUTH_TOKEN` and delete the `NPM_TOKEN` secret → keep `id-token: write`
- [ ] Add an npm version badge to the README (the provenance badge is rendered by npmjs.com automatically)
