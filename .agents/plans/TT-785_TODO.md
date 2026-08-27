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

### PR 2 — P1: apply the routing matrix (`minor`) ✅ DONE

Goal: flip the defaults. This is where behaviour changes.

- [x] Apply the §3.2 matrix to `checkbox`, `text-input`, `text-area`: `aria-*` -> control,
      `title` -> control (D-2), `ref` -> control (D-3), `data-*` stays on the wrapper (D-1)
- [x] `packages/vesper/src/components/select/select.tsx` — target map: `form` = `BaseSelect.Root`,
      `control` = `BaseSelect.Trigger`; reserved `aria-expanded`, `aria-controls`, `aria-haspopup`,
      `tabIndex`
- [x] `packages/vesper/src/components/combobox/combobox.tsx` — target map: `control` =
      `BaseCombobox.Input`; reserved `aria-expanded`, `aria-controls`, `aria-autocomplete`,
      `aria-activedescendant`. Portal subtree untouched
- [x] `packages/vesper/src/components/range/range.tsx` + `slider/slider.tsx` — target map, plus the
      **generic** multi-control opt-out (§3.3 / E-2). Value ARIA reserved; per-thumb attributes stay
      in `thumbAriaLabels`
- [x] Fix P-3 in `range`/`slider`: `id` now lands on the slider root rather than the wrapper
- [x] Fix P-2 in `select`/`combobox`: `role` and `tabIndex` no longer reach the wrapper
- [x] Fix P-4 in `select`/`combobox`/`range`: non-bubbling handlers now reach the control
- [x] Compose `Range`'s internal `onPointerDown` with any routed consumer handler — **not needed**:
      `onPointerDown` is a pointer handler, so it routes to the wrapper, and never collides with the
      thumb's internal handler. `composeEventHandlers` therefore has no in-scope caller yet; it
      stays for the deferred components (§7.7)
- [x] Remove the ref aliases (D-8) — `inputRef` from `text-input`, `checkbox`, `combobox`;
      `textareaRef` from `text-area`; `triggerRef` from `select`. `switch.tsx` and `range.tsx`'s
      internal `RangeThumb` prop left alone
- [x] Update `packages/vesper/src/components/masked-input/masked-input.tsx` ref plumbing
- [x] Update docs: prop tables and "Accessing the underlying element" sections in
      `docs/components/{checkbox,select,combobox,text-area,text-input}.mdx`, plus the now-inaccurate
      prop-forwarding sentences in those five and in `range.mdx` / `slider.mdx`
- [x] Update `__snapshots__/` — **no churn**: the routing changes only affect props the snapshot
      cases don't pass
- [x] Add a `minor` changeset with a "props that changed destination" table
      (`.changeset/brave-donkeys-repeat.md`)

**Outcome:** full suite green (2963 passed across 54 files), lint + types + format clean. Contract
suites now cover `select`, `combobox`, and `range` as well, at 63 assertions each.

**Two additions to the contract suite** driven by real behaviour found during the work:

- `distributed` — for attributes a component applies across several inner controls rather than one
  element. `Range` puts `aria-describedby` on each thumb, so the message is announced when a thumb
  takes focus; asserting it on a single "control" would have been wrong.
- `ARIA_RESERVED_TEST_VALUES` — a reserved-attribute assertion needs a test value that differs from
  whatever the primitive sets itself, otherwise it can't tell a rejected consumer value from Base
  UI's own. `aria-autocomplete` collided at `"list"`.

### PR 3 — P2: semantics and surface (`minor`) ✅ DONE

- [x] Validation wiring in `getFormControlProps` (§3.10): `variant === "error"` sets
      `aria-invalid="true"` unless explicitly overridden, so the error state is reported
      programmatically rather than conveyed by styling alone. **Together with P1 routing
      `aria-errormessage` to the control, this resolves the original Copilot review comment.**
      Note `aria-invalid` is set for the error variant even without a message, since the field is
      visually invalid either way.
      **`aria-errormessage` is deliberately not derived.** The `message` is associated via
      `aria-describedby` for every variant, which is universally supported; deriving
      `aria-errormessage` to point at the same node would add nothing over that and risk double
      announcement. A consumer-supplied `aria-errormessage` (pointing at a specific error node) is
      forwarded to the control by the router with no special handling.
