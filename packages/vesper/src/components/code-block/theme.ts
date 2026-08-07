import { type ThemeRegistration } from "@shikijs/core";

/**
 * Night Owl, retinted with Vesper's dark mode color tokens.
 *
 * Every color in the original TextMate theme was replaced with its closest
 * perceptual match (OKLab distance) from the dark palette in
 * `src/styles/colors.css`. Translucent colors were composited over
 * `--vesper-stone-0` before matching, except near-neutral ones, which map to
 * the `--vesper-alpha-*` ramps.
 *
 * Rough mapping of the main syntax colors:
 *
 * Foreground/text:     sky-900
 * Comments:            stone-600
 * Keywords/storage:    purple-700
 * Strings:             amber-800
 * Numbers/escapes:     red-700
 * Functions/constants: sky-800
 * Variables/types:     yellow-800
 * Operators/tags:      mint-800
 * Classes:             amber-800
 * Null/boolean:        red-700
 * Invalid:             pink-600 / red-500
 *
 * `editor.background` is intentionally transparent so the code block surface
 * styling in `code-block.css` shows through. The scope-less `tokenColors` entry
 * matches it, since shiki prefers that entry over `editor.background` when
 * resolving the `<pre>` background.
 *
 * The original theme left twelve workbench colors as `null`. VS Code treats a
 * `null` color as "unset": the key is dropped while parsing the theme, so
 * `ColorThemeData.getColor` falls through to the color's registered default for
 * the current theme type (dark, here). Those defaults are inlined below as
 * tokens rather than left null:
 *
 * editor.findRangeHighlightBackground  #3a3d4166 → alpha-contrast-400
 * editor.lineHighlightBorder           #282828   → stone-200
 * editorLink.activeForeground          #4E94CE   → sky-700
 * editorWhitespace.foreground          #e3e4e229 → alpha-stone-300
 * editorError.border                   (none in dark)  → transparent
 * editorWarning.border                 (none in dark)  → transparent
 * merge.border                         (none in dark)  → transparent
 * merge.currentContentBackground       40% of merge.currentHeaderBackground
 * merge.incomingContentBackground      40% of merge.incomingHeaderBackground
 * statusBar.debuggingForeground        = statusBar.foreground
 * statusBar.noFolderForeground         = statusBar.foreground
 * titleBar.inactiveForeground          60% of titleBar.activeForeground
 *
 * @see https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/themes/night-owl.json
 */
