# TT-785: Better forwarding of attributes for form input components

Branch: `simon/tt-785-better-forwarding-of-attributes-for-form-input-wrapper`

## Context

A Copilot review on a recent PR flagged the core problem:

> Control-specific ARIA attributes outside `ForwardedPropTypes` are still accepted through
> `ComponentProps<"div">` and silently spread onto the non-interactive wrapper. For example,
> `aria-invalid` reaches the input, but a paired `aria-errormessage` lands on the wrapper, so
> assistive technology cannot associate that error with the checkbox. Route applicable input ARIA
> attributes to the native input, or expose separate wrapper/input prop bags so the destination is
> unambiguous.

This plan adopts a **shared, rule-based attribute router plus contract tests** (with explicit prop
bags as the escape hatch), replacing the hand-maintained `ForwardedPropTypes` allowlists.

## Scope

**In scope — components that already implement the `FormInputWrapper` pattern:**

`checkbox`, `text-input`, `text-area`, `select`, `combobox`, `range`, `slider`, and `masked-input`
(by delegation to `text-input`).

**Out of scope — components that have not adopted the pattern yet:**

`switch` (spreads onto a bare `label`), `radio-group` and `choicebox` (the `fieldset` is the root),
`toggle` (the `div[role=radiogroup]` is the root). These will adopt `FormInputWrapper` *and* the
router at a later date — see §7.

**Design constraint:** the router, the hooks, and the contract suite must be built so those four can
be absorbed later **without redesign**. They will adopt `FormInputWrapper` *before* they adopt the
router, so the extensibility requirements in §3.11 are derived from their **post-migration** shapes
(§7.1) — not from how they are built today. §7 records the analysis already done for them.

---

## Decisions

Resolved during planning. Recorded here so they don't get relitigated mid-implementation.

| # | Decision | Rationale |
| --- | --- | --- |
| D-1 | **All `data-*` -> wrapper** (status quo), reachable on the control via `controlProps` | Consumer attributes stay out of the `data-*` namespace Base UI already uses for control state (`data-popup-open`, `data-disabled`, `data-highlighted`), which our CSS selects against. It's also the only option that can't break a consumer e2e selector silently. Costs: `getByTestId` returns the wrapper, so control assertions need `getByRole` or `controlProps`. |
| D-2 | **`title` -> control**, no dev warning | When an `<input>` has `pattern`, browsers append `title` to the constraint-validation bubble ("Please match the requested format: …"). `docs/components/text-input.mdx:268` actively promotes `pattern`, so today that hint silently does nothing. `title` stays a11y-inert whenever a `message` is present, because `aria-describedby` outranks it. Field-wide tooltips should use the `Tooltip` component, which is keyboard- and touch-accessible. |
| D-3 | **`ref` -> control**; wrapper ref via `wrapperProps={{ ref }}`; the `inputRef`/`textareaRef`/`triggerRef` aliases are removed outright (D-8) | Makes `<TextInput {...register("email")} />` work end-to-end — RHF passes `{ name, onChange, onBlur, ref }` and today three of the four land correctly while `ref` hits a `div`. Every documented ref use case in our own docs is a control operation (`focus()`, selection, `setCustomValidity()`). It is also forward-compatible with §7: `ref` will keep pointing at the `fieldset` before and after a wrapper is introduced there. The break is loud (`Ref<HTMLDivElement>` -> `Ref<HTMLInputElement>`). |
| D-4 | **`radio-group`, `choicebox`, and `toggle` are out of scope entirely** — neither wrapper adoption nor attribute forwarding | Deferred by request. When they do adopt, it should be in "Shape 1" (wrapper outside the group element); that analysis is preserved in §7. |
| D-5 | **`switch` is out of scope too** | It is the fourth component that has not adopted `FormInputWrapper` (it spreads onto a bare `<label>`). Grouping it with the other three keeps one clean scope boundary — *"this change covers components that already implement the wrapper pattern"*. Its `ForwardedPropTypes` union stays in place until then. Note that once it adopts the wrapper it becomes shape-identical to `checkbox`, so it will need nothing from the router beyond what P0 already delivers. |
| D-6 | **Internal handlers always run; no suppression mechanism.** Consumer handler runs first, internal handler second, unconditionally | Rejected "`preventDefault()` suppresses the internal handler" (the Radix convention) because `preventDefault()` has independent legitimate meaning — a consumer stopping Space-scroll on `onKeyDown`, or text selection on `onPointerDown`, would silently disable internal behaviour they never intended to touch. Base UI agrees: it routes suppression through a dedicated `event.preventBaseUIHandler()` rather than overloading `preventDefault()`. Adopting Base UI's `mergeProps` wholesale was also rejected — its `BaseUIEvent` type is only reachable via `@base-ui/react/internals/types`, so the escape hatch would be either untyped or would leak an `internals` path into our published `.d.ts`; it also costs 665 B gzipped in `checkbox`/`text-input`/`text-area`, which import no Base UI today. Accepted limitation: there is no supported way to suppress internal behaviour. This is currently theoretical — `Range`'s `onPointerDown` is the only in-scope internal handler. |
| D-7 | **Ship as a stack of PRs along the P0 / P1 / P2 boundaries, using `minor` changesets — never `major`** | The package is at **`0.0.0`, unpublished** (`npm view` 404, `"access": "restricted"`), with **37 pending changesets** (26 `minor`, 5 `patch`, 0 `major`) and exactly one consumer: `apps/website`, which is `private: true` and depends on `*`. There are no external consumers to protect, so staging behind `controlProps` for a migration window would be protecting nobody. **A `major` changeset would bump `0.0.0` -> `1.0.0`**, accidentally declaring the library stable at its first ever release — so this work must be `minor`, consistent with the other 26. Stacking is for reviewability, not semver: P0 is a pure refactor that can land and bake on its own, which makes P1's routing flip far easier to review once ~700 lines of plumbing deletion is already gone. |
| D-8 | **Remove `inputRef` / `textareaRef` / `triggerRef` entirely** in favour of `ref` | Pre-publication with zero external consumers is the cheapest this will ever be. Keeping them as *deprecated* aliases would mean the first ever published release ships with an already-deprecated API and a migration obligation nobody incurred. Blast radius is small and fully in-repo: 5 in-scope prop definitions (`text-input`, `text-area`, `checkbox`, `combobox`, `select`), `masked-input`'s ref plumbing, and 5 `.mdx` files. **`apps/website` has zero usages.** `switch`'s `inputRef` stays until it migrates (D-5); `range`'s is an internal `RangeThumb` helper prop, not public API. |

