/**
 * components available to every MD/MDX file in the `docs/` folder
 *
 * NOTE: components needing non-serializable props (event handlers, refs, state)
 * can NOT be used in `docs/` directly since documents are rendered from a server
 * component - those are written as ```tsx demo``` code blocks instead, which
 * `src/lib/mdx/remark-tsx-demos.mts` extracts into client component modules
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
import { Typography } from "@tenstorrent/vesper/typography";

// docs-only components (not part of the design system)
import { ColorChip } from "@/components/color-chip";

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

const components = {
  h1: (props) => <Typography {...props} as="h1" variant="heading-2xl" />,
  h2: (props) => <Typography {...props} as="h2" variant="heading-xl" />,
  h3: (props) => <Typography {...props} as="h3" variant="heading-lg" />,
  h4: (props) => <Typography {...props} as="h4" variant="heading-md" />,
  h5: (props) => <Typography {...props} as="h5" variant="heading-sm" />,
  h6: (props) => <Typography {...props} as="h6" variant="heading-xs" />,
  p: (props) => <Typography {...props} as="p" variant="copy-md" />,
  strong: (props) => <strong {...props} style={{ fontWeight: 500 }} />,
  a: (props) => (
    <Link
      {...props}
      className="underline decoration-from-font underline-offset-[calc(1rem_/_12)]"
      target={props.href.startsWith("http") ? "_blank" : undefined}
      rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
      href={props.href}
    />
  ),
  code: (props) => <Code {...props} />,
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
  li: (props) => <Typography {...props} as="li" variant="copy-md" />,
  /**
   * `overflow` is ignored on `display: table`, so we wrap it in a scroll container
   * that keeps wide tables inside the content column instead of overflowing it
   */
  table: (props) => (
    <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
      <table {...props} />
    </div>
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

  // other components
  Link,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