export const theme: ThemeRegistration = {
  colors: {
    "activityBar.background": "var(--vesper-sky-50)",
    "activityBar.border": "var(--vesper-sky-50)",
    "activityBar.dropBackground": "var(--vesper-stone-600)",
    "activityBar.foreground": "var(--vesper-stone-600)",
    "activityBarBadge.background": "var(--vesper-stone-500)",
    "activityBarBadge.foreground": "var(--vesper-stone-0)",
    "badge.background": "var(--vesper-stone-600)",
    "badge.foreground": "var(--vesper-stone-0)",
    "breadcrumb.activeSelectionForeground": "var(--vesper-stone-0)",
    "breadcrumb.focusForeground": "var(--vesper-stone-0)",
    "breadcrumb.foreground": "var(--vesper-purple-700)",
    "breadcrumbPicker.background": "var(--vesper-sky-0)",
    "button.background": "var(--vesper-purple-500)",
    "button.foreground": "var(--vesper-alpha-contrast-800)",
    "button.hoverBackground": "var(--vesper-purple-600)",
    contrastBorder: "var(--vesper-teal-100)",
    "debugExceptionWidget.background": "var(--vesper-sky-50)",
    "debugExceptionWidget.border": "var(--vesper-stone-600)",
    "debugToolBar.background": "var(--vesper-sky-50)",
    "diffEditor.insertedTextBackground": "var(--vesper-stone-200)",
    "diffEditor.removedTextBackground": "var(--vesper-red-100)",
    "dropdown.background": "var(--vesper-sky-50)",
    "dropdown.border": "var(--vesper-stone-600)",
    "dropdown.foreground": "var(--vesper-alpha-contrast-800)",
    "editor.background": "var(--vesper-transparent)",
    "editor.findMatchBackground": "var(--vesper-stone-400)",
    "editor.findMatchHighlightBackground": "var(--vesper-teal-200)",
    "editor.findRangeHighlightBackground": "var(--vesper-alpha-contrast-400)",
    "editor.foreground": "var(--vesper-sky-900)",
    "editor.hoverHighlightBackground": "var(--vesper-purple-300)",
    "editor.inactiveSelectionBackground": "var(--vesper-purple-300)",
    "editor.lineHighlightBackground": "var(--vesper-stone-100)",
    "editor.lineHighlightBorder": "var(--vesper-stone-200)",
    "editor.rangeHighlightBackground": "var(--vesper-purple-300)",
    "editor.selectionBackground": "var(--vesper-teal-200)",
    "editor.selectionHighlightBackground": "var(--vesper-stone-400)",
    "editor.wordHighlightBackground": "var(--vesper-stone-300)",
    "editor.wordHighlightStrongBackground": "var(--vesper-stone-300)",
    "editorCodeLens.foreground": "var(--vesper-sky-400)",
    "editorCursor.foreground": "var(--vesper-teal-600)",
    "editorError.border": "var(--vesper-transparent)",
    "editorError.foreground": "var(--vesper-red-600)",
    "editorGroup.border": "var(--vesper-sky-50)",
    "editorGroup.dropBackground": "var(--vesper-purple-300)",
    "editorGroup.emptyBackground": "var(--vesper-sky-50)",
    "editorGroupHeader.noTabsBackground": "var(--vesper-sky-50)",
    "editorGroupHeader.tabsBackground": "var(--vesper-sky-50)",
    "editorGroupHeader.tabsBorder": "var(--vesper-teal-100)",
    "editorGutter.addedBackground": "var(--vesper-green-600)",
    "editorGutter.background": "var(--vesper-sky-50)",
    "editorGutter.deletedBackground": "var(--vesper-red-600)",
    "editorGutter.modifiedBackground": "var(--vesper-yellow-600)",
    "editorHoverWidget.background": "var(--vesper-sky-50)",
    "editorHoverWidget.border": "var(--vesper-stone-600)",
    "editorIndentGuide.activeBackground": "var(--vesper-stone-700)",
    "editorIndentGuide.background": "var(--vesper-teal-200)",
    "editorInlayHint.background": "var(--vesper-transparent)",
    "editorInlayHint.foreground": "var(--vesper-stone-700)",
    "editorLineNumber.activeForeground": "var(--vesper-sky-900)",
    "editorLineNumber.foreground": "var(--vesper-stone-500)",
    "editorLink.activeForeground": "var(--vesper-sky-700)",
    "editorMarkerNavigation.background": "var(--vesper-sky-100)",
    "editorMarkerNavigationError.background": "var(--vesper-red-600)",
    "editorMarkerNavigationWarning.background": "var(--vesper-yellow-700)",
    "editorOverviewRuler.commonContentForeground": "var(--vesper-purple-600)",
    "editorOverviewRuler.currentContentForeground": "var(--vesper-purple-600)",
    "editorOverviewRuler.incomingContentForeground": "var(--vesper-purple-600)",
    "editorRuler.foreground": "var(--vesper-teal-200)",
    "editorSuggestWidget.background": "var(--vesper-stone-300)",
    "editorSuggestWidget.border": "var(--vesper-stone-300)",
    "editorSuggestWidget.foreground": "var(--vesper-sky-900)",
    "editorSuggestWidget.highlightForeground": "var(--vesper-stone-0)",
    "editorSuggestWidget.selectedBackground": "var(--vesper-stone-600)",
    "editorWarning.border": "var(--vesper-transparent)",
    "editorWarning.foreground": "var(--vesper-yellow-500)",
    "editorWhitespace.foreground": "var(--vesper-alpha-stone-300)",
    "editorWidget.background": "var(--vesper-sky-0)",
    "editorWidget.border": "var(--vesper-stone-600)",
    errorForeground: "var(--vesper-red-600)",
    "extensionButton.prominentBackground": "var(--vesper-purple-500)",
    "extensionButton.prominentForeground": "var(--vesper-alpha-contrast-800)",
    "extensionButton.prominentHoverBackground": "var(--vesper-purple-600)",
    focusBorder: "var(--vesper-teal-100)",
    foreground: "var(--vesper-sky-900)",
    "gitDecoration.conflictingResourceForeground": "var(--vesper-amber-800)",
    "gitDecoration.deletedResourceForeground": "var(--vesper-red-400)",
    "gitDecoration.ignoredResourceForeground": "var(--vesper-teal-400)",
    "gitDecoration.modifiedResourceForeground": "var(--vesper-purple-800)",
    "gitDecoration.untrackedResourceForeground": "var(--vesper-yellow-800)",
    "input.background": "var(--vesper-sky-100)",
    "input.border": "var(--vesper-stone-600)",
    "input.foreground": "var(--vesper-alpha-contrast-800)",
    "input.placeholderForeground": "var(--vesper-stone-600)",
    "inputOption.activeBorder": "var(--vesper-alpha-contrast-800)",
    "inputValidation.errorBackground": "var(--vesper-red-400)",
    "inputValidation.errorBorder": "var(--vesper-red-600)",
    "inputValidation.infoBackground": "var(--vesper-sky-300)",
    "inputValidation.infoBorder": "var(--vesper-sky-800)",
    "inputValidation.warningBackground": "var(--vesper-yellow-300)",
    "inputValidation.warningBorder": "var(--vesper-yellow-700)",
    "list.activeSelectionBackground": "var(--vesper-teal-200)",
    "list.activeSelectionForeground": "var(--vesper-stone-0)",
    "list.dropBackground": "var(--vesper-sky-50)",
    "list.focusBackground": "var(--vesper-sky-0)",
    "list.focusForeground": "var(--vesper-stone-0)",
    "list.highlightForeground": "var(--vesper-stone-0)",
    "list.hoverBackground": "var(--vesper-sky-50)",
    "list.hoverForeground": "var(--vesper-stone-0)",
    "list.inactiveSelectionBackground": "var(--vesper-sky-100)",
    "list.inactiveSelectionForeground": "var(--vesper-stone-600)",
    "list.invalidItemForeground": "var(--vesper-purple-600)",
    "merge.border": "var(--vesper-transparent)",
    "merge.currentContentBackground": "var(--vesper-stone-300)",
    "merge.currentHeaderBackground": "var(--vesper-stone-600)",
    "merge.incomingContentBackground": "var(--vesper-sky-50)",
    "merge.incomingHeaderBackground": "var(--vesper-purple-300)",
    "meta.objectliteral.js": "var(--vesper-sky-800)",
    "notificationCenter.border": "var(--vesper-teal-100)",
    "notificationLink.foreground": "var(--vesper-teal-700)",
    "notificationToast.border": "var(--vesper-teal-100)",
    "notifications.background": "var(--vesper-sky-0)",
    "notifications.border": "var(--vesper-teal-100)",
    "notifications.foreground": "var(--vesper-alpha-contrast-800)",
    "panel.background": "var(--vesper-sky-50)",
    "panel.border": "var(--vesper-stone-600)",
    "panelTitle.activeBorder": "var(--vesper-stone-600)",
    "panelTitle.activeForeground": "var(--vesper-alpha-contrast-800)",
    "panelTitle.inactiveForeground": "var(--vesper-alpha-contrast-500)",
    "peekView.border": "var(--vesper-stone-600)",
    "peekViewEditor.background": "var(--vesper-sky-50)",
    "peekViewEditor.matchHighlightBackground": "var(--vesper-purple-300)",
    "peekViewResult.background": "var(--vesper-sky-50)",
    "peekViewResult.fileForeground": "var(--vesper-stone-600)",
    "peekViewResult.lineForeground": "var(--vesper-stone-600)",
    "peekViewResult.matchHighlightBackground":
      "var(--vesper-alpha-contrast-800)",
    "peekViewResult.selectionBackground": "var(--vesper-purple-300)",
    "peekViewResult.selectionForeground": "var(--vesper-stone-600)",
    "peekViewTitle.background": "var(--vesper-sky-50)",
    "peekViewTitleDescription.foreground": "var(--vesper-purple-600)",
    "peekViewTitleLabel.foreground": "var(--vesper-stone-600)",
    "pickerGroup.border": "var(--vesper-sky-50)",
    "pickerGroup.foreground": "var(--vesper-purple-800)",
    "progress.background": "var(--vesper-purple-600)",
    "punctuation.definition.generic.begin.html": "var(--vesper-red-600)",
    "scrollbar.shadow": "var(--vesper-sky-0)",
    "scrollbarSlider.activeBackground": "var(--vesper-sky-200)",
    "scrollbarSlider.background": "var(--vesper-sky-200)",
    "scrollbarSlider.hoverBackground": "var(--vesper-sky-200)",
    "selection.background": "var(--vesper-sky-500)",
    "sideBar.background": "var(--vesper-sky-50)",
    "sideBar.border": "var(--vesper-sky-50)",
    "sideBar.foreground": "var(--vesper-stone-700)",
    "sideBarSectionHeader.background": "var(--vesper-sky-50)",
    "sideBarSectionHeader.foreground": "var(--vesper-stone-600)",
    "sideBarTitle.foreground": "var(--vesper-stone-600)",
    "source.elm": "var(--vesper-stone-600)",
    "statusBar.background": "var(--vesper-sky-50)",
    "statusBar.border": "var(--vesper-teal-100)",
    "statusBar.debuggingBackground": "var(--vesper-stone-100)",
    "statusBar.debuggingBorder": "var(--vesper-teal-50)",
    "statusBar.debuggingForeground": "var(--vesper-stone-600)",
    "statusBar.foreground": "var(--vesper-stone-600)",
    "statusBar.noFolderBackground": "var(--vesper-sky-50)",
    "statusBar.noFolderBorder": "var(--vesper-teal-100)",
    "statusBar.noFolderForeground": "var(--vesper-stone-600)",
    "statusBarItem.activeBackground": "var(--vesper-stone-100)",
    "statusBarItem.hoverBackground": "var(--vesper-stone-100)",
    "statusBarItem.prominentBackground": "var(--vesper-stone-100)",
    "statusBarItem.prominentHoverBackground": "var(--vesper-stone-100)",
    "string.quoted.single.js": "var(--vesper-stone-0)",
    "tab.activeBackground": "var(--vesper-sky-100)",
    "tab.activeBorder": "var(--vesper-teal-100)",
    "tab.activeForeground": "var(--vesper-stone-800)",
    "tab.border": "var(--vesper-teal-100)",
    "tab.inactiveBackground": "var(--vesper-sky-0)",
    "tab.inactiveForeground": "var(--vesper-stone-600)",
    "tab.unfocusedActiveBorder": "var(--vesper-teal-100)",
    "tab.unfocusedActiveForeground": "var(--vesper-stone-600)",
    "tab.unfocusedInactiveForeground": "var(--vesper-stone-600)",
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
    "terminal.selectionBackground": "var(--vesper-teal-200)",
    "terminalCursor.background": "var(--vesper-sky-300)",
    "textCodeBlock.background": "var(--vesper-stone-400)",
    "titleBar.activeBackground": "var(--vesper-sky-50)",
    "titleBar.activeForeground": "var(--vesper-stone-0)",
    "titleBar.inactiveBackground": "var(--vesper-sky-0)",
    "titleBar.inactiveForeground": "var(--vesper-alpha-contrast-600)",
    "walkThrough.embeddedEditorBackground": "var(--vesper-sky-50)",
    "welcomePage.buttonBackground": "var(--vesper-sky-50)",
    "welcomePage.buttonHoverBackground": "var(--vesper-sky-50)",
    "widget.shadow": "var(--vesper-sky-50)",
  },
  displayName: "Vesper",
  name: "vesper",
  semanticHighlighting: false,
  tokenColors: [
    {
      scope: [
        "markup.changed",
        "meta.diff.header.git",
        "meta.diff.header.from-file",
        "meta.diff.header.to-file",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-800)",
      },
    },
    {
      scope: "markup.deleted.diff",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-red-400)",
      },
    },
    {
      scope: "markup.inserted.diff",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      settings: {
        background: "var(--vesper-transparent)",
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "string",
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: ["string.quoted", "variable.other.readwrite.js"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "support.constant.math",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: ["constant.numeric", "constant.character.numeric"],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "constant.language",
        "punctuation.definition.constant",
        "variable.other.constant",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: ["constant.character", "constant.other"],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["string.regexp", "string.regexp keyword.other"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "meta.function punctuation.separator.comma",
      settings: {
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "variable",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: ["punctuation.accessor", "keyword"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "storage",
        "meta.var.expr",
        "meta.class meta.method.declaration meta.var.expr storage.type.js",
        "storage.type.property.js",
        "storage.type.property.ts",
        "storage.type.property.tsx",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "storage.type.function.arrow.js",
      settings: {
        fontStyle: "",
      },
    },
    {
      scope: ["entity.name.class", "meta.class entity.name.type.class"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "entity.other.inherited-class",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "entity.name.function",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: ["punctuation.definition.tag", "meta.tag"],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: [
        "entity.name.tag",
        "meta.tag.other.html",
        "meta.tag.other.js",
        "meta.tag.other.tsx",
        "entity.name.tag.tsx",
        "entity.name.tag.js",
        "entity.name.tag",
        "meta.tag.js",
        "meta.tag.tsx",
        "meta.tag.html",
      ],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-mint-900)",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "entity.name.tag.custom",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["support.function", "support.constant"],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "support.constant.meta.property-value",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["support.type", "support.class"],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "support.variable.dom",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "invalid",
      settings: {
        background: "var(--vesper-pink-600)",
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "invalid.deprecated",
      settings: {
        background: "var(--vesper-red-500)",
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "keyword.operator.relational",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "keyword.operator.assignment",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "keyword.operator.arithmetic",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "keyword.operator.bitwise",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "keyword.operator.increment",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "keyword.operator.ternary",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "comment.line.double-slash",
      settings: {
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "object",
      settings: {
        foreground: "var(--vesper-teal-900)",
      },
    },
    {
      scope: "constant.language.null",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "meta.brace",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "meta.delimiter.period",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "punctuation.definition.string",
      settings: {
        foreground: "var(--vesper-green-900)",
      },
    },
    {
      scope: "punctuation.definition.string.begin.markdown",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "constant.language.boolean",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "object.comma",
      settings: {
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "variable.parameter.function",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: [
        "support.type.vendor.property-name",
        "support.constant.vendor.property-value",
        "support.type.property-name",
        "meta.property-list entity.name.tag",
      ],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: "meta.property-list entity.name.tag.reference",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "constant.other.color.rgb-value punctuation.definition.constant",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "constant.other.color",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "meta.selector",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "entity.other.attribute-name.id",
      settings: {
        foreground: "var(--vesper-yellow-700)",
      },
    },
    {
      scope: "meta.property-name",
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: ["entity.name.tag.doctype", "meta.tag.sgml.doctype"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "punctuation.definition.parameters",
      settings: {
        foreground: "var(--vesper-green-900)",
      },
    },
    {
      scope: "keyword.control.operator",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "keyword.operator.logical",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "variable.instance",
        "variable.other.instance",
        "variable.readwrite.instance",
        "variable.other.readwrite.instance",
        "variable.other.property",
      ],
      settings: {
        foreground: "var(--vesper-green-900)",
      },
    },
    {
      scope: ["variable.other.object.property"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: ["variable.other.object.js"],
      settings: {
        fontStyle: "",
      },
    },
    {
      scope: ["entity.name.function"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: ["variable.language.this.js"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: [
        "keyword.operator.comparison",
        "keyword.control.flow.js",
        "keyword.control.flow.ts",
        "keyword.control.flow.tsx",
        "keyword.control.ruby",
        "keyword.control.module.ruby",
        "keyword.control.class.ruby",
        "keyword.control.def.ruby",
        "keyword.control.loop.js",
        "keyword.control.loop.ts",
        "keyword.control.import.js",
        "keyword.control.import.ts",
        "keyword.control.import.tsx",
        "keyword.control.from.js",
        "keyword.control.from.ts",
        "keyword.control.from.tsx",
        "keyword.operator.instanceof.js",
        "keyword.operator.expression.instanceof.ts",
        "keyword.operator.expression.instanceof.tsx",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "keyword.control.conditional.js",
        "keyword.control.conditional.ts",
        "keyword.control.switch.js",
        "keyword.control.switch.ts",
      ],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "support.constant",
        "keyword.other.special-method",
        "keyword.other.new",
        "keyword.other.debugger",
        "keyword.control",
      ],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "support.function",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "invalid.broken",
      settings: {
        background: "var(--vesper-red-700)",
        foreground: "var(--vesper-sky-0)",
      },
    },
    {
      scope: "invalid.unimplemented",
      settings: {
        background: "var(--vesper-green-700)",
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "invalid.illegal",
      settings: {
        background: "var(--vesper-red-700)",
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "support.variable.property",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "variable.function",
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "variable.interpolation",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "meta.function-call",
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "punctuation.section.embedded",
      settings: {
        foreground: "var(--vesper-red-500)",
      },
    },
    {
      scope: [
        "punctuation.terminator.expression",
        "punctuation.definition.arguments",
        "punctuation.definition.array",
        "punctuation.section.array",
        "meta.array",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: [
        "punctuation.definition.list.begin",
        "punctuation.definition.list.end",
        "punctuation.separator.arguments",
        "punctuation.definition.list",
      ],
      settings: {
        foreground: "var(--vesper-green-900)",
      },
    },
    {
      scope: "string.template meta.template.expression",
      settings: {
        foreground: "var(--vesper-red-500)",
      },
    },
    {
      scope: "string.template punctuation.definition.string",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "italic",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "quote",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-600)",
      },
    },
    {
      scope: "raw",
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "variable.parameter.function.coffee",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "variable.other.readwrite.cs",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["entity.name.type.class.cs", "storage.type.cs"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "entity.name.type.namespace.cs",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "string.unquoted.preprocessor.message.cs",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: [
        "punctuation.separator.hash.cs",
        "keyword.preprocessor.region.cs",
        "keyword.preprocessor.endregion.cs",
      ],
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "variable.other.object.cs",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "entity.name.type.enum.cs",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "string.interpolated.single.dart",
        "string.interpolated.double.dart",
      ],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "support.class.dart",
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: [
        "entity.name.tag.css",
        "entity.name.tag.less",
        "entity.name.tag.custom.css",
        "support.constant.property-value.css",
      ],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "entity.name.tag.wildcard.css",
        "entity.name.tag.wildcard.less",
        "entity.name.tag.wildcard.scss",
        "entity.name.tag.wildcard.sass",
      ],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "meta.attribute-selector.css entity.other.attribute-name.attribute",
        "variable.other.readwrite.js",
      ],
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "source.elixir support.type.elixir",
        "source.elixir meta.module.elixir entity.name.class.elixir",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "source.elixir entity.name.function",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "source.elixir constant.other.symbol.elixir",
        "source.elixir constant.other.keywords.elixir",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "source.elixir punctuation.definition.string",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "source.elixir variable.other.readwrite.module.elixir",
        "source.elixir variable.other.readwrite.module.elixir punctuation.definition.variable.elixir",
      ],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "source.elixir .punctuation.binary.elixir",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "constant.keyword.clojure",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "source.go meta.function-call.go",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: [
        "source.go keyword.package.go",
        "source.go keyword.import.go",
        "source.go keyword.function.go",
        "source.go keyword.type.go",
        "source.go keyword.struct.go",
        "source.go keyword.interface.go",
        "source.go keyword.const.go",
        "source.go keyword.var.go",
        "source.go keyword.map.go",
        "source.go keyword.channel.go",
        "source.go keyword.control.go",
      ],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "source.go constant.language.go",
        "source.go constant.other.placeholder.go",
      ],
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["entity.name.function.preprocessor.cpp", "entity.scope.name.cpp"],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["meta.namespace-block.cpp"],
      settings: {
        foreground: "var(--vesper-amber-900)",
      },
    },
    {
      scope: ["storage.type.language.primitive.cpp"],
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["meta.preprocessor.macro.cpp"],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["variable.parameter"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: ["variable.other.readwrite.powershell"],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: ["support.function.powershell"],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "entity.other.attribute-name.id.html",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "punctuation.definition.tag.html",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "meta.tag.sgml.doctype.html",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "meta.class entity.name.type.class.js",
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "meta.method.declaration storage.type.js",
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "terminator.js",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "meta.js punctuation.definition.js",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: [
        "entity.name.type.instance.jsdoc",
        "entity.name.type.instance.phpdoc",
      ],
      settings: {
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: ["variable.other.jsdoc", "variable.other.phpdoc"],
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: [
        "variable.other.meta.import.js",
        "meta.import.js variable.other",
        "variable.other.meta.export.js",
        "meta.export.js variable.other",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "variable.parameter.function.js",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "variable.other.object.js",
        "variable.other.object.jsx",
        "variable.object.property.js",
        "variable.object.property.jsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["variable.js", "variable.other.js"],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["entity.name.type.js", "entity.name.type.module.js"],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "support.class.js",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "support.type.property-name.json",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "support.constant.json",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "meta.structure.dictionary.value.json string.quoted.double",
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "string.quoted.double.json punctuation.definition.string.json",
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope:
        "meta.structure.dictionary.json meta.structure.dictionary.value constant.language",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: "variable.other.object.js",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["variable.other.ruby"],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["entity.name.type.class.ruby"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "constant.language.symbol.hashkey.ruby",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "constant.language.symbol.ruby",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "entity.name.tag.less",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope:
        "meta.attribute-selector.less entity.other.attribute-name.attribute",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "markup.heading",
        "markup.heading.setext.1",
        "markup.heading.setext.2",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "markup.quote",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-600)",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--vesper-teal-700)",
      },
    },
    {
      scope: ["markup.underline.link", "markup.underline.link.image"],
      settings: {
        foreground: "var(--vesper-pink-700)",
      },
    },
    {
      scope: [
        "string.other.link.title.markdown",
        "string.other.link.description.markdown",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: [
        "punctuation.definition.string.markdown",
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.markdown",
        "meta.link.inline.markdown punctuation.definition.string",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: ["punctuation.definition.metadata.markdown"],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["beginning.punctuation.definition.list.markdown"],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "markup.inline.raw.string.markdown",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: ["variable.other.php", "variable.other.property.php"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "support.class.php",
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: "meta.function-call.php punctuation",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "variable.other.global.php",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "variable.other.global.php punctuation.definition.variable",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "constant.language.python",
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "variable.parameter.function.python",
        "meta.function-call.arguments.python",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: ["meta.function-call.python", "meta.function-call.generic.python"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "punctuation.python",
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "entity.name.function.decorator.python",
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: "source.python variable.language.special",
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "variable.scss",
        "variable.sass",
        "variable.parameter.url.scss",
        "variable.parameter.url.sass",
      ],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable",
      ],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: [
        "meta.attribute-selector.scss entity.other.attribute-name.attribute",
        "meta.attribute-selector.sass entity.other.attribute-name.attribute",
      ],
      settings: {
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: ["entity.name.tag.scss", "entity.name.tag.sass"],
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["keyword.other.unit.scss", "keyword.other.unit.sass"],
      settings: {
        foreground: "var(--vesper-yellow-800)",
      },
    },
    {
      scope: [
        "variable.other.readwrite.alias.ts",
        "variable.other.readwrite.alias.tsx",
        "variable.other.readwrite.ts",
        "variable.other.readwrite.tsx",
        "variable.other.object.ts",
        "variable.other.object.tsx",
        "variable.object.property.ts",
        "variable.object.property.tsx",
        "variable.other.ts",
        "variable.other.tsx",
        "variable.tsx",
        "variable.ts",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: ["entity.name.type.ts", "entity.name.type.tsx"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: ["support.class.node.ts", "support.class.node.tsx"],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: [
        "meta.type.parameters.ts entity.name.type",
        "meta.type.parameters.tsx entity.name.type",
      ],
      settings: {
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: [
        "meta.import.ts punctuation.definition.block",
        "meta.import.tsx punctuation.definition.block",
        "meta.export.ts punctuation.definition.block",
        "meta.export.tsx punctuation.definition.block",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: [
        "meta.decorator punctuation.decorator.ts",
        "meta.decorator punctuation.decorator.tsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "meta.tag.js meta.jsx.children.tsx",
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "entity.name.tag.yaml",
      settings: {
        foreground: "var(--vesper-mint-800)",
      },
    },
    {
      scope: ["variable.other.readwrite.js", "variable.parameter"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["support.class.component.js", "support.class.component.tsx"],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-red-700)",
      },
    },
    {
      scope: [
        "meta.jsx.children",
        "meta.jsx.children.js",
        "meta.jsx.children.tsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-900)",
      },
    },
    {
      scope: "meta.class entity.name.type.class.tsx",
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: ["entity.name.type.tsx", "entity.name.type.module.tsx"],
      settings: {
        foreground: "var(--vesper-amber-800)",
      },
    },
    {
      scope: [
        "meta.class.ts meta.var.expr.ts storage.type.ts",
        "meta.class.tsx meta.var.expr.tsx storage.type.tsx",
      ],
      settings: {
        foreground: "var(--vesper-purple-700)",
      },
    },
    {
      scope: [
        "meta.method.declaration storage.type.ts",
        "meta.method.declaration storage.type.tsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-800)",
      },
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: "var(--vesper-green-300)",
      },
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline",
      },
    },
    {
      scope: [
        "meta.property-list.css meta.property-value.css variable.other.less",
        "meta.property-list.scss variable.scss",
        "meta.property-list.sass variable.sass",
        "meta.brace",
        "keyword.operator.operator",
        "keyword.operator.or.regexp",
        "keyword.operator.expression.in",
        "keyword.operator.relational",
        "keyword.operator.assignment",
        "keyword.operator.comparison",
        "keyword.operator.type",
        "keyword.operator",
        "keyword",
        "punctuation.definition.string",
        "punctuation",
        "variable.other.readwrite.js",
        "storage.type",
        "source.css",
        "string.quoted",
      ],
      settings: {
        fontStyle: "",
      },
    },
  ],
  type: "dark",
};