Still open: see §6.

---

## 1. Current State

### In-scope components

| Component | Wrapper element | Control element(s) | Rest props spread onto |
| --- | --- | --- | --- |
| `checkbox` | `FormInputWrapper` (`div`) | `input[type=checkbox]` | wrapper |
| `text-input` | `FormInputWrapper` (`div`) | `input` | wrapper |
| `text-area` | `FormInputWrapper` (`div`) | `textarea` | wrapper |
| `select` | `FormInputWrapper` (`div`) | `BaseSelect.Root` + `BaseSelect.Trigger` (`button`) | wrapper |
| `combobox` | `FormInputWrapper` (`div`) | `BaseCombobox.Root` + `.Input` + `.Clear` + `.Trigger` | wrapper |
| `range` / `slider` | `FormInputWrapper` (`div`) | N x `BaseSlider.Thumb` | wrapper |
| `masked-input` | delegates to `text-input` | delegates | delegates |

### Current pattern

`checkbox`, `text-input`, and `text-area` each declare a local `ForwardedPropTypes` union, then
write every prop three times (union member -> destructure -> JSX attribute):

```ts
type ForwardedPropTypes = "id" | "form" | "value" | /* … 30-45 more … */;

export interface CheckboxProps
  extends
    Omit<ComponentProps<"div">, "children" | "onChange" | ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {}
```

`select`, `combobox`, and `range` don't use an allowlist at all — they destructure four ARIA props
by hand and let everything else fall through to the wrapper.

### Prop surface (measured)

- `ComponentProps<"div">`: **280 keys** — 53 `aria-*`, 168 event handlers (85 bubble-phase +
  83 `*Capture`), 59 global attributes.
- `ComponentProps<"input">` adds **30 keys that do not exist on `div`** (`checked`, `step`,
  `pattern`, `accept`, `formAction`, `readOnly`, …). These are unambiguous — the type system
  already proves they can only mean the control.
- Only **4 of 53** ARIA attributes are routed today (`aria-label`, `aria-labelledby`,
  `aria-describedby`, `aria-invalid`).

---

## 2. Problems Identified

### P-1. ~49 of 53 ARIA attributes silently land on a presentational `div`

Verified output for
`<Checkbox text="Accept" aria-invalid aria-errormessage="err" aria-required onClick={…} data-testid="cb" />`:

```html
<div class="vesper-form-input-wrapper" aria-errormessage="err" aria-required="true" data-testid="cb">
  <label class="vesper-checkbox vesper-checkbox-md">
    <input class="vesper-checkbox-input" aria-label="Accept" aria-invalid="true" type="checkbox">
```

Worse than "ignored": a `div` with `aria-required` but no `role` is invalid ARIA, and
`aria-errormessage` on a non-invalid element is discarded by assistive technology.

### P-2. `Select` / `Combobox` duplicate `role` and create a phantom tab stop

