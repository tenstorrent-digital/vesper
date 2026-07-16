import { type ThemeRegistration } from "@shikijs/core";

/**
 * Vesper code block theme.
 *
 * Color mapping from TextMate Dark Plus → Vesper brand colors:
 *
 * Foreground/text:    stone-800  (#c2d6d3)
 * Comments:           green-600  (#39c692)
 * Keywords/storage:   teal-600   (#4eb3d4)
 * Control flow:       pink-700   (#f17ec5)
 * Strings:            amber-700  (#ffb057)
 * Numbers:            green-800  (#82edc6)
 * Functions:          yellow-800 (#ffd88a)
 * Types/classes:      mint-700   (#4ce5c9)
 * Variables:          teal-800   (#a3e0f5)
 * Constants:          teal-700   (#6cc7e5)
 * Regex:              red-700    (#f37359)
 * Escape chars:       yellow-700 (#ffc757)
 * Invalid:            red-600    (#e44e2f)
 * Punctuation:        stone-600  (#60807b)
 */
export const theme: ThemeRegistration = {
  colors: {
    "actionBar.toggledBackground": "var(--vesper-stone-300)",
    "activityBarBadge.background": "var(--vesper-sky-500)",
    "checkbox.border": "var(--vesper-stone-500)",
    "editor.background": "transparent",
    "editor.foreground": "var(--vesper-stone-800)",
    "editor.inactiveSelectionBackground": "var(--vesper-stone-300)",
    "editor.selectionHighlightBackground": "var(--vesper-alpha-stone-400)",
    "editorIndentGuide.activeBackground1": "var(--vesper-stone-500)",
    "editorIndentGuide.background1": "var(--vesper-stone-400)",
    "input.placeholderForeground": "var(--vesper-stone-600)",
    "list.activeSelectionIconForeground": "var(--vesper-static-white)",
    "list.dropBackground": "var(--vesper-stone-300)",
    "menu.background": "var(--vesper-stone-100)",
    "menu.border": "var(--vesper-stone-400)",
    "menu.foreground": "var(--vesper-stone-800)",
    "menu.selectionBackground": "var(--vesper-sky-500)",
    "menu.separatorBackground": "var(--vesper-stone-400)",
    "ports.iconRunningProcessForeground": "var(--vesper-green-500)",
    "sideBarSectionHeader.background": "var(--vesper-transparent)",
    "sideBarSectionHeader.border": "var(--vesper-alpha-contrast-200)",
    "sideBarTitle.foreground": "var(--vesper-stone-700)",
    "statusBarItem.remoteBackground": "var(--vesper-mint-400)",
    "statusBarItem.remoteForeground": "var(--vesper-static-white)",
    "tab.lastPinnedBorder": "var(--vesper-alpha-contrast-200)",
    "tab.selectedBackground": "var(--vesper-stone-50)",
    "tab.selectedForeground": "var(--vesper-alpha-contrast-700)",
    "terminal.inactiveSelectionBackground": "var(--vesper-stone-300)",
    "widget.border": "var(--vesper-stone-200)",
    "terminal.ansiBlack": "var(--vesper-stone-900)",
    "terminal.ansiRed": "var(--vesper-red-600)",
    "terminal.ansiGreen": "var(--vesper-green-600)",
    "terminal.ansiYellow": "var(--vesper-yellow-600)",
    "terminal.ansiBlue": "var(--vesper-sky-600)",
    "terminal.ansiMagenta": "var(--vesper-pink-600)",
    "terminal.ansiCyan": "var(--vesper-teal-600)",
    "terminal.ansiWhite": "var(--vesper-stone-100)",
    "terminal.ansiBrightBlack": "var(--vesper-stone-800)",
    "terminal.ansiBrightRed": "var(--vesper-red-400)",
    "terminal.ansiBrightGreen": "var(--vesper-green-400)",
    "terminal.ansiBrightYellow": "var(--vesper-yellow-400)",
    "terminal.ansiBrightBlue": "var(--vesper-sky-400)",
    "terminal.ansiBrightMagenta": "var(--vesper-pink-400)",
    "terminal.ansiBrightCyan": "var(--vesper-teal-400)",
    "terminal.ansiBrightWhite": "var(--vesper-stone-0)",
  },
  displayName: "Vesper",
  name: "vesper",
  semanticHighlighting: true,
  semanticTokenColors: {
    customLiteral: "var(--vesper-yellow-800)",
    newOperator: "var(--vesper-pink-700)",
    numberLiteral: "var(--vesper-green-800)",
    stringLiteral: "var(--vesper-amber-700)",
  },
  tokenColors: [
    {
      scope: [
        "meta.embedded",
        "source.groovy.embedded",
        "string meta.image.inline.markdown",
        "variable.legacy.builtin.python",
      ],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold",
      },
    },
    {
      scope: "header",
      settings: {
        foreground: "var(--vesper-sky-200)",
      },
    },
    {
      scope: "comment",
      settings: {
        foreground: "var(--vesper-green-600)",
      },
    },
    {
      scope: "constant.language",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: [
        "constant.numeric",
        "variable.other.enummember",
        "keyword.operator.plus.exponent",
        "keyword.operator.minus.exponent",
      ],
      settings: {
        foreground: "var(--vesper-green-800)",
      },
    },
    {
      scope: "constant.regexp",
      settings: {
        foreground: "var(--vesper-purple-600)",
      },
    },
    {
      scope: "entity.name.tag",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["entity.name.tag.css", "entity.name.tag.less"],
      settings: {
        foreground: "var(--vesper-yellow-700)",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: [
        "entity.other.attribute-name.class.css",
        "source.css entity.other.attribute-name.class",
        "entity.other.attribute-name.id.css",
        "entity.other.attribute-name.parent-selector.css",
        "entity.other.attribute-name.parent.less",
        "source.css entity.other.attribute-name.pseudo-class",
        "entity.other.attribute-name.pseudo-element.css",
        "source.css.less entity.other.attribute-name.id",
        "entity.other.attribute-name.scss",
      ],
      settings: {
        foreground: "var(--vesper-yellow-700)",
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
      },
    },
    {
      scope: "markup.strikethrough",
      settings: {
        fontStyle: "strikethrough",
      },
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: "var(--vesper-green-800)",
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "punctuation.definition.quote.begin.markdown",
      settings: {
        foreground: "var(--vesper-green-600)",
      },
    },
    {
      scope: "punctuation.definition.list.begin.markdown",
      settings: {
        foreground: "var(--vesper-sky-700)",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "punctuation.definition.tag",
      settings: {
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: ["meta.preprocessor", "entity.name.function.preprocessor"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: "var(--vesper-green-800)",
      },
    },
    {
      scope: "meta.structure.dictionary.key.python",
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: "meta.diff.header",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "storage",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["storage.modifier", "keyword.operator.noexcept"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["string", "meta.embedded.assembly"],
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "string.tag",
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "string.value",
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "punctuation.definition.template-expression.begin",
        "punctuation.definition.template-expression.end",
        "punctuation.section.embedded",
      ],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["meta.template.expression"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: [
        "support.type.vendored.property-name",
        "support.type.property-name",
        "source.css variable",
        "source.coffee.embedded",
      ],
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: "keyword",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: [
        "keyword.operator.new",
        "keyword.operator.expression",
        "keyword.operator.cast",
        "keyword.operator.sizeof",
        "keyword.operator.alignof",
        "keyword.operator.typeid",
        "keyword.operator.alignas",
        "keyword.operator.instanceof",
        "keyword.operator.logical.python",
        "keyword.operator.wordlike",
      ],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "var(--vesper-green-800)",
      },
    },
    {
      scope: [
        "punctuation.section.embedded.begin.php",
        "punctuation.section.embedded.end.php",
      ],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: "var(--vesper-green-800)",
      },
    },
    {
      scope: [
        "storage.modifier.import.java",
        "variable.language.wildcard.java",
        "storage.modifier.package.java",
      ],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "support.constant.handlebars",
        "source.powershell variable.other.member",
        "entity.name.operator.custom-literal",
      ],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "support.class",
        "support.type",
        "entity.name.type",
        "entity.name.namespace",
        "entity.other.attribute",
        "entity.name.scope-resolution",
        "entity.name.class",
        "storage.type.numeric.go",
        "storage.type.byte.go",
        "storage.type.boolean.go",
        "storage.type.string.go",
        "storage.type.uintptr.go",
        "storage.type.error.go",
        "storage.type.rune.go",
        "storage.type.cs",
        "storage.type.generic.cs",
        "storage.type.modifier.cs",
        "storage.type.variable.cs",
        "storage.type.annotation.java",
        "storage.type.generic.java",
        "storage.type.java",
        "storage.type.object.array.java",
        "storage.type.primitive.array.java",
        "storage.type.primitive.java",
        "storage.type.token.java",
        "storage.type.groovy",
        "storage.type.annotation.groovy",
        "storage.type.parameters.groovy",
        "storage.type.generic.groovy",
        "storage.type.object.array.groovy",
        "storage.type.primitive.array.groovy",
        "storage.type.primitive.groovy",
      ],
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: [
        "meta.type.cast.expr",
        "meta.type.new.expr",
        "support.constant.math",
        "support.constant.dom",
        "support.constant.json",
        "entity.other.inherited-class",
        "punctuation.separator.namespace.ruby",
      ],
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: [
        "keyword.control",
        "source.cpp keyword.operator.new",
        "keyword.operator.delete",
        "keyword.other.using",
        "keyword.other.directive.using",
        "keyword.other.operator",
        "entity.name.operator",
      ],
      settings: {
        foreground: "var(--vesper-pink-700)",
      },
    },
    {
      scope: [
        "variable",
        "meta.definition.variable.name",
        "support.variable",
        "entity.name.variable",
        "constant.other.placeholder",
      ],
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: ["variable.other.constant", "variable.other.enummember"],
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: ["meta.object-literal.key"],
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: [
        "support.constant.property-value",
        "support.constant.font-name",
        "support.constant.media-type",
        "support.constant.media",
        "constant.other.color.rgb-value",
        "constant.other.rgb-value",
        "support.constant.color",
      ],
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: [
        "punctuation.definition.group.regexp",
        "punctuation.definition.group.assertion.regexp",
        "punctuation.definition.character-class.regexp",
        "punctuation.character.set.begin.regexp",
        "punctuation.character.set.end.regexp",
        "keyword.operator.negation.regexp",
        "support.other.parenthesis.regexp",
      ],
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: [
        "constant.character.character-class.regexp",
        "constant.other.character-class.set.regexp",
        "constant.other.character-class.regexp",
        "constant.character.set.regexp",
      ],
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: {
        foreground: "var(--vesper-yellow-700)",
      },
    },
    {
      scope: ["constant.character", "constant.other.option"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "var(--vesper-yellow-700)",
      },
    },
    {
      scope: "entity.name.label",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
  ],
  type: "dark",
};
