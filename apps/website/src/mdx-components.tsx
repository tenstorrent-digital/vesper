/**
 * components available to every MD/MDX file in the `docs/` folder
 *
 * NOTE: components needing non-serializable props (event handlers, refs, state)
 * can NOT be used in `docs/` directly since documents are rendered from a server
 * component - those live in `@/demos` as client components then are exposed to
 * documents below
 */

import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import {
  type BundledLanguage,
  bundledLanguages,
  type LanguageRegistration,
} from "shiki/bundle/web";

import { Accordion } from "@tenstorrent/vesper/accordion";
import {
  Admonition,
  type AdmonitionVariant,
} from "@tenstorrent/vesper/admonition";
import { Avatar } from "@tenstorrent/vesper/avatar";
import { AvatarGroup } from "@tenstorrent/vesper/avatar-group";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { Checkbox } from "@tenstorrent/vesper/checkbox";
import { Chip } from "@tenstorrent/vesper/chip";
import { Choicebox } from "@tenstorrent/vesper/choicebox";
import { Code } from "@tenstorrent/vesper/code";
import { CodeBlock } from "@tenstorrent/vesper/code-block";
import { Combobox } from "@tenstorrent/vesper/combobox";
import { FormInputMessage } from "@tenstorrent/vesper/form-input-message";
import { IconButton } from "@tenstorrent/vesper/icon-button";
import {
  Add,
  ArrowRight,
  CaretDown,
  Checkmark,
  Close,
  Download,
  Gear,
  Globe,
  Grid,
  Icon,
  Info,
  List,
  Lock,
  Search,
  Tenstorrent,
} from "@tenstorrent/vesper/icons";
import { MaskedInput } from "@tenstorrent/vesper/masked-input";
import { Material } from "@tenstorrent/vesper/material";
import { Modal } from "@tenstorrent/vesper/modal";
import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { RadioGroup } from "@tenstorrent/vesper/radio-group";
import { Range } from "@tenstorrent/vesper/range";
import { Select } from "@tenstorrent/vesper/select";
import { Sheet } from "@tenstorrent/vesper/sheet";
import { ShowMore } from "@tenstorrent/vesper/show-more";
import { Skeleton } from "@tenstorrent/vesper/skeleton";
import { Slider } from "@tenstorrent/vesper/slider";
import { Snippet } from "@tenstorrent/vesper/snippet";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Switch } from "@tenstorrent/vesper/switch";
import { Tabs } from "@tenstorrent/vesper/tabs";
import { Tag } from "@tenstorrent/vesper/tag";
import { TextArea } from "@tenstorrent/vesper/text-area";
import { TextButton } from "@tenstorrent/vesper/text-button";
import { TextInput } from "@tenstorrent/vesper/text-input";
import { ThemeSwitcher } from "@tenstorrent/vesper/theme-switcher";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Tooltip } from "@tenstorrent/vesper/tooltip";
import {
  Typography,
  type TypographyVariant,
} from "@tenstorrent/vesper/typography";

// docs-only components (not part of the design system)
import { ColorChip } from "@/components/color-chip";

// named demos for components w non-serializable props (event handlers,
// refs, state) that are used inside `docs/` documents
import { CheckboxDemo } from "@/demos/checkbox";
import { ChipDemo } from "@/demos/chip";
import { ComboboxDemo } from "@/demos/combobox";
import { IconsDemo } from "@/demos/icons";
import { MaskedInputDemo } from "@/demos/masked-input";
import { MenuDemo } from "@/demos/menu";
import { ProgressBarDemo } from "@/demos/progress-bar";
import { RangeDemo } from "@/demos/range";
import { SelectDemo } from "@/demos/select";
import { ShowMoreDemo } from "@/demos/show-more";
import { SliderDemo } from "@/demos/slider";
import { SplitButtonDemo } from "@/demos/split-button";
import { SwitchDemo } from "@/demos/switch";
import { ToastDemo } from "@/demos/toast";
import { ToggleDemo } from "@/demos/toggle";
import { TooltipDemo } from "@/demos/tooltip";

/**
 * github alert types (`> [!NOTE]`), as picked up by
 * `src/lib/mdx/remark-blockquote-alerts.mts`, mapped to admonition variants
 */
const ALERT_VARIANTS = {
  note: "info",
  tip: "success",
  important: "info",
  warning: "warning",
  caution: "danger",
} satisfies Record<string, AdmonitionVariant>;

type BlockquoteAlert = keyof typeof ALERT_VARIANTS;

/**
 * builds the component for one heading level
 *
 * the `id` comes from `src/lib/mdx/remark-heading-ids.mts`, and is what the
 * table of contents and the command palette link to — when a heading has one,
 * a `#` anchor is rendered in the margin beside it (revealed on hover)
 */
