# TT-631: Release pipeline — rename to `@tenstorrent/vesper` + Changesets (no npm publish yet)

Plan: `.agents/plans/TT-631_PLAN.md`

Branch: `simon/tt-631-release-pipeline-changelog-changesets`

Suggested PR split: **PR 1 = P0 (rename only)**, **PR 2 = P1 + P2 (Changesets + workflows)**.
P3 and Phase 2 are follow-up work — do not block PR 2 on them.

## TODO

### P0 — Rename `@repo/vesper` → `@tenstorrent/vesper` (PR 1)

- [ ] `packages/vesper/package.json`: set `"name": "@tenstorrent/vesper"`, keep `"version": "0.0.0"`, and change
      `"private": false` → `"private": true` (temporary publish guard; Changesets still versions + tags it via
      `privatePackages` config in P1)
- [ ] `packages/vesper/package.json`: add publish-facing metadata — `description`, `license` (confirm against
      `packages/vesper/LICENSE`), `repository` (`git+https://github.com/tenstorrent-digital/vesper.git` +
      `"directory": "packages/vesper"` — required later for npm provenance), `homepage`, `bugs`,
      `publishConfig: { "access": "public" }`, `engines: { "node": ">=22" }`
- [ ] Run the mechanical rewrite across the remaining 53 files:
      ```bash
      rg -l "@repo/vesper" --hidden -g '!node_modules' -g '!yarn.lock' -g '!dist' -g '!.git' \
        | xargs sed -i '' 's|@repo/vesper|@tenstorrent/vesper|g'
      ```
- [ ] Spot-check the non-source hits the codemod touched: root `package.json` (7 turbo `--filter` flags),
      `turbo.jsonc` (`@tenstorrent/vesper#dev`, `#watch`), `apps/docs/turbo.jsonc`
      (`@tenstorrent/vesper#build:storybook`), `apps/docs/package.json` dependency,
      `apps/docs/src/lib/style/css/globals.css` (`@import "@tenstorrent/vesper/tailwind.css"`),
      `packages/vesper/README.md`
- [ ] Confirm `apps/docs` still depends on `"@tenstorrent/vesper": "*"` (Yarn 1 has no `workspace:` protocol —
      keep the `*` range) and that `yarn workspaces info` lists it as a workspace dependency
- [ ] Verify: `yarn install` → `yarn lint` → `yarn check-types` → `yarn build` → `yarn test:vesper`
- [ ] Smoke-test the docs site with `yarn dev:docs` (components render, tailwind theme vars still load)
- [ ] Confirm zero remaining references: `rg "@repo/vesper" --hidden -g '!node_modules' -g '!dist' -g '!.git'`
- [ ] Check the Vercel (or other host) project for `apps/docs` for any dashboard-level build command /
      ignored-build-step referencing `@repo/vesper` and update it
- [ ] Open PR 1 with body `Closes [TT-631]` (or reference it if TT-631 stays open for PR 2)
- [ ] (Optional, out of scope — file a separate issue) `turbo/generators/config.ts` references stale
      `packages/n` paths, so `yarn scaffold:component` may be broken

### P1 — Install and configure Changesets (PR 2)

- [ ] Install at the root: `yarn add -D -W @changesets/cli` (Yarn 1 requires `-W` for root deps)
- [ ] Run `npx changeset init` (creates `.changeset/config.json` + `.changeset/README.md`)
- [ ] Replace `.changeset/config.json` with the interim config from the plan:
      `changelog: "@changesets/cli/changelog"`, `commit: false`, `access: "restricted"`,
      `baseBranch: "main"`, `updateInternalDependencies: "patch"`,
      `ignore: ["docs", "@repo/eslint-config", "@repo/typescript-config"]`,
      `privatePackages: { "version": true, "tag": true }` ← the key setting that gives us versions +
      changelogs + git tags with **no npm publish**
- [ ] Add root `package.json` scripts: `changeset`, `changeset:status`
      (`changeset status --since=origin/main`), `changeset:version`
      (`changeset version && prettier --write "**/CHANGELOG.md" ".changeset/*.md"`), `changeset:release`
      (`changeset publish`)
- [ ] Sanity-check locally: `yarn changeset status` runs clean, and a scratch `yarn changeset` +
      `yarn changeset:version` produces `packages/vesper/CHANGELOG.md` and bumps to `0.1.0` (revert the scratch
      run before committing)