- [x] Fix P-10: a supplied `aria-labelledby` now suppresses the auto `aria-label` default. An
      explicitly-passed `aria-label` is still kept alongside it
- [x] Fix P-11: denied props (`role`, `aria-hidden`, `children`, `dangerouslySetInnerHTML`) are
      omitted from `FormInputProps`, so passing one is a compile error rather than a silent no-op.
      Verified with `@ts-expect-error` probes
- [x] Add the `controlProps` / `wrapperProps` escape hatch (§3.6, P-8) via
      `packages/vesper/src/utils/mergeFormInputProps.ts`. Precedence: component defaults < routed
      props < explicit bag; `className`, `style`, and handlers merge rather than replace. **This is
      what finally gives `composeEventHandlers` a caller**
- [x] Extend `describeFormInputForwarding` to assert the escape hatch and precedence (6 new
      assertions per component)
- [x] Update the seven component `.mdx` files with the validation semantics and the escape hatch
- [x] Add a `minor` changeset (`.changeset/olive-schools-tickle.md`)

**Outcome:** full suite green (3019 passed across 55 files), lint + types + format clean. Contract
suites now run 69 assertions per component across 6 components.

**Snapshot churn was intentional and minimal:** error-variant cases gained `aria-invalid="true"`.
27 lines across 7 snapshot files; no attribute was removed or moved.

**Scope note on §3.8.** The plan called for replacing `ComponentProps<"div">` with a curated
`FormInputWrapperOwnProps`, so that control-specific ARIA on the wrapper became a compile error.
P1 removed that motivation — control ARIA is now *routed to the control*, not silently dropped on
the wrapper, so there is nothing to make an error. What remained valuable was the denied-prop
omission above, which targets the actual remaining silent no-op. Narrowing the wrapper surface
further (dropping legacy React props like `about`, `datatype`, `inlist`, `prefix`) is still
possible but is now cosmetic, and would remove currently-working props; left undone deliberately.

### PR 4 — P3: polish (`patch`) ✅ DONE

- [x] Dev-only warnings (§3.9) via `packages/vesper/src/utils/warnOnce.ts`, stripped from production
      builds and deduplicated per message (form inputs re-render often enough that an ungated
      warning would fire on every keystroke):
      - denied props (`role`, `aria-hidden`, `children`, `dangerouslySetInnerHTML`), each with the
        reason and a suggested alternative
      - reserved props, naming the component that manages them
      - `aria-errormessage` without the control being invalid
      - `aria-label` and `aria-labelledby` supplied together
      - **no warning for `title`** (D-2)
- [x] Make reserved props type errors as well, derived from the same `as const` arrays that drive
      the runtime `reserved` lists so the two cannot drift. This was not in the original plan: it
      closes the last silent no-op, since reserved props were type-allowed but dropped at runtime
- [x] Add `docs/prop-forwarding.mdx` — the routing table, the two rules that explain most of it,
      refs, validation, escape hatches, refused props, and a note on `getByTestId`. Linked from all
      seven form input pages. Verified the site builds and prerenders `/prop-forwarding`
- [x] Add a `patch` changeset (`.changeset/quiet-pianos-repeat.md`)

**Outcome:** full suite green (3029 passed across 56 files), lint + types + format clean, website
builds.

**A real bug the warning tests caught:** the `aria-errormessage` pairing check originally used a
truthiness test on the resolved `aria-invalid`. `aria-invalid="false"` is a *truthy string* that
semantically means valid, so an explicitly-valid control was being treated as invalid and the
warning was suppressed. Now compared against both `false` and `"false"`.

**Docs scope note.** Items 17–18 were partly pulled forward: P1 and P2 already had to correct the
prop-forwarding prose in seven `.mdx` files, because leaving statements that were accurate before
the flip but wrong after would have been worse than the small scope bleed. P3 added the dedicated
page those sentences now link to.

---

## Out of scope

`switch`, `radio-group`, `choicebox`, `toggle` — they have not adopted `FormInputWrapper` yet
(D-4, D-5). Do not touch them. See plan §7 for the deferred work, including the `toggle`
`onInvalid` bug (§7.2), the Shape 1 structure (§7.5), and the handler-composition notes (§7.7).