const heading = (
  as: `h${1 | 2 | 3 | 4 | 5 | 6}`,
  variant: TypographyVariant,
) => {
  const Heading = ({ id, children }: React.ComponentProps<"h1">) => (
    <Typography as={as} id={id} variant={variant}>
      {id && (
        <a
          className="heading-anchor"
          href={`#${id}`}
          aria-label="Permalink to this section"
        >
          #
        </a>
      )}
      {children}
    </Typography>
  );

  Heading.displayName = `Mdx(${as})`;

  return Heading;
};

const components = {
  h1: heading("h1", "heading-2xl"),
  h2: heading("h2", "heading-xl"),
  h3: heading("h3", "heading-lg"),
  h4: heading("h4", "heading-md"),
  h5: heading("h5", "heading-sm"),
  h6: heading("h6", "heading-xs"),
  p: (props) => (
    <Typography as="p" variant="copy-md">
      {props.children}
    </Typography>
  ),
  strong: (props) => (
    <strong style={{ fontWeight: 500 }}>{props.children}</strong>
  ),
  a: (props) => (
    <Link
      className="underline decoration-from-font underline-offset-[calc(var(--base-font-size)_/_12)]"
      target={props.href.startsWith("http") ? "_blank" : undefined}
      rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
      href={props.href}
    >
      {props.children}
    </Link>
  ),
  code: (props) => <Code>{props.children}</Code>,
  /**
   * markdown tables are wide and the content column is not — wrapping the
   * table lets it scroll horizontally instead of blowing out the page
   */
  table: (props) => (
    <div className="table-scroll">
      <table>{props.children}</table>
    </div>
  ),
  /**
   * blockquote children arrive as phrasing content (see
   * `src/lib/mdx/rehype-blockquote-text-children.mts`), so they can be
   * forwarded as-is instead of being wrapped in a `Typography` per paragraph
   *
   * a blockquote written as a github alert (`> [!NOTE]`) also carries the
   * alert type, which picks the admonition's variant
   */
  blockquote: ({
    children,
    "data-alert": alert,
  }: React.ComponentProps<"blockquote"> & {
    "data-alert"?: BlockquoteAlert;
  }) => (
    <Admonition size="sm" variant={alert ? ALERT_VARIANTS[alert] : "secondary"}>
      {children}
    </Admonition>
  ),
  pre: async (props) => {
    const codeElement = props.children as React.ReactElement<{
      children?: string;
      className?: string;
    }>;
    const code = codeElement?.props?.children?.trim() ?? "";
    const lang = codeElement?.props?.className?.replace("language-", "");

    let resolvedLang: LanguageRegistration[] | "text" = "text";

    // check if language is included in bundled languages
    if (lang && lang in bundledLanguages) {
      // if it is, get the ES module directly and grab the `LanguageRegistration`
      // by using the default export
      resolvedLang = (await bundledLanguages[lang as BundledLanguage]())
        .default;
    }

    return (
      <CodeBlock lang={resolvedLang} copyOnHover>
        {code}
      </CodeBlock>
    );
  },
  img: ({ src, alt, width, height, ...props }) => (
    <Image
      src={src ?? ""}
      alt={alt ?? ""}
      /**
       * Note - markdown images (`![alt](src)`) can't declare dimensions, but
       * `next/image` requires width and height
       *
       * for now, falling back to `0` alongside `sizes` allows next/image to
       * render images, but they are full width
       *
       * we will need to think through a better implementation here later that supports
       * both:
       *
       * 1. relative image _files_ (either in inside `docs/assets/**` or similar)
       * 2. relative image _urls_
       */
      width={Number(width) || 0}
      height={Number(height) || 0}
      sizes="100vw"
      className="h-auto w-full max-w-full"
      {...props}
    />
  ),
  li: (props) => (
    <Typography as="li" variant="copy-md">
      {props.children}
    </Typography>
  ),

  // components below can be used in any `docs/**/*.mdx` file without an import
  Accordion,
  Admonition,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Chip,
  Choicebox,
  Code,
  CodeBlock,
  FormInputMessage,
  Combobox,
  Icon,
  IconButton,
  MaskedInput,
  Material,
  Modal,
  ProgressBar,
  RadioGroup,
  Range,
  Select,
  Sheet,
  ShowMore,
  Skeleton,
  Slider,
  Snippet,
  StatusIndicator,
  Switch,
  Tabs,
  Tag,
  TextButton,
  TextInput,
  TextArea,
  ThemeSwitcher,
  Toggle,
  Tooltip,
  Typography,

  // docs-only components
  ColorChip,

  // icons will need to be added here too if we want to use them directly
  Add,
  ArrowRight,
  CaretDown,
  Checkmark,
  Close,
  Download,
  Gear,
  Globe,
  Grid,
  List,
  Lock,
  Info,
  Search,
  Tenstorrent,

  // demos
  CheckboxDemo,
  ChipDemo,
  ComboboxDemo,
  IconsDemo,
  MaskedInputDemo,
  MenuDemo,
  ProgressBarDemo,
  RangeDemo,
  SelectDemo,
  ShowMoreDemo,
  SliderDemo,
  SplitButtonDemo,
  SwitchDemo,
  ToastDemo,
  ToggleDemo,
  TooltipDemo,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