They only omit `children`/`defaultValue` from `ComponentProps<"div">`, so `role` and `tabIndex`
are never intercepted. Verified output for
`<Select options={…} label="Pick" role="combobox" tabIndex={0} aria-errormessage="err" />`:

```html
<div class="vesper-form-input-wrapper" role="combobox" tabindex="0" aria-errormessage="err">
  <label for="_r_3_">Pick</label>
  <button role="combobox" aria-expanded="false" aria-haspopup="listbox" …>
```

Two nested `role="combobox"` elements plus a keyboard stop that focuses nothing.

### P-3. The same prop has a different destination depending on the component

- `id` -> control in `checkbox`/`text-input`/`text-area`/`select`/`combobox`, but -> **wrapper** in
  `range`/`slider` (the label's `htmlFor` points at a generated thumb id instead).
- `onFocus`/`onBlur`/`onKeyDown` -> control in `checkbox`/`text-input`/`text-area`, but ->
  **wrapper** in `select`/`combobox`/`range`.
- `onChange` -> control in `text-input`, but -> **wrapper `div`** in `select`, where it accidentally
  catches the bubbled change from Base UI's hidden input and types `e.currentTarget` as
  `HTMLDivElement`.

### P-4. Non-bubbling handlers routed to the wrapper can never fire

`onInvalid` does not bubble, so a consumer handler sitting on the wrapper never runs — affects
`select`, `combobox`, and `range`. Same for `onMouseEnter`/`onMouseLeave`,
`onPointerEnter`/`onPointerLeave`, `onScroll` (non-bubbling in React 17+), `onLoad`/`onError`.

(`toggle` has the same bug via its hidden `<select>`, but is out of scope — see §7.)

### P-5. Dead props in the existing allowlists

`onSubmit` and `onReset` are forwarded to the `<input>` in `checkbox`, `text-input`, and
`text-area`. Those events fire on the `<form>` and bubble *upward*; a descendant input never
receives them. `<TextInput onSubmit={() => {}} />` type-checks and does nothing.

### P-6. The allowlists have already drifted

`ForwardedPropTypes` entry counts: `checkbox` 35, `text-area` 44, `text-input` 49 (and `switch` 36,
out of scope).

- `onPaste` forwarded by `text-input`/`text-area` but not `checkbox`
- `readOnly` forwarded by `switch` but not `checkbox`
- `text-area` never forwards `rows`, `cols`, or `wrap`

Nothing detects any of this. A prop present in the union but forgotten in the JSX is silently
dropped and still type-checks.

### P-7. ~700 lines of mechanical plumbing

~40 props x 3 restatements x 6 components. Pure maintenance cost with no test coverage.

### P-8. No escape hatch to reach the control

Consumers cannot set `step`, `autoCapitalize`, `data-1p-ignore`, `aria-errormessage`,
`aria-controls`, or a control-scoped `data-testid`. The only workaround is `inputRef` + an effect.

### P-9. Validation semantics are opt-in and duplicated

`variant="error"` + `message` renders a red message but never sets `aria-invalid` or
`aria-errormessage` — the error state is visual-only. The describedby merge is copy-pasted verbatim
in six files:

```ts
const describedBy =
  [ariaDescribedby, message ? messageId : undefined].filter(Boolean).join(" ") || undefined;
```

### P-10. `aria-label` defaults to the visible label

A control already labelled via `<label htmlFor>` gets a competing accessible name, and passing
`aria-labelledby` leaves a stale `aria-label` behind.

### P-11. Type-level footguns

- `TextInputProps` does **not** omit `children`: `<TextInput>hello</TextInput>` type-checks, lands
  in `...rest`, and is silently discarded (JSX children win over spread children).
- `data-*` is not in React's prop types at all — TypeScript exempts hyphenated JSX attributes, so
  `data-*` contributes nothing to the type and lands wherever `...rest` goes.
- `Omit<ComponentProps<"div">, ForwardedPropTypes>` means adding a prop to the allowlist silently
  *removes* it from the wrapper API — a breaking change with no signal.
- Real collisions between `div` and `input`: `defaultValue`, `onChange`. Component props also
  collide: `size` (`TextInputSize`), `height` (`TextArea`).

---

## 3. Proposed Changes

### 3.1 Shared attribute router

New util, `packages/vesper/src/utils/splitFormInputProps.ts`:

```ts
/**
 * The element a given prop should be applied to.
 *
 * - `form`    — the element carrying the submitted value (native input, hidden input, hidden select)
 * - `control` — the element owning ARIA, focus, and keyboard interaction
 * - `wrapper` — the presentational layout element
 */
export type FormInputTarget = "form" | "control" | "wrapper";

export interface SplitFormInputPropsOptions {
  /** Attributes owned by the underlying primitive; dropped with a dev warning if supplied */
  reserved?: readonly string[];
  /** Per-prop overrides for components that pin a prop to a specific target */
  overrides?: Partial<Record<string, FormInputTarget>>;
}

/**
 * Partitions a form input's props into the element each one belongs on.
 */
export function splitFormInputProps<P extends object>(
  props: P,
  options?: SplitFormInputPropsOptions,
): { formProps: object; controlProps: object; wrapperProps: object };
```

`form` and `control` are the same element for `checkbox`, `text-input`, and `text-area`, and diverge
for `select`, `combobox`, and `range` (§3.4).

**Keep the runtime set and the compile-time union provably in sync** with one `as const satisfies`
declaration — this is what prevents the drift in P-6 from coming back:

```ts
const CONTROL_PROPS = ["onFocus", "onBlur", "onKeyDown", /* … */] as const satisfies
  readonly (keyof ComponentProps<"input">)[];

type ControlProp = (typeof CONTROL_PROPS)[number];   // the type
const CONTROL_SET = new Set<string>(CONTROL_PROPS);  // the runtime router
```

A pure template-literal type can filter `` `aria-${string}` `` but cannot express "these 40 of 168
handlers", so an explicit union is unavoidable — the point is that there is exactly **one**, shared.

### 3.2 Default routing matrix

| Bucket | Target | Notes |
| --- | --- | --- |
| 30 input-only props (`checked`, `step`, `pattern`, `accept`, …) | control | free from the type system |
| `name`, `form`, `required`, `disabled`, `value`, `defaultValue` | form | same element as control except in `select`/`combobox` |
| `aria-*` (43 of 53) | control | |
| `aria-describedby`, `aria-label`, `aria-labelledby`, `aria-invalid` | control (**merge**) | never replace component-derived values |
| `aria-live`, `-atomic`, `-relevant`, `-busy` | wrapper | describe the region, incl. the message |
| `aria-hidden` | deny + warn | hiding a subtree containing a focusable element is an ARIA violation; point at `hidden`/`inert` |
| `aria-expanded`, `-controls`, `-haspopup`, `-activedescendant`, `-autocomplete` | reserved | Base UI owns these on `select`/`combobox` |
| `aria-valuemin/max/now/text`, `aria-orientation` | reserved on `range`/`slider` | N thumbs, no single destination; use `thumbAriaLabels` |
| `aria-posinset`, `-setsize`, `-level`, `aria-col*`, `aria-row*` | wrapper | describe the field's position in an outer structure |
| `aria-controls`, `-owns`, `-details`, `-flowto` | control | relationships originate at the interactive element |
| focus, keyboard, input, clipboard, composition, `onInvalid` | control | **compose** with internal handlers (§3.5) |
| mouse, pointer, touch, drag, scroll, animation/transition | wrapper | non-bubbling ones are load-bearing |
| `onSubmit`, `onReset` | **delete** | can never fire on either element (P-5) |
| `*Capture` (83 props) | follows its base | strip suffix -> classify -> reapply |
| `id`, `tabIndex`, `autoFocus`, `spellCheck`, `autoCapitalize`, `autoCorrect`, `enterKeyHint`, `inputMode` | control | |
| **`title`** | **control** | D-2 — enables `pattern` validation hints |
| **`ref`** | **control** | D-3 — wrapper ref via `wrapperProps={{ ref }}` |
| **`data-*`** | **wrapper** | D-1 |
| `className`, `style`, `hidden`, `inert`, `dir`, `lang`, `translate`, `part`, `exportparts`, legacy React props | wrapper | |
| `role`, `children`, `dangerouslySetInnerHTML` | deny + warn | |

Rationale for the two most contested rows:

- **`id` -> control.** Matches `label htmlFor` and `document.getElementById` in form-validation
  code, and enables deterministic derived ids (`${id}-message`, `${id}-label`) instead of `useId()`,
  which is better for SSR. The wrapper becomes un-`id`-able without the escape hatch (§3.6).
- **Mouse/pointer -> wrapper.** `onClick` on `Checkbox` today covers the whole field. Routing it to
  the input is roughly equivalent for `Checkbox` (label activation synthesizes a click on the
  control) but **not** for `TextInput`, where clicks on wrapper padding and the icon buttons would
  stop firing. `onMouseEnter`/`onMouseLeave` don't bubble and are usually meant for the whole field.

### 3.3 Multi-control components

`range` and `slider` render N thumbs, so single-valued ARIA has no destination. Rather than
special-casing `Range`, the router should support a generic **multi-control opt-out**: a component
declares that it has no single control, value ARIA goes on the reserved list, and per-item
attributes stay in existing array props (`thumbAriaLabels`).

Building this generically now is what lets `radio-group`, `choicebox`, and `toggle` — which have
exactly the same N-controls problem — adopt the router later without changing it (§3.11, E-2).

### 3.4 Per-component target maps

| Component | `form` target | `control` target | `wrapper` target | Reserved |
| --- | --- | --- | --- | --- |
| `checkbox`, `text-input`, `text-area` | the native control | same element | `FormInputWrapper` div | — |
| `select` | `BaseSelect.Root` (renders the hidden input) | `BaseSelect.Trigger` (`button`) | `FormInputWrapper` div | `role`, `aria-expanded`, `aria-controls`, `aria-haspopup` |
| `combobox` | `BaseCombobox.Root` | `BaseCombobox.Input` | `FormInputWrapper` div | `role`, `aria-expanded`, `aria-controls`, `aria-autocomplete`, `aria-activedescendant` |
| `range` / `slider` | `BaseSlider.Root` | `BaseSlider.Root` (multi-control opt-out, §3.3) | `FormInputWrapper` div | all value ARIA |

Notes:

- `combobox`'s wrapper is nested *inside* `BaseCombobox.Root` and the Portal is a sibling — the
  router must not touch the portal subtree.
- `masked-input` re-spreads `...props` into `text-input`; the split must run exactly **once**, at
  the leaf.

### 3.5 Handler composition

Where the router sends a consumer handler to an element that already has one of ours, the two are
composed rather than overwritten. Per D-6: **consumer first, internal second, unconditionally.**

Add `packages/vesper/src/utils/composeEventHandlers.ts`:

```ts
/**
 * Composes a consumer handler with an internal one. The consumer handler runs first; the internal
 * handler always runs afterwards and cannot be suppressed.
 */
export function composeEventHandlers<E extends SyntheticEvent>(
  consumer: ((e: E) => void) | undefined,
  internal: (e: E) => void,
): (e: E) => void;
```

Consumer-first ordering matches both Base UI and Radix, and means a suppression mechanism could be
added later without a breaking reorder.

**In-scope collision surface is one site:** `Range`'s `onPointerDown` (`range.tsx:279`, pointer
capture). `checkbox`, `text-input`, and `text-area` attach no internal handlers — they purely
forward — and `select`/`combobox` delegate to Base UI. Composition becomes load-bearing when the
deferred components land (§7.7).

