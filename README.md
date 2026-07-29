# Vesper

This monorepo houses the project code for Tenstorrent's software design system library, Vesper.

## System Design

High-level, this project flows from Figma -> Vesper Monorepo -> Package Registry -> End User as follows:

```mermaid
%%{init: {'theme':'neutral'}}%%
flowchart LR
    subgraph Figma["Figma"]
        direction TB
        FT[tokens]
        FT --> FColors[colors]
        FT --> FIcons[icons]
        FT --> FTypo[typography]
        FT --> FMat[materials]
        FT --> FEtc[etc]

        FC[components]
        FC --> FButtons[buttons]
        FC --> FInputs[inputs]
        FC --> FTooltip[tooltip]
        FC --> FAccordion[accordion]
        FC --> FEtc2[etc]
    end

    subgraph Monorepo["Vesper Monorepo"]
        direction TB

        subgraph Apps["apps"]
            Docs[docs]
            ExampleReact[example-react]
        end

        subgraph Packages["packages"]
            Vesper["vesper<br/><i>bundles tokens, css, components, skills</i>"]
        end

        Vesper --> ExampleReact
        Vesper --> Docs
    end

    subgraph Registry["Package Registry"]
        RegistryPkg["@tenstorrent/vesper<br/><i>private, scoped to tenstorrent org</i>"]
    end

    subgraph Consumer["End User"]
        ConsumerInstall["npm install<br/>@tenstorrent/vesper"]
    end

    Figma -->|consumed by| Monorepo
    Vesper -->|published to| RegistryPkg
    RegistryPkg -->|installed by| ConsumerInstall

    classDef figma fill:#e7f7ed,stroke:#9ccfb0,color:#1c1c1c
    classDef mono fill:#e6f6f8,stroke:#9cc9d0,color:#1c1c1c
    classDef pub fill:#ecedfa,stroke:#b3b6e0,color:#1c1c1c
    classDef user fill:#f3eefa,stroke:#c9bce0,color:#1c1c1c

    class FT,FColors,FIcons,FTypo,FMat,FEtc,FC,FButtons,FInputs,FTooltip,FAccordion,FEtc2 figma
    class Docs,ExampleReact,Vesper mono
    class RegistryPkg pub
    class ConsumerInstall user
```

### Figma

Figma contains all of the tokens/primitives used to compose the components in the Vesper design system. Tokens are exported as JSON (colors, tracking, leading, spacing, radius) or SVG (icons) to be used as inputs in the tokens package in the monorepo. Tokens and components are consumed by the [**Vesper Monorepo**](#vesper-monorepo).

```
tokens/
  colors/
  icons/
  typography/
  materials/
  etc/
components/
  button/
  inputs/
  tooltip/
  accordion/
  etc/
```

### Vesper Monorepo

The monorepo consumes tokens and component designs from Figma, then assembles them into the vesper package. Vesper bundles tokens, styles, skills, and components into a single package to be published to the [**Package Registry**](#package-registry)

The vesper package get used as input internally for things like the documentation website, and externally by consumer apps to build user interfaces.

```
apps/
  docs/
  example-react/
packages/
  vesper/
```

### Package Registry

The vesper package in the monorepo is what ultimately gets published to the package registry. It contains tokens, styles, agent skills, and components in the design system.

Initially vesper will start as a private package which will be scoped to the Tenstorrent GitHub organization. Once the package has stabilized and we have established a practise for authoring changelogs and publishing tags/releases then there is potential to release vesper publicly. [**End Users**](#end-user) install the vesper package from the registry.

#### Regarding organization-scoped packages

We will need to coordinate with the Tenstorrent org owner to set up an npm account for the Tenstorrent organization so we can publish to npm with access restricted to the Tenstorrent org.

Once the package is published privately under the tenstorrent scope, we will also need to manage team access in npm for that org so developers in those teams can install the package.

[npm documentation reference](https://docs.npmjs.com/managing-team-access-to-organization-packages)

### End User

Developers being able to auth into npm using SSO is an essential part of installing an organization-scoped npm package.

1. User gets access to npm org via admin invite to org team
2. User authenticates locally via npm login or auth token in .npmrc (auth tokens can be used in CI environments as well)
3. User installs package

```bash
npm login
npm install @tenstorrent/vesper
```

Once the vesper package has been installed, users can import skills, tokens, core functionality, and framework-specific components freely:

```js
import { TextInput, Accordion } from "@tenstorrent/vesper/react";
import { COLORS } from "@tenstorrent/vesper/tokens";
```

#### Usage in CI Environments

For projects that require installing the package in CI environments, an auth token can be used. The token must have read access for installs, and/or publish access for publishing. For example:

```yaml
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

or

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

## Formatting

We use [`prettier`](.prettierrc.ts) for formatting.

Please ensure that automatic formatting on save is configured in your editor.

To run formatting manually you can run the following command to format all files in the repository:

```sh
yarn format
```

You can also format specific files by passing them as arguments:

```sh
yarn format path/to/file.ts path/to/other-file.tsx
```

The same arguments work with `yarn format:check`, which checks formatting without writing any changes.

### Automatic Formatting Check

We use a git pre-commit hook to check that staged files have been formatted with [our formatting rules](.prettierrc.ts).

If you forgot to format some files in your changes, the hook will block your commit and offer to help you fix them.

### Installation

To install the hook, run the following command:

```sh
git config core.hooksPath .hooks
```

Alternatively, you can copy the hook to `.git/hooks` directly:

```sh
# Copy the hook to .git/hooks
cp .hooks/pre-commit .git/hooks/pre-commit

# Make the hook executable
chmod +x .git/hooks/pre-commit
```

<details>
<summary><h5>Bypass</h5></summary>

To bypass the hook for a single commit, add `--no-verify` to the end of your commit command

```sh
git commit --no-verify
```

</details>
