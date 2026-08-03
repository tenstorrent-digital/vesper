# @tenstorrent/vesper

React component library for the Vesper design system

## Installing

You can install the `@tenstorrent/vesper` package from the npm registry using your package manager of choice:

```sh
yarn add @tenstorrent/vesper
npm install @tenstorrent/vesper
pnpm add @tenstorrent/vesper
```

Since `@tenstorrent/vesper` is a React package, you will also need to have `react@^19.0.0` and `react-dom@^19.0.0` installed, as they are peer dependencies.

## Getting started

### Importing library styles

Prior to using any components, you will need to import the library styles from `@tenstorrent/vesper/styles.css` somewhere at the top-level of your application. For example, in a `Next.js` application, you may import them in your app's root `layout.tsx` file:

```
import "@tenstorrent/vesper/styles.css"
```

If you are using [tailwind](https://tailwindcss.com) to style your app, we supply a tailwind-specific file you can import instead. This has two advantages:

1. Vesper's component styles get injected into tailwind's `components` layer, which lets tailwind utility classes override vesper css classes.
2. Vesper's css tokens get injected into the tailwind `@theme` so you can use them in tailwind utility classes, like `bg-vesper-purple-300`, for example.

You should import Vesper's tailwind styles **after** importing `tailwindcss` in your css file, like so:

```css
@import "tailwindcss";
@import "@tenstorrent/vesper/tailwind.css";
```

If you import Vesper's tailwind styles before tailwind's styles, the order of tailwind's internal css layers will get mangled.

### Setting up fonts

Vesper components are styled using two fonts, `Inter Tight` and `IBM Plex Mono`. The fonts themselves are **not** bundled with the package, only the font stacks are. If you want Vesper's components to render in `Inter Tight` and `IBM Plex Mono`, you need to load those fonts in your app (for example with `next/font/google` if developing a `Next.js` application, a `@font-face` rule, or a `<link>` to Google Fonts). If they aren't loaded, the fallbacks in each stack are used.

The easiest way to do this is to embed the corresponding Google Fonts code into the `<head>` of your html:

```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Inter+Tight:wght@100..900&display=swap" rel="stylesheet">
```

#### Using custom fonts

To use a custom font, you can simply load your custom font into your app (using `next/font/google`, `@font-face`, `<link>`, etc.) and override vesper's font css variables with your own provided font stack. For example, if you wanted to use `Roboto` instead of `Inter Tight` for `--vesper-font-sans`, you would do this:

```css
/* somewhere in your application's css */
:root {
  --vesper-font-sans: "Roboto", system-ui, sans-serif;
}
```

For more information on css font variables, see [font tokens](#font-tokens).

## General usage

Once you have installed the package and imported the styles, you can start importing and using components like so:

```tsx
import { Accordion } from "@tenstorrent/vesper/accordion";

<Accordion title="Click me to reveal some hidden content">
  The hidden content
</Accordion>;
```

## CSS token usage

Importing the library's styles also exposes Vesper's underlying css tokens for usage in your application.

For example, you could use them in a css file like so:

```css
color: var(--vesper-text-primary);
border: var(--vesper-stroke-base) solid var(--vesper-border-secondary);
background-color: var(--vesper-background-tertiary);
```

Or you can use them as inline styles in JSX:

```tsx
<div
  style={{
    color: "var(--vesper-text-primary)",
    border: "var(--vesper-stroke-base) solid var(--vesper-border-secondary)",
    backgroundColor: "var(--vesper-background-tertiary)",
  }}
/>
```

### Color tokens

Color tokens are split into **primitive** tokens (raw palette values) and **semantic** tokens (aliases of primitive tokens, intended for day-to-day usage). For example, the semantic token `--vesper-background-primary` aliases the primitive `--vesper-stone-0` color token. Prefer semantic tokens wherever possible, since they automatically resolve to the correct primitive for the active theme.

#### Primitive colors tokens

| CSS variable                  | Light mode value            | Dark mode value              |
| ----------------------------- | --------------------------- | ---------------------------- |
| `--vesper-static-black`       | `#071614`                   | `#071614`                    |
| `--vesper-static-white`       | `#f1f8f8`                   | `#f1f8f8`                    |
| `--vesper-transparent`        | `transparent`               | `transparent`                |
| `--vesper-stone-0`            | `#f1f8f8`                   | `#071614`                    |
| `--vesper-stone-50`           | `#e5f2f1`                   | `#0f1d1b`                    |
| `--vesper-stone-100`          | `#d8eae8`                   | `#172624`                    |
| `--vesper-stone-200`          | `#d0e2df`                   | `#1f2d2b`                    |
| `--vesper-stone-300`          | `#c7d9d8`                   | `#263634`                    |
| `--vesper-stone-400`          | `#b3c5c3`                   | `#344d49`                    |
| `--vesper-stone-500`          | `#9eb2b0`                   | `#486762`                    |
| `--vesper-stone-600`          | `#678583`                   | `#60807b`                    |
| `--vesper-stone-700`          | `#415e5b`                   | `#7a9994`                    |
| `--vesper-stone-800`          | `#293d3b`                   | `#c2d6d3`                    |
| `--vesper-stone-900`          | `#092221`                   | `#e7f0ee`                    |
| `--vesper-teal-0`             | `#eff8fb`                   | `#0a161a`                    |
| `--vesper-teal-50`            | `#e2f3f9`                   | `#0e2025`                    |
| `--vesper-teal-100`           | `#caecf7`                   | `#0d2c35`                    |
| `--vesper-teal-200`           | `#a1e2f7`                   | `#073a4a`                    |
| `--vesper-teal-300`           | `#8ad2ea`                   | `#0f4557`                    |
| `--vesper-teal-400`           | `#5cbcdb`                   | `#12647d`                    |
| `--vesper-teal-500`           | `#32abd2`                   | `#157693`                    |
| `--vesper-teal-600`           | `#1b8eb1`                   | `#4eb3d4`                    |
| `--vesper-teal-700`           | `#176782`                   | `#6cc7e5`                    |
| `--vesper-teal-800`           | `#144a5d`                   | `#a3e0f5`                    |
| `--vesper-teal-900`           | `#0c2f3b`                   | `#c8edf9`                    |
| `--vesper-purple-0`           | `#f8f7fd`                   | `#0f0e1b`                    |
| `--vesper-purple-50`          | `#efedfd`                   | `#171528`                    |
| `--vesper-purple-100`         | `#dad5fb`                   | `#211c3f`                    |
| `--vesper-purple-200`         | `#c0b7f9`                   | `#27214a`                    |
| `--vesper-purple-300`         | `#a196e9`                   | `#2f285d`                    |
| `--vesper-purple-400`         | `#8074cd`                   | `#382f74`                    |
| `--vesper-purple-500`         | `#6458b6`                   | `#5145a1`                    |
| `--vesper-purple-600`         | `#4d429a`                   | `#7b70c2`                    |
| `--vesper-purple-700`         | `#342b6e`                   | `#998fdc`                    |
| `--vesper-purple-800`         | `#272150`                   | `#bdb2ff`                    |
| `--vesper-purple-900`         | `#1d1b2d`                   | `#d6d0fb`                    |
| `--vesper-mint-0`             | `#f1fdfb`                   | `#041f19`                    |
| `--vesper-mint-50`            | `#dffbf8`                   | `#073128`                    |
| `--vesper-mint-100`           | `#cef3ee`                   | `#0b4137`                    |
| `--vesper-mint-200`           | `#a5e9dc`                   | `#0b5144`                    |
| `--vesper-mint-300`           | `#78ddcb`                   | `#116959`                    |
| `--vesper-mint-400`           | `#40bfa8`                   | `#15937c`                    |
| `--vesper-mint-500`           | `#29a38d`                   | `#1bbb9e`                    |
| `--vesper-mint-600`           | `#227767`                   | `#39c6ac`                    |
| `--vesper-mint-700`           | `#13584b`                   | `#4ce5c9`                    |
| `--vesper-mint-800`           | `#0f3d35`                   | `#82edd9`                    |
| `--vesper-mint-900`           | `#112c26`                   | `#caf7f1`                    |
| `--vesper-pink-0`             | `#fdf7fb`                   | `#1f0a17`                    |
| `--vesper-pink-50`            | `#fdedf7`                   | `#2e0f22`                    |
| `--vesper-pink-100`           | `#fccfeb`                   | `#3d152e`                    |
| `--vesper-pink-200`           | `#ffade0`                   | `#491d38`                    |
| `--vesper-pink-300`           | `#f17ec5`                   | `#6b2450`                    |
| `--vesper-pink-400`           | `#e557af`                   | `#91306c`                    |
| `--vesper-pink-500`           | `#be378a`                   | `#be378a`                    |
| `--vesper-pink-600`           | `#91306c`                   | `#e34faa`                    |
| `--vesper-pink-700`           | `#6b2450`                   | `#f17ec5`                    |
| `--vesper-pink-800`           | `#441d35`                   | `#ffc2e8`                    |
| `--vesper-pink-900`           | `#2e0f22`                   | `#fde2f3`                    |
| `--vesper-yellow-0`           | `#fffcf5`                   | `#211908`                    |
| `--vesper-yellow-50`          | `#fff5e0`                   | `#31260c`                    |
| `--vesper-yellow-100`         | `#ffebc2`                   | `#3f3112`                    |
| `--vesper-yellow-200`         | `#ffd88a`                   | `#534018`                    |
| `--vesper-yellow-300`         | `#ffc757`                   | `#7a5c1a`                    |
| `--vesper-yellow-400`         | `#ffb71b`                   | `#9c7217`                    |
| `--vesper-yellow-500`         | `#d99a12`                   | `#d09311`                    |
| `--vesper-yellow-600`         | `#986f16`                   | `#ffb71b`                    |
| `--vesper-yellow-700`         | `#6d5217`                   | `#ffc757`                    |
| `--vesper-yellow-800`         | `#473715`                   | `#ffd88a`                    |
| `--vesper-yellow-900`         | `#2e2614`                   | `#ffeecc`                    |
| `--vesper-green-0`            | `#f1fdf8`                   | `#041f15`                    |
| `--vesper-green-50`           | `#dffbf2`                   | `#073120`                    |
| `--vesper-green-100`          | `#cef3e7`                   | `#0b412e`                    |
| `--vesper-green-200`          | `#a5e9d0`                   | `#0b5137`                    |
| `--vesper-green-300`          | `#78ddb8`                   | `#116949`                    |
| `--vesper-green-400`          | `#40bf90`                   | `#159365`                    |
| `--vesper-green-500`          | `#29a376`                   | `#1bbb81`                    |
| `--vesper-green-600`          | `#227758`                   | `#39c692`                    |
| `--vesper-green-700`          | `#13583f`                   | `#4ce5ad`                    |
| `--vesper-green-800`          | `#0f3d2c`                   | `#82edc6`                    |
| `--vesper-green-900`          | `#112c21`                   | `#caf7e9`                    |
| `--vesper-red-0`              | `#fef3f0`                   | `#1d0f0c`                    |
| `--vesper-red-50`             | `#fde7e2`                   | `#2c1611`                    |
| `--vesper-red-100`            | `#fbcfc6`                   | `#3d1b14`                    |
| `--vesper-red-200`            | `#faad9e`                   | `#521f14`                    |
| `--vesper-red-300`            | `#f88d77`                   | `#7a2a1a`                    |
| `--vesper-red-400`            | `#f45434`                   | `#973420`                    |
| `--vesper-red-500`            | `#d93c1c`                   | `#d43b1c`                    |
| `--vesper-red-600`            | `#b3341a`                   | `#e44e2f`                    |
| `--vesper-red-700`            | `#7c3627`                   | `#f37359`                    |
| `--vesper-red-800`            | `#523028`                   | `#f5b2a3`                    |
| `--vesper-red-900`            | `#2c1a16`                   | `#fde8e2`                    |
| `--vesper-amber-0`            | `#fffaf5`                   | `#211608`                    |
| `--vesper-amber-50`           | `#fff1e0`                   | `#31210c`                    |
| `--vesper-amber-100`          | `#ffe4c2`                   | `#3f2b12`                    |
| `--vesper-amber-200`          | `#ffc88a`                   | `#533818`                    |
| `--vesper-amber-300`          | `#ffb057`                   | `#7a4f1a`                    |
| `--vesper-amber-400`          | `#ff951b`                   | `#9c5e17`                    |
| `--vesper-amber-500`          | `#d97912`                   | `#d07a11`                    |
| `--vesper-amber-600`          | `#985d16`                   | `#ff991b`                    |
| `--vesper-amber-700`          | `#6d4717`                   | `#ffb057`                    |
| `--vesper-amber-800`          | `#473015`                   | `#ffc88a`                    |
| `--vesper-amber-900`          | `#2e2214`                   | `#ffe7cc`                    |
| `--vesper-sky-0`              | `#f0f9fe`                   | `#09101b`                    |
| `--vesper-sky-50`             | `#e0f3ff`                   | `#0f1b2d`                    |
| `--vesper-sky-100`            | `#c2e3fa`                   | `#10243e`                    |
| `--vesper-sky-200`            | `#9acef4`                   | `#092e53`                    |
| `--vesper-sky-300`            | `#6cb5ea`                   | `#0f4d86`                    |
| `--vesper-sky-400`            | `#3b9de3`                   | `#135ea7`                    |
| `--vesper-sky-500`            | `#2270bf`                   | `#1671c9`                    |
| `--vesper-sky-600`            | `#0f5499`                   | `#0091ff`                    |
| `--vesper-sky-700`            | `#1a4066`                   | `#33a3ff`                    |
| `--vesper-sky-800`            | `#1a3046`                   | `#70b8ff`                    |
| `--vesper-sky-900`            | `#122130`                   | `#c2e0ff`                    |
| `--vesper-alpha-stone-0`      | `rgba(28, 161, 157, 0.023)` | `rgba(33, 60, 61, 0.03)`     |
| `--vesper-alpha-stone-50`     | `rgba(14, 129, 115, 0.043)` | `rgba(154, 246, 244, 0.035)` |
| `--vesper-alpha-stone-100`    | `rgba(26, 116, 95, 0.104)`  | `rgba(184, 244, 243, 0.075)` |
| `--vesper-alpha-stone-200`    | `rgba(20, 92, 81, 0.125)`   | `rgba(204, 245, 241, 0.11)`  |
| `--vesper-alpha-stone-300`    | `rgba(16, 76, 69, 0.169)`   | `rgba(215, 249, 242, 0.141)` |
| `--vesper-alpha-stone-400`    | `rgba(1, 48, 46, 0.255)`    | `rgba(174, 254, 244, 0.247)` |
| `--vesper-alpha-stone-500`    | `rgba(3, 46, 44, 0.345)`    | `rgba(180, 255, 244, 0.357)` |
| `--vesper-alpha-stone-600`    | `rgba(0, 48, 46, 0.572)`    | `rgba(195, 255, 247, 0.461)` |
| `--vesper-alpha-stone-700`    | `rgba(0, 36, 32, 0.729)`    | `rgba(206, 255, 248, 0.561)` |
| `--vesper-alpha-stone-800`    | `rgba(0, 26, 23, 0.839)`    | `rgba(231, 254, 250, 0.834)` |
| `--vesper-alpha-stone-900`    | `rgba(0, 30, 29, 0.973)`    | `rgba(245, 255, 253, 0.937)` |
| `--vesper-alpha-contrast-0`   | `transparent`               | `transparent`                |
| `--vesper-alpha-contrast-50`  | `rgba(7, 22, 20, 0.05)`     | `rgba(241, 248, 248, 0.05)`  |
| `--vesper-alpha-contrast-100` | `rgba(7, 22, 20, 0.1)`      | `rgba(241, 248, 248, 0.1)`   |
| `--vesper-alpha-contrast-200` | `rgba(7, 22, 20, 0.2)`      | `rgba(241, 248, 248, 0.2)`   |
| `--vesper-alpha-contrast-300` | `rgba(7, 22, 20, 0.3)`      | `rgba(241, 248, 248, 0.3)`   |
| `--vesper-alpha-contrast-400` | `rgba(7, 22, 20, 0.4)`      | `rgba(241, 248, 248, 0.4)`   |
| `--vesper-alpha-contrast-500` | `rgba(7, 22, 20, 0.5)`      | `rgba(241, 248, 248, 0.5)`   |
| `--vesper-alpha-contrast-600` | `rgba(7, 22, 20, 0.6)`      | `rgba(241, 248, 248, 0.6)`   |
| `--vesper-alpha-contrast-700` | `rgba(7, 22, 20, 0.7)`      | `rgba(241, 248, 248, 0.7)`   |
| `--vesper-alpha-contrast-800` | `rgba(7, 22, 20, 0.8)`      | `rgba(241, 248, 248, 0.8)`   |
| `--vesper-alpha-contrast-900` | `rgba(7, 22, 20, 0.9)`      | `rgba(241, 248, 248, 0.9)`   |
| `--vesper-alpha-inverse-0`    | `transparent`               | `transparent`                |
| `--vesper-alpha-inverse-50`   | `rgba(241, 248, 248, 0.05)` | `rgba(7, 22, 20, 0.05)`      |
| `--vesper-alpha-inverse-100`  | `rgba(241, 248, 248, 0.1)`  | `rgba(7, 22, 20, 0.1)`       |
| `--vesper-alpha-inverse-200`  | `rgba(241, 248, 248, 0.2)`  | `rgba(7, 22, 20, 0.2)`       |
| `--vesper-alpha-inverse-300`  | `rgba(241, 248, 248, 0.3)`  | `rgba(7, 22, 20, 0.3)`       |
| `--vesper-alpha-inverse-400`  | `rgba(241, 248, 248, 0.4)`  | `rgba(7, 22, 20, 0.4)`       |
| `--vesper-alpha-inverse-500`  | `rgba(241, 248, 248, 0.5)`  | `rgba(7, 22, 20, 0.5)`       |
| `--vesper-alpha-inverse-600`  | `rgba(241, 248, 248, 0.6)`  | `rgba(7, 22, 20, 0.6)`       |
| `--vesper-alpha-inverse-700`  | `rgba(241, 248, 248, 0.7)`  | `rgba(7, 22, 20, 0.7)`       |
| `--vesper-alpha-inverse-800`  | `rgba(241, 248, 248, 0.8)`  | `rgba(7, 22, 20, 0.8)`       |
| `--vesper-alpha-inverse-900`  | `rgba(241, 248, 248, 0.9)`  | `rgba(7, 22, 20, 0.9)`       |
| `--vesper-alpha-black-0`      | `transparent`               | `transparent`                |
| `--vesper-alpha-black-50`     | `rgba(7, 22, 20, 0.05)`     | `rgba(7, 22, 20, 0.05)`      |
| `--vesper-alpha-black-100`    | `rgba(7, 22, 20, 0.1)`      | `rgba(7, 22, 20, 0.1)`       |
| `--vesper-alpha-black-200`    | `rgba(7, 22, 20, 0.2)`      | `rgba(7, 22, 20, 0.2)`       |
| `--vesper-alpha-black-300`    | `rgba(7, 22, 20, 0.3)`      | `rgba(7, 22, 20, 0.3)`       |
| `--vesper-alpha-black-400`    | `rgba(7, 22, 20, 0.4)`      | `rgba(7, 22, 20, 0.4)`       |
| `--vesper-alpha-black-500`    | `rgba(7, 22, 20, 0.5)`      | `rgba(7, 22, 20, 0.5)`       |
| `--vesper-alpha-black-600`    | `rgba(7, 22, 20, 0.6)`      | `rgba(7, 22, 20, 0.6)`       |
| `--vesper-alpha-black-700`    | `rgba(7, 22, 20, 0.7)`      | `rgba(7, 22, 20, 0.7)`       |
| `--vesper-alpha-black-800`    | `rgba(7, 22, 20, 0.8)`      | `rgba(7, 22, 20, 0.8)`       |
| `--vesper-alpha-black-900`    | `rgba(7, 22, 20, 0.9)`      | `rgba(7, 22, 20, 0.9)`       |
| `--vesper-alpha-white-0`      | `transparent`               | `transparent`                |
| `--vesper-alpha-white-50`     | `rgba(241, 248, 248, 0.05)` | `rgba(241, 248, 248, 0.05)`  |
| `--vesper-alpha-white-100`    | `rgba(241, 248, 248, 0.1)`  | `rgba(241, 248, 248, 0.1)`   |
| `--vesper-alpha-white-200`    | `rgba(241, 248, 248, 0.2)`  | `rgba(241, 248, 248, 0.2)`   |
| `--vesper-alpha-white-300`    | `rgba(241, 248, 248, 0.3)`  | `rgba(241, 248, 248, 0.3)`   |
| `--vesper-alpha-white-400`    | `rgba(241, 248, 248, 0.4)`  | `rgba(241, 248, 248, 0.4)`   |
| `--vesper-alpha-white-500`    | `rgba(241, 248, 248, 0.5)`  | `rgba(241, 248, 248, 0.5)`   |
| `--vesper-alpha-white-600`    | `rgba(241, 248, 248, 0.6)`  | `rgba(241, 248, 248, 0.6)`   |
| `--vesper-alpha-white-700`    | `rgba(241, 248, 248, 0.7)`  | `rgba(241, 248, 248, 0.7)`   |
| `--vesper-alpha-white-800`    | `rgba(241, 248, 248, 0.8)`  | `rgba(241, 248, 248, 0.8)`   |
| `--vesper-alpha-white-900`    | `rgba(241, 248, 248, 0.9)`  | `rgba(241, 248, 248, 0.9)`   |

#### Semantic color tokens

| CSS variable                              | Alias                         |
| ----------------------------------------- | ----------------------------- |
| `--vesper-background-primary`             | `--vesper-stone-0`            |
| `--vesper-background-secondary`           | `--vesper-stone-50`           |
| `--vesper-background-tertiary`            | `--vesper-stone-100`          |
| `--vesper-background-disabled`            | `--vesper-alpha-stone-100`    |
| `--vesper-background-inverse-primary`     | `--vesper-alpha-stone-900`    |
| `--vesper-background-inverse-secondary`   | `--vesper-alpha-stone-800`    |
| `--vesper-background-inverse-disabled`    | `--vesper-alpha-inverse-50`   |
| `--vesper-background-accent-subtle`       | `--vesper-teal-50`            |
| `--vesper-background-accent-base`         | `--vesper-teal-400`           |
| `--vesper-background-success-subtle`      | `--vesper-green-50`           |
| `--vesper-background-success-base`        | `--vesper-green-600`          |
| `--vesper-background-warning-subtle`      | `--vesper-amber-50`           |
| `--vesper-background-warning-base`        | `--vesper-amber-500`          |
| `--vesper-background-error-subtle`        | `--vesper-red-50`             |
| `--vesper-background-error-base`          | `--vesper-red-500`            |
| `--vesper-background-info-subtle`         | `--vesper-sky-50`             |
| `--vesper-background-info-base`           | `--vesper-sky-600`            |
| `--vesper-background-static-white`        | `--vesper-static-white`       |
| `--vesper-background-static-black`        | `--vesper-static-black`       |
| `--vesper-background-brand-purple-subtle` | `--vesper-purple-50`          |
| `--vesper-background-brand-purple-base`   | `--vesper-purple-600`         |
| `--vesper-background-brand-mint-subtle`   | `--vesper-mint-50`            |
| `--vesper-background-brand-mint-base`     | `--vesper-mint-600`           |
| `--vesper-background-brand-pink-subtle`   | `--vesper-pink-50`            |
| `--vesper-background-brand-pink-base`     | `--vesper-pink-600`           |
| `--vesper-background-brand-yellow-subtle` | `--vesper-yellow-50`          |
| `--vesper-background-brand-yellow-base`   | `--vesper-yellow-400`         |
| `--vesper-text-primary`                   | `--vesper-stone-900`          |
| `--vesper-text-secondary`                 | `--vesper-stone-700`          |
| `--vesper-text-tertiary`                  | `--vesper-stone-500`          |
| `--vesper-text-disabled`                  | `--vesper-alpha-stone-400`    |
| `--vesper-text-inverse-primary`           | `--vesper-stone-0`            |
| `--vesper-text-inverse-secondary`         | `--vesper-stone-500`          |
| `--vesper-text-inverse-tertiary`          | `--vesper-stone-600`          |
| `--vesper-text-alpha-disabled`            | `--vesper-alpha-inverse-300`  |
| `--vesper-text-on-color`                  | `--vesper-static-white`       |
| `--vesper-text-accent`                    | `--vesper-teal-700`           |
| `--vesper-text-success`                   | `--vesper-mint-600`           |
| `--vesper-text-warning`                   | `--vesper-amber-600`          |
| `--vesper-text-error`                     | `--vesper-red-600`            |
| `--vesper-text-info`                      | `--vesper-sky-600`            |
| `--vesper-text-static-black`              | `--vesper-static-black`       |
| `--vesper-text-static-white`              | `--vesper-static-white`       |
| `--vesper-text-link-default`              | `--vesper-teal-700`           |
| `--vesper-text-link-hover`                | `--vesper-teal-600`           |
| `--vesper-text-link-visited`              | `--vesper-teal-800`           |
| `--vesper-text-link-disabled`             | `--vesper-alpha-stone-400`    |
| `--vesper-text-brand-purple`              | `--vesper-purple-600`         |
| `--vesper-text-brand-mint`                | `--vesper-mint-600`           |
| `--vesper-text-brand-pink`                | `--vesper-pink-600`           |
| `--vesper-text-brand-yellow`              | `--vesper-yellow-600`         |
| `--vesper-icon-primary`                   | `--vesper-stone-900`          |
| `--vesper-icon-secondary`                 | `--vesper-stone-700`          |
| `--vesper-icon-tertiary`                  | `--vesper-stone-600`          |
| `--vesper-icon-disabled`                  | `--vesper-alpha-stone-500`    |
| `--vesper-icon-inverse-primary`           | `--vesper-stone-0`            |
| `--vesper-icon-inverse-secondary`         | `--vesper-stone-500`          |
| `--vesper-icon-inverse-tertiary`          | `--vesper-stone-600`          |
| `--vesper-icon-inverse-disabled`          | `--vesper-alpha-inverse-300`  |
| `--vesper-icon-on-color`                  | `--vesper-static-white`       |
| `--vesper-icon-accent`                    | `--vesper-teal-700`           |
| `--vesper-icon-success`                   | `--vesper-mint-600`           |
| `--vesper-icon-warning`                   | `--vesper-amber-600`          |
| `--vesper-icon-error`                     | `--vesper-red-600`            |
| `--vesper-icon-info`                      | `--vesper-sky-600`            |
| `--vesper-icon-static-black`              | `--vesper-static-black`       |
| `--vesper-icon-static-white`              | `--vesper-static-white`       |
| `--vesper-icon-brand-purple`              | `--vesper-purple-600`         |
| `--vesper-icon-brand-mint`                | `--vesper-mint-600`           |
| `--vesper-icon-brand-pink`                | `--vesper-pink-600`           |
| `--vesper-icon-brand-yellow`              | `--vesper-yellow-600`         |
| `--vesper-border-primary`                 | `--vesper-stone-400`          |
| `--vesper-border-secondary`               | `--vesper-stone-300`          |
| `--vesper-border-tertiary`                | `--vesper-stone-200`          |
| `--vesper-border-strong`                  | `--vesper-stone-900`          |
| `--vesper-border-disabled`                | `--vesper-alpha-stone-200`    |
| `--vesper-border-focus`                   | `--vesper-teal-200`           |
| `--vesper-border-inverse-primary`         | `--vesper-stone-400`          |
| `--vesper-border-inverse-secondary`       | `--vesper-stone-600`          |
| `--vesper-border-inverse-strong`          | `--vesper-stone-0`            |
| `--vesper-border-inverse-disabled`        | `--vesper-alpha-inverse-100`  |
| `--vesper-border-inverse-focus`           | `--vesper-teal-500`           |
| `--vesper-border-static-white`            | `--vesper-static-white`       |
| `--vesper-border-static-black`            | `--vesper-static-black`       |
| `--vesper-border-accent-subtle`           | `--vesper-teal-200`           |
| `--vesper-border-accent-base`             | `--vesper-teal-600`           |
| `--vesper-border-success-subtle`          | `--vesper-green-200`          |
| `--vesper-border-success-base`            | `--vesper-green-500`          |
| `--vesper-border-warning-subtle`          | `--vesper-amber-200`          |
| `--vesper-border-warning-base`            | `--vesper-amber-500`          |
| `--vesper-border-error-subtle`            | `--vesper-red-200`            |
| `--vesper-border-error-base`              | `--vesper-red-500`            |
| `--vesper-border-info-subtle`             | `--vesper-sky-200`            |
| `--vesper-border-info-base`               | `--vesper-sky-500`            |
| `--vesper-border-brand-purple-subtle`     | `--vesper-purple-200`         |
| `--vesper-border-brand-purple-base`       | `--vesper-purple-500`         |
| `--vesper-border-brand-mint-subtle`       | `--vesper-mint-200`           |
| `--vesper-border-brand-mint-base`         | `--vesper-mint-500`           |
| `--vesper-border-brand-pink-subtle`       | `--vesper-pink-200`           |
| `--vesper-border-brand-pink-base`         | `--vesper-pink-500`           |
| `--vesper-border-brand-yellow-subtle`     | `--vesper-yellow-200`         |
| `--vesper-border-brand-yellow-base`       | `--vesper-yellow-500`         |
| `--vesper-scrim-contrast-subtle`          | `--vesper-alpha-black-300`    |
| `--vesper-scrim-contrast-base`            | `--vesper-alpha-black-600`    |
| `--vesper-scrim-inverse-subtle`           | `--vesper-alpha-white-300`    |
| `--vesper-scrim-inverse-base`             | `--vesper-alpha-white-600`    |
| `--vesper-state-neutral-hover`            | `--vesper-alpha-stone-0`      |
| `--vesper-state-neutral-active`           | `--vesper-alpha-stone-50`     |
| `--vesper-state-contrast-hover`           | `--vesper-alpha-contrast-50`  |
| `--vesper-state-contrast-active`          | `--vesper-alpha-contrast-100` |
| `--vesper-state-inverse-hover`            | `--vesper-alpha-inverse-100`  |
| `--vesper-state-inverse-active`           | `--vesper-alpha-inverse-200`  |
| `--vesper-tint-neutral-100`               | `--vesper-alpha-stone-0`      |
| `--vesper-tint-neutral-200`               | `--vesper-alpha-stone-50`     |
| `--vesper-tint-neutral-300`               | `--vesper-alpha-stone-100`    |
| `--vesper-tint-neutral-400`               | `--vesper-alpha-stone-200`    |
| `--vesper-tint-contrast-100`              | `--vesper-alpha-contrast-50`  |
| `--vesper-tint-contrast-200`              | `--vesper-alpha-contrast-100` |
| `--vesper-tint-contrast-300`              | `--vesper-alpha-contrast-200` |
| `--vesper-tint-contrast-400`              | `--vesper-alpha-contrast-300` |
| `--vesper-tint-inverse-100`               | `--vesper-alpha-inverse-300`  |
| `--vesper-tint-inverse-200`               | `--vesper-alpha-inverse-500`  |
| `--vesper-tint-inverse-300`               | `--vesper-alpha-inverse-700`  |
| `--vesper-tint-inverse-400`               | `--vesper-alpha-inverse-800`  |

#### Usage in tailwind apps

If you imported `@tenstorrent/vesper/tailwind.css` into your css file where you set up tailwind, these color tokens are available for use in tailwind's utility classes. Every color token (primitive and semantic) is registered in tailwind's `--color-*` namespace as `--color-vesper-*`, so any tailwind utility that accepts a color works: `bg-*`, `text-*`, `border-*`, `outline-*`, `ring-*`, `fill-*`, `stroke-*`, `divide-*`, `shadow-*`, `accent-*`, and so on.

For example:

```tsx
<div className="bg-vesper-stone-500" />;
<div className="border-vesper-border-secondary" />;
<div className="text-vesper-icon-primary" />;
```

### Font tokens

| CSS variable         | Value                                  |
| -------------------- | -------------------------------------- |
| `--vesper-font-sans` | `"Inter Tight", system-ui, sans-serif` |
| `--vesper-font-mono` | `"IBM Plex Mono", monospace`           |

For custom font usage, see [using custom fonts](#using-custom-fonts)

#### Usage in tailwind apps

Font tokens are registered in tailwind's `--font-*` namespace, so they are available as `font-family` utilities:

```tsx
<p className="font-vesper-sans" />;
<code className="font-vesper-mono" />;
```

### Leading tokens

Leading (line height) tokens are percentage based, so they scale with the element's font size.

| CSS variable               | Value  |
| -------------------------- | ------ |
| `--vesper-leading-none`    | `100%` |
| `--vesper-leading-tight`   | `110%` |
| `--vesper-leading-snug`    | `120%` |
| `--vesper-leading-normal`  | `140%` |
| `--vesper-leading-relaxed` | `150%` |
| `--vesper-leading-loose`   | `175%` |

#### Usage in tailwind apps

Leading tokens are registered in tailwind's `--leading-*` namespace, so they are available as `line-height` utilities:

```tsx
<p className="leading-vesper-normal" />;
<p className="leading-vesper-loose" />;
```

### Tracking tokens

Tracking (letter spacing) tokens are also relative to the element's font size. The values below are expressed as a percentage of the font size — for example, `--vesper-tracking-tight` resolves to `-0.25px` at a `16px` font size.

| CSS variable                 | Value                       | Equivalent at `16px` font size |
| ---------------------------- | --------------------------- | ------------------------------ |
| `--vesper-tracking-tightest` | `calc(-100% * (0.75 / 16))` | `-0.75px`                      |
| `--vesper-tracking-tighter`  | `calc(-100% * (0.5 / 16))`  | `-0.5px`                       |
| `--vesper-tracking-tight`    | `calc(-100% * (0.25 / 16))` | `-0.25px`                      |
| `--vesper-tracking-normal`   | `0`                         | `0px`                          |
| `--vesper-tracking-wide`     | `calc(100% * (0.25 / 16))`  | `0.25px`                       |
| `--vesper-tracking-wider`    | `calc(100% * (0.5 / 16))`   | `0.5px`                        |
| `--vesper-tracking-widest`   | `calc(100% * (0.75 / 16))`  | `0.75px`                       |

#### Usage in tailwind apps

Tracking tokens are registered in tailwind's `--tracking-*` namespace, so they are available as `letter-spacing` utilities:

```tsx
<h1 className="tracking-vesper-tight" />;
<span className="tracking-vesper-wide" />;
```

### Radius tokens

| CSS variable           | Value      |
| ---------------------- | ---------- |
| `--vesper-radius-half` | `0.125rem` |
| `--vesper-radius-1`    | `0.25rem`  |
| `--vesper-radius-2`    | `0.5rem`   |
| `--vesper-radius-3`    | `0.75rem`  |
| `--vesper-radius-4`    | `1rem`     |
| `--vesper-radius-6`    | `1.5rem`   |
| `--vesper-radius-7`    | `1.75rem`  |

#### Usage in tailwind apps

Radius tokens are registered in tailwind's `--radius-*` namespace, so they work with every `border-radius` utility, including the side- and corner-specific ones:

```tsx
<div className="rounded-vesper-2" />;
<div className="rounded-t-vesper-4" />;
<div className="rounded-bl-vesper-half" />;
```

### Shadow tokens

| CSS variable                 | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| `--vesper-shadow-100`        | `0 0.125rem 0.375rem 0.0625rem rgba(9, 34, 33, 0.1)`           |
| `--vesper-shadow-200`        | `0 0.25rem 0.75rem 0 rgba(9, 34, 33, 0.1)`                     |
| `--vesper-shadow-300`        | `0 0.75rem 2rem 0 rgba(9, 34, 33, 0.15)`                       |
| `--vesper-shadow-400`        | `0 1.5rem 4rem 0 rgba(9, 34, 33, 0.2)`                         |
| `--vesper-shadow-inset-100`  | `0 0.125rem 0.375rem 0 var(--vesper-alpha-contrast-100) inset` |
| `--vesper-shadow-inset-200`  | `0 0.125rem 0.75rem 0 var(--vesper-tint-contrast-200) inset`   |
| `--vesper-shadow-focus-ring` | `0 0 0 0.1875rem var(--vesper-border-focus)`                   |

#### Usage in tailwind apps

Shadow tokens are registered in tailwind's `--shadow-*` namespace, so they are available as `box-shadow` utilities. Note that the inset tokens already include the `inset` keyword in their value, so they are also applied with `shadow-*` (not `inset-shadow-*`):

```tsx
<div className="shadow-vesper-200" />;
<div className="shadow-vesper-inset-100" />;
<button className="focus-visible:shadow-vesper-focus-ring" />;
```

### Spacing tokens

| CSS variable             | Value       |
| ------------------------ | ----------- |
| `--vesper-spacing-0`     | `0rem`      |
| `--vesper-spacing-micro` | `0.0625rem` |
| `--vesper-spacing-half`  | `0.125rem`  |
| `--vesper-spacing-1`     | `0.25rem`   |
| `--vesper-spacing-2`     | `0.5rem`    |
| `--vesper-spacing-3`     | `0.75rem`   |
| `--vesper-spacing-4`     | `1rem`      |
| `--vesper-spacing-5`     | `1.25rem`   |
| `--vesper-spacing-6`     | `1.5rem`    |
| `--vesper-spacing-8`     | `2rem`      |
| `--vesper-spacing-10`    | `2.5rem`    |
| `--vesper-spacing-12`    | `3rem`      |
| `--vesper-spacing-14`    | `3.5rem`    |
| `--vesper-spacing-16`    | `4rem`      |
| `--vesper-spacing-20`    | `5rem`      |
| `--vesper-spacing-24`    | `6rem`      |
| `--vesper-spacing-28`    | `7rem`      |
| `--vesper-spacing-32`    | `8rem`      |
| `--vesper-spacing-40`    | `10rem`     |

`--vesper-spacing-*` units are based on increments of `0.25rem`. So when the root font size is `16px`, `--vesper-spacing-1` would be `4px`, `--vesper-spacing-2` would be `8px`, `--vesper-spacing-3` would be `12px`, etc.

#### Usage in tailwind apps

Spacing tokens are registered in tailwind's `--spacing-*` namespace as `--spacing-vesper-*`, so they work with every spacing-based utility — padding, margin, width, height, gap, inset, translate, and so on:

```tsx
<div className="p-vesper-4 gap-vesper-2" />;
<div className="mt-vesper-8 px-vesper-3" />;
<div className="size-vesper-10 top-vesper-2" />;
```