Two caveats to document:

- **This governs handlers *we* compose.** Handlers that reach a Base UI element are additionally
  merged by Base UI's own `mergeProps`, which does support `event.preventBaseUIHandler()`. Vesper
  neither documents nor depends on that; it is the primitive layer's behaviour, not our API.
- **`ref` is never part of handler composition.** `mergeProps` explicitly does not merge refs
  either. Since D-3 routes `ref` to the control and `select`/`combobox`/`range` set their own
  internal refs, refs continue to go through the existing `useMergedRefs`.

### 3.6 Escape hatch: explicit prop bags

For anything the rules can't guess (`data-1p-ignore`, vendor attributes, a control-scoped
`data-testid`, a wrapper `id` or `ref`):

```ts
interface FormInputSlotProps<C extends ElementType> {
  /** Props applied directly to the underlying control, merged over routed props */
  controlProps?: ComponentProps<C>;
  /** Props applied directly to the layout wrapper, merged over routed props */
  wrapperProps?: ComponentProps<"div">;
}
```

Precedence: component-derived defaults < routed top-level props < explicit bag. `className`,
`style`, and handlers merge rather than replace.

### 3.7 Contract tests

New shared suite, `packages/vesper/src/utils/test-utils/describeFormInputForwarding.tsx`:

```ts
describeFormInputForwarding(Checkbox, {
  render: (p) => <Checkbox text="x" {…p} />,
  control: () => screen.getByRole("checkbox"),
  wrapper: (container) => container.firstElementChild,
});
```

