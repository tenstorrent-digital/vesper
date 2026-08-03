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

This makes the Vesper library's component styles and css tokens globally available in your application. For more information on usage of Vesper's css tokens, see [CSS token usage](#css-token-usage).

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
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Inter+Tight:wght@100..900&display=swap" rel="stylesheet">
```

#### Using custom fonts

To use a custom font, you can simply load your custom font into your app (using `next/font/google`, `@font-face`, `<link>`, etc.) and override vesper's font css variables with your own provided font stack. For example, if you wanted to use `Roboto` instead of `Inter Tight` for `--vesper-font-sans`, you would do this:

```css
/* somewhere in your application's css */
:root {
  --vesper-font-sans: "Roboto", system-ui, sans-serif;
}
```

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
