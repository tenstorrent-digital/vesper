# TT-785: Better forwarding of attributes for form input components

Plan: `.agents/plans/TT-785_PLAN.md`

## Before you start

- [ ] **Never add a `major` changeset** (D-7). The package is `0.0.0` and unpublished with 37
      pending changesets (26 `minor`, 5 `patch`, 0 `major`); a `major` would bump it to `1.0.0` and
      declare the library stable at its first release. Optionally confirm with a `changeset version`
      dry run on a scratch branch.

**Filename convention:** util files use **camelCase**, matching the existing siblings in
`packages/vesper/src/utils/` (`getDisabledProps.ts`, `getPortalContainer.ts`, `generateId.ts`,
`hooks/useMergedRefs.ts`). Component files and directories remain kebab-case. Note that
`.agents/rules/code-style.md` states a blanket kebab-case rule which the existing util files
already contradict — this discrepancy is known and is intentionally being left as-is. **Do not
"correct" the util filenames to kebab-case.**

**Validation** (from the monorepo root, per `.agents/skills/pre-commit-checks`):

```bash
yarn lint && yarn format && yarn check-types && yarn test:vesper
```

**Stacking:** this is 4 dependent PRs (D-7). The `gh-stack` extension is available.

---

## TODO

### PR 1 — P0: router + tests, behaviour-preserving (`patch`) ✅ DONE

Goal: land the machinery with **today's routing preserved exactly**. No behaviour change, no
snapshot churn, ~700 lines deleted.

- [x] Create `packages/vesper/src/utils/splitFormInputProps.ts`
  - Export `FormInputTarget = "form" | "control" | "wrapper"` and
    `SplitFormInputPropsOptions { reserved?, overrides? }`
  - Declare the control prop list **once** as
    `const CONTROL_PROPS = [...] as const satisfies readonly (keyof ComponentProps<"input">)[]`,
    deriving both the runtime `Set` and the union type from it (this is what stops the P-6 drift)
  - Implement classification per plan §3.2; `*Capture` props strip the suffix, classify, reapply
  - Must satisfy E-1 (`form`/`control` may alias), E-2 (multi-control opt-out), E-3 (per-component
    `reserved`), E-5 (per-prop `overrides`)
- [x] Create `packages/vesper/src/utils/splitFormInputProps.test.ts` — all 53 `aria-*`, the
      `*Capture` rule, `reserved`, `overrides`, `data-*` -> wrapper, deny-list props
- [x] Create `packages/vesper/src/utils/composeEventHandlers.ts` — consumer handler first, internal
      second, **unconditionally** (D-6; no `preventDefault` check, no suppression)
- [x] Create `packages/vesper/src/utils/composeEventHandlers.test.ts` — ordering, and that the
      internal handler still runs after the consumer calls `preventDefault()`
- [x] ~~`useFormControl.ts`~~ → shipped as `packages/vesper/src/utils/getFormControlProps.ts`.
      It is a plain function, not a hook: id *generation* stays with the callers for now, because
      moving the `useId()` calls changes the generated values and would churn every snapshot. Id
      derivation is a P2 item anyway (plan §3.10), at which point this becomes a real hook. Owns
      the `aria-describedby` merge plus the `label`/`message` props for `FormInputWrapper`, and
      takes a `labelAssociation` option (`htmlFor` | `aria-labelledby`) for E-4.
- [x] Create `packages/vesper/src/utils/getFormControlProps.test.ts`
- [x] Create `packages/vesper/src/utils/test-utils/describeFormInputForwarding.tsx` — shared
      contract suite taking `render`, `control`, `wrapper` resolvers and an expected `reserved`
      list (E-6)
- [x] Add `"src/**/test-utils/**"` to `exclude` in `packages/vesper/tsconfig.build.json` —
      **required**, or the helper is compiled into `dist` and published (verified: it no longer
      appears in `dist/utils/`)
- [x] Migrate `packages/vesper/src/components/checkbox/checkbox.tsx` off its local
      `ForwardedPropTypes` union, preserving today's destinations exactly
- [x] Migrate `packages/vesper/src/components/text-input/text-input.tsx` — same
- [x] Migrate `packages/vesper/src/components/text-area/text-area.tsx` — same
- [x] Remove `onSubmit`/`onReset` from those three components' forwarded props (P-5: they fire on
      `<form>` and bubble upward, so a descendant input never received them). No test covered them.
- [x] Wire `describeFormInputForwarding` into `checkbox.forwarding.test.tsx`,
      `text-input.forwarding.test.tsx`, `text-area.forwarding.test.tsx` — **separate files** from
      the existing suites on purpose: adding renders to the existing files shifts React's `useId`
      counter and churns snapshots for reasons unrelated to the refactor
- [x] Confirm `__snapshots__/` are unchanged — verified, zero churn across all three components
- [x] Add a `patch` changeset (`.changeset/violet-moons-shave.md`)

**Outcome:** 457 lines deleted / 88 added across the three components. 180 new contract tests and
55 new unit tests; full suite green (2754 passed across 51 files); lint, types, and format clean.