Assertions:

1. Every one of the 53 `aria-*` attributes lands on its documented target.
2. **No** `aria-*` outside the wrapper set appears on the wrapper (the Copilot regression test).
3. Every key in the public prop type reaches some element (catches P-6-style silent drops).
4. Reserved attributes are dropped and warn in dev.
5. Non-bubbling handlers (`onInvalid`, `onMouseEnter`, `onPointerEnter`) actually fire.
6. Consumer handlers compose with internal ones rather than replacing them.
7. `ref` resolves to the control; `wrapperProps.ref` resolves to the wrapper.

### 3.8 Narrow the public type surface

Stop extending `ComponentProps<"div">`. Introduce a curated `FormInputWrapperOwnProps`
(`className`, `style`, `hidden`, `dir`, `lang`, container ARIA, `data-*`) so that passing
control-specific ARIA to the wrapper becomes a **compile error** instead of a runtime no-op. Omit
`children` everywhere (fixes P-11).

### 3.9 Dev-only warnings

- `aria-errormessage` without `aria-invalid` (routing alone leaves it inert)
- both `aria-label` and `aria-labelledby`
- `role` on a component whose control has a managed role
- anything hitting the reserved set

(No warning for `title` — see D-2.)

### 3.10 Validation wiring (companion fix for P-9/P-10)