- [ ] Confirm generated changelogs pass `yarn format` / prettier (adjust `.prettierignore` if the
      `changeset:version` prettier step proves insufficient)
- [ ] Add the real first changeset: `yarn changeset` → `@tenstorrent/vesper`, **minor**, describing the rename
      (0.x policy: minor = breaking, patch = feature/fix; first release lands `0.1.0`)

### P2 — Workflows and enforcement (PR 2)

- [ ] Create `.github/workflows/release.yml` per the plan: `on: push: branches: [main]` + `workflow_dispatch`,
      `permissions: { contents: write, pull-requests: write }`, checkout `fetch-depth: 0`, Node 24 + yarn cache,
      `yarn install --frozen-lockfile`, then `changesets/action@v1` with `version: yarn changeset:version`,
      `publish: yarn changeset:release`, `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
- [ ] Create `.github/workflows/changeset-check.yml` per the plan: `on: pull_request` (types include
      `labeled`/`unlabeled`), job `if` skips `changeset-release/main` and the `skip-changeset` label,
      checkout `fetch-depth: 0`, explicit `git fetch origin ${{ github.base_ref }}`, then
      `yarn changeset status --since=origin/${{ github.base_ref }}`
- [ ] Create the `skip-changeset` label in the repo (`gh label create skip-changeset --description "PR
      intentionally ships no user-facing change"`)
- [ ] Repo settings → Actions → General: enable **Allow GitHub Actions to create and approve pull requests**
      and set workflow permissions to **Read and write** (both required before the first release run)
- [ ] Add `CONTRIBUTING.md` (or a `## Releases` section): when a changeset is required, `yarn changeset`,
      patch/minor under 0.x, `yarn changeset --empty` and the `skip-changeset` label as escape hatches, what
      the "Version Packages" PR is, and an explicit note that **nothing publishes to npm yet**
- [ ] Add a short "Changesets" section to `AGENTS.md` so agents add a changeset when they touch
      `packages/vesper`
- [ ] Open PR 2 (it contains the first changeset, so it exercises the whole pipeline on merge)
- [ ] After merging PR 2: confirm the **"Version Packages"** PR opens automatically
- [ ] Merge the Version PR and confirm: `packages/vesper/package.json` → `0.1.0`,
      `packages/vesper/CHANGELOG.md` written, changeset file deleted, git tag `@tenstorrent/vesper@0.1.0`
      pushed, and the release job log shows **no npm publish** (private package skipped)
- [ ] Branch protection on `main`: add `Changeset Check / changeset` to required status checks (alongside the
      existing Vesper test job) and require branches to be up to date
- [ ] Verify the gate works end-to-end: a PR touching `packages/vesper` without a changeset **fails**; adding a
      changeset (or the `skip-changeset` label) makes it pass
- [ ] (Optional) Install the [changeset-bot](https://github.com/apps/changeset-bot) GitHub App for PR comments
      — UX sugar only, the CI job is the actual gate
- [ ] (Optional) Add a `gh release create` step to `release.yml` so interim tags get GitHub Releases
      (`changesets/action` only auto-creates releases for packages published to npm)
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
      `CONTRIBUTING.md`

### 2.4 Changesets config (`.changeset/config.json`)

- [ ] `yarn add -D -W @changesets/changelog-github` and switch `changelog` to
      `["@changesets/changelog-github", { "repo": "tenstorrent-digital/vesper" }]`
- [ ] `access: "restricted"` → `"public"`
- [ ] `privatePackages` → `{ "version": false, "tag": false }` (vesper is no longer private; the other three
      workspaces stay excluded via `ignore`)

### 2.5 Release workflow (`.github/workflows/release.yml`)

- [ ] Add `id-token: write` to `permissions` (keep `contents: write` + `pull-requests: write` — a
      `permissions` block resets everything not listed to `none`)
- [ ] Add `registry-url: "https://registry.npmjs.org"` to the `actions/setup-node` step
- [ ] Add `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` and `NPM_CONFIG_PROVENANCE: true` to the
      `changesets/action` env
- [ ] Change `changeset:release` to build first:
      `turbo run build --filter=@tenstorrent/vesper && changeset publish`
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
