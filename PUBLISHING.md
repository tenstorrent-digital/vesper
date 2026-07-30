# Publishing

The roadmap from where releases are today — automated git tags and GitHub Releases, nothing touching npm — to publishing `@tenstorrent/vesper` to npm via **trusted publishing**.

Trusted publishing (OIDC) is the only path documented here. It needs no long-lived npm secret in the repo, and npm attaches build provenance automatically.

## Current state

`.github/workflows/release.yml` runs [`changesets/action`](https://github.com/changesets/action) on every push to `main`. The action picks one of two modes based on whether `.changeset/*.md` files are present:

| Changesets on `main` | Mode      | What happens                                                                                                                                      |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Present              | `version` | Runs `yarn changeset:version`, pushes `changeset-release/main`, opens/updates the "Version Packages" PR (bumped versions + generated changelogs). |
| None                 | `publish` | Runs `yarn changeset:tag`, which creates git tags. The action pushes those tags and creates matching GitHub Releases from the changelog entry.    |

**Nothing in this workflow talks to the npm registry.** We do not own the `@tenstorrent` scope on npm yet, so:

- the `publish` script is `changeset tag`, not `changeset publish` — purely local git plumbing
- no npm credentials of any kind are present
- the workflow does not request the `id-token: write` permission

The action is SHA-pinned to `v1.9.0`. There is no stable `changesets/action@v2` yet — only `v2.0.0-next.*` prereleases, which rename `version`/`publish` to `version-script`/`publish-script` and drop support for passing the token via the `GITHUB_TOKEN` environment variable.

## Target state

The same workflow, with `publish` swapped to a script that builds and runs `changeset publish`. On a push to `main` with no changesets pending, one run will:

1. publish `@tenstorrent/vesper` to npm, authenticated by a short-lived OIDC token minted per-run,
2. attach a provenance attestation linking the tarball to this repo, workflow and commit,
3. push the git tags and create the GitHub Releases, exactly as it does today.

No `NPM_TOKEN`, no repo secret, nothing to rotate.

## Roadmap

### 1. Own the `@tenstorrent` scope on npm

Blocking, and not a code change. The org must be created/claimed, the publishing identity must be a member with write access, and the org must permit public packages.

### 2. Make the repo public

Also blocking, and a prerequisite for provenance rather than for publishing itself. npm only auto-enables provenance when the OIDC token's `repository_visibility` claim is `public`.

`repository.url` in `packages/vesper/package.json` must match the repo the workflow runs in. It currently points at `github.com/tenstorrent-digital/vesper`, which matches `origin`.

### 3. Bootstrap the first release by hand

A trusted publisher is configured against an **existing** package, so the very first publish cannot use it. Break the cycle manually, once:

1. Land a changeset and merge the resulting "Version Packages" PR. The current workflow already bumps `0.0.0` → `0.1.0`, tags it and creates the GitHub Release.
2. From that commit, publish once from a maintainer's machine:

   ```bash
   yarn build:vesper
   npm publish ./packages/vesper
   ```

   `publishConfig.access` is already `"public"`, so no `--access` flag is needed.

> **This first version will have no provenance.** npm only generates attestations inside a recognised CI provider — a local publish is rejected with `Automatic provenance generation not supported for provider: …`. That is expected and self-correcting: every release from step 5 onward is attested.

### 4. Configure the trusted publisher

On npmjs.com, under the package's **Settings → Trusted Publisher**:

- Publisher: **GitHub Actions**
- Repository: `tenstorrent-digital/vesper`
- Workflow filename: `release.yml` — must match exactly

Requires npm >= 11.5.1 on the runner, which CI already satisfies via Node 24.

**Optional:** create a GitHub environment (e.g. `npm`) with required reviewers and reference it from the release job to gate publishes behind a manual approval. If you name an environment in the trusted publisher config, the job **must** declare the matching `environment:` key or the OIDC exchange will be rejected.

### 5. Switch the workflow over

#### `package.json` (root)

Add a publish script. It **must** build first: `packages/vesper/package.json` declares `"files": ["dist"]`, and `dist` is gitignored, so a fresh CI checkout has nothing to pack.

```diff
-    "changeset:tag": "changeset tag"
+    "changeset:tag": "changeset tag",
+    "changeset:publish": "yarn build:vesper && changeset publish"
```

#### `.github/workflows/release.yml`

`id-token: write` is what lets the runner mint the OIDC token npm exchanges for a short-lived registry credential. Without it the exchange is skipped silently and the publish fails to authenticate — it is required for **auth**, not just for provenance.

```diff
 permissions:
   contents: write
   pull-requests: write
+  # mint the OIDC token that npm exchanges for a short-lived registry
+  # credential (trusted publishing), and sign the provenance attestation
+  id-token: write
```

```diff
-          publish: yarn changeset:tag
+          publish: yarn changeset:publish
```

Leave the `env:` block as `GITHUB_TOKEN` only. **Do not add `NPM_TOKEN`** — `changesets/action` writes `~/.npmrc` only when that variable is set, and a static auth token there preempts the OIDC exchange, silently costing you both trusted publishing and provenance.

Nothing has to be configured for provenance. Changesets never passes `--provenance` to npm (it only builds `--access`, `--tag` and `--otp` flags), but under trusted publishing npm turns it on itself once the repo and the package are both public.

#### `.changeset/config.json`

```diff
-  "access": "restricted",
+  "access": "public",
```

Cosmetic today: changesets resolves access as `publishConfig?.access || config.access`, and vesper already sets `publishConfig.access: "public"`, which wins. Worth aligning anyway so a future package that omits `publishConfig` does not silently fail its first publish.

### 6. Verify before flipping it on

```bash
yarn build:vesper
npm pack --dry-run ./packages/vesper      # inspect tarball contents
npm publish --dry-run ./packages/vesper
```

- Confirm every subpath in the `exports` map resolves to a file that exists under `dist`.
- Confirm no _runtime_ dependency points at a private workspace package. This is currently clean: `@repo/*` appear only in `devDependencies`, which consumers never install.

After the first automated release, confirm the provenance badge appears on the package page, and that `npm audit signatures` passes for the published version.

## What does not change

- The version PR flow is identical.
- `changeset publish` also prints `New tag: …` lines, so the action keeps pushing git tags and creating GitHub Releases exactly as it does now.
- `changeset:publish` is a drop-in replacement for `changeset:tag`. The latter can be deleted at that point, or kept as a no-publish fallback.

## Checklist

- [ ] `@tenstorrent` npm scope owned, publishing identity has write access
- [ ] Repo public
- [ ] `0.1.0` published manually to create the package (no provenance on this one)
- [ ] Trusted publisher configured on npmjs.com against `release.yml`
- [ ] `changeset:publish` script added to the root `package.json`
- [ ] `release.yml` switched to `publish: yarn changeset:publish` with `id-token: write`
- [ ] No `NPM_TOKEN` anywhere in the workflow or repo secrets
- [ ] `.changeset/config.json` access set to `public`
- [ ] `npm publish --dry-run` output reviewed
- [ ] Publish-related notes removed from `release.yml`
- [ ] Provenance badge verified on the first automated release