Extract the duplicated describedby merge into `packages/vesper/src/utils/hooks/useFormControl.ts`,
which also owns:

- `variant === "error" && message` => `aria-invalid="true"` + `aria-errormessage={messageId}` on the
  control (and `aria-describedby` for non-error variants), unless explicitly overridden
- consumer `aria-describedby` merged, never clobbered
- consumer `aria-labelledby` suppresses the auto `aria-label` default
- id derivation (`${id}-message`, `${id}-label`)

### 3.11 Extensibility requirements

The router, hooks, and contract suite must absorb `switch`, `radio-group`, `choicebox`, and
`toggle` later **without redesign**. Those components will have adopted `FormInputWrapper` by then,
so these requirements are derived from their **post-migration** shapes (§7.1).

That assumption removes two requirements that today's shapes would otherwise have implied:

- **The wrapper is always a `FormInputWrapper` `div`**, so the wrapper target does not need to be
  polymorphic. (`switch`'s bare `<label>` root and `radio-group`'s `<fieldset>` root both disappear
  behind a wrapper.) `wrapperProps` can stay typed as `ComponentProps<"div">`.
- **`wrapper` is never aliased to `control`**, so the router never has to collapse all three targets
  onto a single element — only `form` and `control` can coincide.

| # | Requirement | Driven by |
| --- | --- | --- |
| E-1 | **`form` / `control` aliasing.** These two may resolve to the same element; only `wrapper` is guaranteed distinct. | `checkbox`/`text-input`/`text-area` now; `switch`/`radio-group`/`choicebox` later |
| E-2 | **Multi-control opt-out must be generic**, not a `Range` special case: a component can declare "no single control", sending value ARIA to reserved and per-item attributes to array/`options[]` props. | `range`/`slider` now; `radio-group`/`choicebox`/`toggle` later |
| E-3 | **Per-component reserved lists**, already required for `select`/`combobox`, must accept additions like `tabIndex` (roving tabindex) and `role`. | `choicebox`/`toggle` roving tabindex |
| E-4 | **Label association must be pluggable.** In-scope components use `<label htmlFor>`; groups cannot (`htmlFor` only targets labelable elements) and need `label.id` + `aria-labelledby`. `useFormControl.ts` should expose both strategies, selected per component. | §7.5 group labelling |
| E-5 | **Per-prop target overrides**, so a prop can be pinned to a target other than its default bucket. | `disabled` defaults to the `form` target, but `fieldset[disabled]` must stay on the `fieldset` (the `control`) for the native descendant cascade |
| E-6 | **The contract suite takes `control` and `form` resolvers** plus an expected reserved list, so any shape can opt in. The `wrapper` resolver is always `container.firstElementChild`. | all four deferred components |

---

## 4. Implementation Priority

Per D-7, this lands as a **stack of PRs** (the `gh-stack` extension is available), one per priority
level. Every changeset is `minor` or `patch` — **never `major`**, which would bump `0.0.0` -> `1.0.0`.

### P0 — Router + tests, behaviour-preserving (PR 1, `patch`)

Land the machinery with **today's routing preserved exactly**. Pure refactor: no behaviour change,
no snapshot churn, deletes ~700 lines. This gives the behaviour changes in P1 a green, meaningful
test suite to land against, and keeps the P1 diff reviewable.

1. `splitFormInputProps.ts` + `composeEventHandlers.ts` + `hooks/useFormControl.ts`, satisfying
   §3.11
2. `describeFormInputForwarding.tsx` contract suite, plus a `src/**/test-utils/**` entry in
   `packages/vesper/tsconfig.build.json`'s `exclude` so the helper isn't published
3. Migrate `checkbox`, `text-input`, `text-area` off their local `ForwardedPropTypes`
4. Delete `onSubmit`/`onReset` from the forwarded sets (P-5 — dead props; type-level removal only)

### P1 — Apply the routing matrix (PR 2, `minor`)

5. ARIA routes to the control; `title` -> control (D-2); `ref` -> control (D-3); `data-*` stays on
   the wrapper (D-1)
