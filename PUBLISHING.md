# Publishing

How releases work today, and what has to change before `@tenstorrent/vesper` can be published to npm.

## Current state

`.github/workflows/release.yml` runs [`changesets/action`](https://github.com/changesets/action) on every push to `main`. The action picks one of two modes based on whether `.changeset/*.md` files are present:

| Changesets on `main` | Mode      | What happens                                                                                                                                      |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Present              | `version` | Runs `yarn changeset:version`, pushes `changeset-release/main`, opens/updates the "Version Packages" PR (bumped versions + generated changelogs). |
| None                 | `publish` | Runs `yarn changeset:tag`, which creates git tags. The action pushes those tags and creates matching GitHub Releases from the changelog entry.    |

**Nothing in this workflow talks to the npm registry.** We do not own the `@tenstorrent` scope on npm yet, so:

- the `publish` script is `changeset tag`, not `changeset publish` — purely local git plumbing
- no `NPM_TOKEN` is provided (the action only writes `~/.npmrc` when that variable is set)
- npm provenance is not requested, so the workflow does not ask for the `id-token: write` permission

The action is SHA-pinned to `v1.9.0`. There is no stable `changesets/action@v2` yet — only `v2.0.0-next.*` prereleases, which rename `version`/`publish` to `version-script`/`publish-script` and drop support for passing the token via the `GITHUB_TOKEN` environment variable.

## Enabling npm publishing

### 1. Prerequisites outside the repo

These are blocking and are not code changes.

- **Own the `@tenstorrent` scope on npm.** The org must be created/claimed, the publishing identity must be a member with write access, and the org must permit public packages.
- **Choose an auth path:**
  - **Trusted publishing / OIDC (recommended).** No long-lived secret, and provenance is attached automatically. Configure it on npmjs.com under the package's Settings → Trusted Publisher: GitHub Actions, repo `tenstorrent-digital/vesper`, workflow `release.yml`. Requires npm >= 11.5.1 which CI already satisfies via Node 24. Note that a trusted publisher is configured against an _existing_ package, so the first `0.1.0` publish likely has to happen manually or with a short-lived token.
  - **Access token.** Create a granular access token scoped to `@tenstorrent` with read+write, and store it as the repo secret `NPM_TOKEN`. Use an automation/granular token so that org-enforced 2FA does not require an OTP prompt in CI.
- **Provenance requires a public repo and a public package**, and the `repository.url` in `packages/vesper/package.json` must match the repo the workflow runs in. It currently points at `github.com/tenstorrent-digital/vesper`, which matches `origin`.
- **Optional:** create a GitHub environment (e.g. `npm`) with required reviewers and reference it from the release job, to gate publishes behind a manual approval.

### 2. Code changes

#### `package.json` (root)

Add a publish script. It **must** build first: `packages/vesper/package.json` declares `"files": ["dist"]`, and `dist` is gitignored, so a fresh CI checkout has nothing to pack.

```diff
-    "changeset:tag": "changeset tag"
+    "changeset:tag": "changeset tag",
+    "changeset:publish": "yarn build:vesper && changeset publish"
```

#### `.github/workflows/release.yml`

```diff
 permissions:
   contents: write
   pull-requests: write
+  # required for npm provenance / trusted publishing
+  id-token: write
```

```diff
-          publish: yarn changeset:tag
+          publish: yarn changeset:publish
         env:
           GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
+          # token path only — omit entirely when using trusted publishing, as
+          # the action skips writing ~/.npmrc when NPM_TOKEN is unset
+          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

#### Provenance opt-in (token path only)

Changesets never passes `--provenance` to npm — it only builds `--access`, `--json` and `--otp` flags — so provenance has to be turned on out of band, via either:

- `packages/vesper/package.json` → `"publishConfig": { "access": "public", "provenance": true }`, or
- a `NPM_CONFIG_PROVENANCE: true` environment variable on the release step

With trusted publishing, npm attaches provenance on its own and neither is needed.

#### `.changeset/config.json`

```diff
-  "access": "restricted",
+  "access": "public",
```

Cosmetic today: changesets resolves access as `publishConfig?.access || config.access`, and vesper already sets `publishConfig.access: "public"`, which wins. Worth aligning anyway so a future package that omits `publishConfig` does not silently fail its first publish.

### 3. Verify before flipping it on

```bash
yarn build:vesper
npm pack --dry-run ./packages/vesper      # inspect tarball contents
npm publish --dry-run ./packages/vesper
```

- Confirm every subpath in the `exports` map resolves to a file that exists under `dist`.
- Confirm no _runtime_ dependency points at a private workspace package. This is currently clean: `@repo/*` appear only in `devDependencies`, which consumers never install.

### 4. What does not change

- The version PR flow is identical.
- `changeset publish` also prints `New tag: …` lines, so the action keeps pushing git tags and creating GitHub Releases exactly as it does now.
- `changeset:publish` is a drop-in replacement for `changeset:tag`. The latter can be deleted at that point, or kept as a no-publish fallback.

## Checklist

- [ ] `@tenstorrent` npm scope owned, publishing identity has write access
- [ ] Auth configured (trusted publisher on npmjs.com, or `NPM_TOKEN` repo secret)
- [ ] Repo public, if provenance is wanted
- [ ] `changeset:publish` script added to the root `package.json`
- [ ] `release.yml` switched to `publish: yarn changeset:publish` with `id-token: write`
- [ ] Provenance opted in (skip when using trusted publishing)
- [ ] `.changeset/config.json` access set to `public`
- [ ] `npm publish --dry-run` output reviewed
- [ ] Publish-related notes removed from `release.yml`