**Type-surface note for PR 2:** the shared `FormInputProps<E>` type is derived from the same arrays
as the router, so `CheckboxProps` now accepts the input-only props it previously omitted
(`placeholder`, `pattern`, `min`, `max`, `list`, `multiple`). They are inert on
`<input type="checkbox">`. `TextAreaProps` narrows correctly — `pattern` and friends resolve away,
since they are not `textarea` attributes.

### PR 2 — P1: apply the routing matrix (`minor`)

Goal: flip the defaults. This is where behaviour changes.

- [ ] Apply the §3.2 matrix to `checkbox`, `text-input`, `text-area`: `aria-*` -> control,
      `title` -> control (D-2), `ref` -> control (D-3), `data-*` stays on the wrapper (D-1)
- [ ] `packages/vesper/src/components/select/select.tsx` — target map: `form` = `BaseSelect.Root`,
      `control` = `BaseSelect.Trigger`; reserve `role`, `aria-expanded`, `aria-controls`,
      `aria-haspopup`
- [ ] `packages/vesper/src/components/combobox/combobox.tsx` — target map: `form` =
      `BaseCombobox.Root`, `control` = `BaseCombobox.Input`; reserve `role`, `aria-expanded`,
      `aria-controls`, `aria-autocomplete`, `aria-activedescendant`. Do **not** touch the Portal
      subtree (it is a sibling of the wrapper, which sits inside `BaseCombobox.Root`)
- [ ] `packages/vesper/src/components/range/range.tsx` + `slider/slider.tsx` — target map, plus the
      **generic** multi-control opt-out (§3.3 / E-2), not a `Range` special case. Reserve all value
      ARIA; per-thumb attributes stay in `thumbAriaLabels`
- [ ] Fix P-3 in `range`/`slider`: `id` currently lands on the wrapper while the label's `htmlFor`
      points at a generated thumb id
- [ ] Fix P-2 in `select`/`combobox`: `role` and `tabIndex` currently reach the wrapper, producing
      two nested `role="combobox"` elements and a tab stop that focuses nothing
- [ ] Fix P-4 in `select`/`combobox`/`range`: route non-bubbling handlers (`onInvalid`,
      `onMouseEnter`/`onMouseLeave`, `onPointerEnter`/`onPointerLeave`) to the element where they
      can actually fire
- [ ] Compose `Range`'s internal `onPointerDown` (`range.tsx:279`, pointer capture) with any routed
      consumer handler via `composeEventHandlers` — currently last-one-wins
- [ ] Remove the ref aliases (D-8) — delete `inputRef` from `text-input.tsx`, `checkbox.tsx`,
      `combobox.tsx`; `textareaRef` from `text-area.tsx`; `triggerRef` from `select.tsx`.
      **Leave `switch.tsx`'s `inputRef`** (out of scope, D-5) and `range.tsx:267` (internal
      `RangeThumb` helper prop, not public API)
- [ ] Update `packages/vesper/src/components/masked-input/masked-input.tsx` — it destructures
      `inputRef` and merges it with `maskitoRef` (lines 88, 118, 120); switch to `ref`
- [ ] Update docs: `docs/components/{checkbox,select,combobox,text-area,text-input}.mdx` — prop
      tables and the "Accessing the underlying element" sections. **Leave `switch.mdx`.**
      No `apps/website` changes needed — it has zero usages of the aliases
- [ ] Update `__snapshots__/` (`yarn test:vesper:update`) and review the diff attribute by attribute
- [ ] Add a `minor` changeset with a "props that changed destination" table, and note the future
      break from §7.6 (`className`/`data-*` will move for the group components when they migrate)

### PR 3 — P2: semantics and surface (`minor`)

- [ ] Validation wiring in `useFormControl` (§3.10): `variant === "error" && message` sets
      `aria-invalid="true"` + `aria-errormessage={messageId}` on the control unless explicitly
      overridden; `aria-describedby` for non-error variants. This is the fix for the original
      Copilot review comment
- [ ] Fix P-10: consumer `aria-labelledby` should suppress the auto `aria-label` default (which
      currently competes with the `<label htmlFor>` accessible name)
- [ ] Fix P-11: stop extending `ComponentProps<"div">`; introduce a curated
      `FormInputWrapperOwnProps` so control-specific ARIA on the wrapper is a **compile error**.
      Omit `children` everywhere — `TextInputProps` currently accepts it and silently discards it
- [ ] Add the `controlProps` / `wrapperProps` escape hatch (§3.6, P-8). Precedence:
      component defaults < routed props < explicit bag; `className`/`style`/handlers merge
- [ ] Extend `describeFormInputForwarding` to assert the escape hatch and precedence
- [ ] Add a `minor` changeset

### PR 4 — P3: polish (`patch`)

- [ ] Dev-only warnings (§3.9): `aria-errormessage` without `aria-invalid`; both `aria-label` and
      `aria-labelledby`; `role` on a component with a managed role; anything hitting `reserved`.
      **No warning for `title`** (D-2)
- [ ] Document the routing matrix in `docs/` and link it from each in-scope component's `.mdx`
- [ ] Add a `patch` changeset

---

## Out of scope

`switch`, `radio-group`, `choicebox`, `toggle` — they have not adopted `FormInputWrapper` yet
(D-4, D-5). Do not touch them. See plan §7 for the deferred work, including the `toggle`
`onInvalid` bug (§7.2), the Shape 1 structure (§7.5), and the handler-composition notes (§7.7).