6. Per-component target maps (§3.4) for `select`, `combobox`, `range`/`slider`
7. Generic multi-control opt-out for `range`/`slider` (§3.3)
8. Fix `id` -> control in `range`/`slider` (P-3)
9. Fix duplicated `role` / phantom tab stop in `select`/`combobox` (P-2)
10. Fix non-bubbling handlers in `select`/`combobox`/`range` (P-4)
11. Remove `inputRef`/`textareaRef`/`triggerRef` in favour of `ref` (D-8): 5 prop definitions,
    `masked-input`'s ref plumbing (it merges `inputRef` with `maskitoRef`), and 5 `.mdx` files
12. One `minor` changeset with a "props that changed destination" table

### P2 — Semantics and surface (PR 3, `minor`)

13. Validation wiring: auto `aria-invalid` + `aria-errormessage` from `variant`/`message` (§3.10)
14. `aria-label` / `aria-labelledby` precedence fix (P-10)
15. Narrow the public prop types; omit `children` everywhere (§3.8, P-11)
16. `controlProps` / `wrapperProps` escape hatch (§3.6, P-8)

### P3 — Polish (PR 4, `patch`)

17. Dev-only warnings (§3.9)
18. Document the routing matrix in `docs/` and link it from each in-scope component's `.mdx`

---

## 5. Migration Notes

- Snapshots churn in P1 as attributes move between elements.
- `ref` changes type from `Ref<HTMLDivElement>` to `Ref<HTMLInputElement>` etc. — loud compile
  errors at every call site, which is intended.
- **`Range`/`Slider` gain a control ref they never had.** They expose no public control ref today,
  so `ref` moves from the `FormInputWrapper` div to `BaseSlider.Root`. Use `wrapperProps={{ ref }}`
  for the old behaviour.
- Consumers relying on `onClick`/`onMouseDown` at wrapper level are unaffected (mouse/pointer stay
  on the wrapper); consumers relying on `onFocus`/`onKeyDown` at wrapper level in
  `select`/`combobox`/`range` will see those move to the control.
- `data-testid` keeps pointing at the wrapper (D-1), so existing consumer tests keep working.
- `getByRole` remains the recommended way to reach the control in tests.
- `switch`, `radio-group`, `choicebox`, and `toggle` are untouched by this change and keep their
  current behaviour, including `switch`'s `ForwardedPropTypes` union and its `inputRef` prop.
- No `apps/website` changes are required for the ref removal — it has zero usages of the aliases.

---

## 6. Open Questions

None — all resolved; see the [Decisions](#decisions) table (D-1 through D-8).

---

## 7. Deferred: the four components that have not adopted the wrapper pattern

Out of scope for TT-785; recorded so the analysis isn't re-derived. `switch`, `radio-group`,
`choicebox`, and `toggle` will adopt `FormInputWrapper` **and** the router in a follow-up.

### 7.1 Post-migration shapes

Each of these adopts `FormInputWrapper` in "Shape 1" (§7.5) **first**, then adopts the router. These
are the shapes the extensibility requirements in §3.11 assume:

| Component | `form` target | `control` target | `wrapper` target | Reserved |
| --- | --- | --- | --- | --- |
| `switch` | the `input` | the `input` | `FormInputWrapper` div | — |
| `radio-group` | N x `input[type=radio]` (per-option) | `fieldset[role=radiogroup]` | `FormInputWrapper` div | `tabIndex` |
| `choicebox` | N x `input` (per-option) | `fieldset[role=radiogroup\|group]` | `FormInputWrapper` div | `tabIndex` |
| `toggle` | hidden `<select>` | `div[role=radiogroup]` | `FormInputWrapper` div | `role`, `tabIndex` |

`switch` becomes shape-identical to `checkbox`, so it needs nothing from the router beyond what P0
already delivers. The other three are "wrapper div + one semantic control element + N items", which
is the shape E-1 through E-6 are written against.

### 7.2 Current shapes (what the migration starts from)

| Component | Root element | Controls | Notes |
| --- | --- | --- | --- |
| `switch` | bare `label` | `input[type=checkbox]` | leaf control; migration is mechanical |
| `radio-group` | `fieldset` | N x `input[type=radio]` | root is the semantic control |
| `choicebox` | `fieldset` | N x `input[type=radio\|checkbox]` | root is the semantic control |
| `toggle` | `div[role=radiogroup]` | hidden `select` + N x `button[role=radio]` | already splits `form` (`id`/`name`/`required`/`disabled` -> hidden `select`) from `control` (`role`/`aria-required` -> root div) |

`toggle` is the only one that already has a `form` / `control` split, and it matches §7.1 exactly —
so its routing needs no rework once a wrapper is added above it.

### 7.3 Known bug to fix during that work

`toggle` renders a hidden `<select required>` for constraint validation, but consumer handlers land
on the root `div`. Because `onInvalid` does not bubble, **`<Toggle onInvalid={…} />` never fires**
(P-4 applied to `toggle`). Adopting the router fixes this for free, since `onInvalid` routes to the
`form` target.

### 7.4 Missing features

None of `radio-group`, `choicebox`, or `toggle` expose `label`, `message`, or `variant`, so there is
no accessible way to name a group or attach a validation message to one. `switch` is missing
`message` and `variant`.

### 7.5 Recommended structure: "Shape 1" — wrapper outside the group element

```html
<div class="vesper-form-input-wrapper">      <!-- wrapper: className, style, data-*, layout -->
  <label id="lbl">Color</label>              <!-- note: no htmlFor -->
  <fieldset role="radiogroup"                <!-- control: aria-*, disabled cascade -->
            aria-labelledby="lbl"
            aria-describedby="msg">
    …options…
  </fieldset>
  <FormInputMessage id="msg" />
</div>
```

1. **Labelling must use `aria-labelledby`, not `htmlFor`.** `<label htmlFor>` only associates with
   labelable elements (`input`, `select`, `textarea`, `button`, `meter`, `output`, `progress`) — it
   cannot target a `fieldset` or a `role=radiogroup` div. `FormInputWrapperProps.label` already
   accepts an optional `id` (exercised in `form-input-wrapper.test.tsx:87`), so group components can
   pass `label={{ text, id: labelId }}` with no `htmlFor` and set `aria-labelledby={labelId}` on the
   group. **`FormInputWrapper` itself needs no change.** (This is requirement E-4.)
2. **`<legend>` is not available** in this shape, because the label lives outside the fieldset.
   `aria-labelledby` on `role=radiogroup`/`role=group` is the spec-blessed equivalent and is well
   supported.
3. **Why not the alternative** (polymorphic `FormInputWrapper as="fieldset"` with a `<legend>`):
   `.vesper-form-input-wrapper` is `display: flex; flex-direction: column; gap`, and `<legend>` is
   not a reliable flex item — browsers render it into the fieldset's border box. It needs an inner
   wrapper div, which reintroduces the tier it was meant to save. `toggle` uses
   `div[role=radiogroup]`, not a `fieldset`, so it would need a different `as` regardless.
4. **Give the group an explicit role** so `aria-invalid` / `aria-required` are valid on it:
   `role="radiogroup"` for `radio-group` and single-select `choicebox`, `role="group"` for
   multi-select `choicebox`. `toggle` already has `role="radiogroup"`.
5. **`disabled` stays on the `fieldset`** — the native descendant-disabling cascade must not be
   hoisted to the wrapper `div`. (This is requirement E-5.)
6. **`required` splits**: the native attribute goes to the `form` target, `aria-required` to the
   group (which is what `toggle` already does today).
7. **`tabIndex` goes on the reserved list** for `radio-group`, `choicebox`, and `toggle`, all of
   which compute a roving tabindex per option. (This is requirement E-3.)
8. **CSS check:** `.vesper-radio-group`, `.vesper-choicebox`, and `.vesper-toggle` are flex
   containers with their own `gap`, and would nest inside the wrapper's
   `gap: var(--vesper-spacing-2)` column. Needs a visual pass for doubled spacing.
9. **Test churn:** `radio-group.test.tsx:125` and `toggle.test.tsx:48` assert `data-testid` on
   `container.firstChild`. Under D-1 the wrapper becomes `firstChild`, so they still pass.
   Snapshots will churn from the added tier.

### 7.6 Breaking changes that migration will introduce

`className` and `data-*` will move from the `fieldset`/root element to the new wrapper `div`. `ref`
will **not** move, because of D-3 — it already resolves to the control today and will continue to.
Worth calling out in TT-785's changeset so it isn't a surprise later.

### 7.7 Handler composition in these components

These four are where D-6 becomes load-bearing — they attach real internal handlers to native
elements they render themselves:

| Component | Internal handler | Purpose |
| --- | --- | --- |
| `switch` | `handleChange` | uncontrolled `checked` state sync |
| `choicebox` | `handleKeyDown` | roving focus across options |
| `choicebox` | per-input `onChange` | `min`/`max` custom validity |
| `toggle` | `onKeyDown`, `onBlur` | roving focus, form reset sync |

Two things to watch when they adopt the router:

1. **Ordering flips for `switch`.** `Switch.handleChange` currently updates internal state *before*
   calling `onChange`. D-6 mandates consumer-first, so the side-effect order inverts. React batches
   state updates, so no rendered output changes, but any consumer relying on side-effect ordering
   would see a difference.
2. **D-6 allows no suppression.** If one of these components turns out to need a genuine opt-out
   (most likely the roving-focus keyboard handlers), that is a new decision to make with a concrete
   case in hand — not a reason to pre-build a mechanism now.
