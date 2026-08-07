import { ThemeRegistration } from "@shikijs/core";

/**
 * Night Owl TextMate theme
 * https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/themes/night-owl.json
 *
 * Source colors are remapped to the closest Vesper dark mode palette tokens
 */
export const dark: ThemeRegistration = {
  colors: {
    "editor.background": "transparent",
    "editor.foreground": "var(--vesper-stone-800)",
  },
  name: "night-owl",
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
        background: "transparent",
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: ["string.quoted", "variable.other.readwrite.js"],
      settings: {
        foreground: "var(--vesper-amber-700)",
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
        foreground: "var(--vesper-sky-700)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "invalid.deprecated",
      settings: {
        background: "var(--vesper-red-500)",
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "meta.brace",
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "constant.language.boolean",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "object.comma",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "variable.parameter.function",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-mint-600)",
      },
    },
    {
      scope: "meta.property-list entity.name.tag.reference",
      settings: {
        foreground: "var(--vesper-teal-800)",
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
        foreground: "var(--vesper-yellow-900)",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "var(--vesper-yellow-900)",
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
        foreground: "var(--vesper-mint-600)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-mint-900)",
      },
    },
    {
      scope: ["variable.other.object.property"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-yellow-900)",
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
        foreground: "var(--vesper-green-700)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-stone-0)",
      },
    },
    {
      scope: "invalid.unimplemented",
      settings: {
        background: "var(--vesper-green-600)",
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "invalid.illegal",
      settings: {
        background: "var(--vesper-red-600)",
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "support.variable.property",
      settings: {
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-red-600)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "raw",
      settings: {
        foreground: "var(--vesper-mint-600)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-teal-800)",
      },
    },
    {
      scope: "variable.parameter.function.coffee",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "variable.other.readwrite.cs",
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-yellow-900)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: ["entity.name.function.preprocessor.cpp", "entity.scope.name.cpp"],
      settings: {
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: ["meta.preprocessor.macro.cpp"],
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-teal-800)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "meta.js punctuation.definition.js",
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.parameter.function.js",
      settings: {
        foreground: "var(--vesper-purple-600)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["variable.js", "variable.other.js"],
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "support.type.property-name.json",
      settings: {
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-mint-600)",
      },
    },
    {
      scope:
        "meta.structure.dictionary.json meta.structure.dictionary.value constant.language",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "variable.other.object.js",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: ["variable.other.ruby"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["entity.name.type.class.ruby"],
      settings: {
        foreground: "var(--vesper-amber-700)",
      },
    },
    {
      scope: "constant.language.symbol.hashkey.ruby",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "constant.language.symbol.ruby",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "entity.name.tag.less",
      settings: {
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-yellow-900)",
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
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--vesper-mint-600)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-red-600)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-mint-700)",
      },
    },
    {
      scope: ["keyword.other.unit.scss", "keyword.other.unit.sass"],
      settings: {
        foreground: "var(--vesper-yellow-900)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-mint-700)",
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
        foreground: "var(--vesper-stone-800)",
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
        "punctuation.definintion.string",
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

/**
 * Night Owl Light TextMate theme
 * https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/themes/night-owl-light.json
 *
 * Source colors are remapped to the closest Vesper light mode palette tokens:
 */
export const light: ThemeRegistration = {
  colors: {
    "editor.background": "transparent",
    "editor.foreground": "var(--vesper-stone-800)",
  },
  name: "night-owl-light",
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
        foreground: "var(--vesper-purple-200)",
      },
    },
    {
      scope: "markup.deleted.diff",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-red-300)",
      },
    },
    {
      scope: "markup.inserted.diff",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-stone-500)",
      },
    },
    {
      scope: "string",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["string.quoted", "variable.other.readwrite.js"],
      settings: {
        foreground: "var(--vesper-red-400)",
      },
    },
    {
      scope: "support.constant.math",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["constant.numeric", "constant.character.numeric"],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: [
        "constant.language",
        "punctuation.definition.constant",
        "variable.other.constant",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["constant.character", "constant.other"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "constant.character.escape",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: ["string.regexp", "string.regexp keyword.other"],
      settings: {
        foreground: "var(--vesper-sky-400)",
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
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["punctuation.accessor", "keyword"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "storage.type",
      settings: {
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "entity.other.inherited-class",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "entity.name.function",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: ["punctuation.definition.tag", "meta.tag"],
      settings: {
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "entity.name.tag.custom",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["support.function", "support.constant"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "support.constant.meta.property-value",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["support.type", "support.class"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "support.variable.dom",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "invalid",
      settings: {
        foreground: "var(--vesper-pink-400)",
      },
    },
    {
      scope: "invalid.deprecated",
      settings: {
        foreground: "var(--vesper-red-500)",
      },
    },
    {
      scope: "keyword.operator",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.operator.relational",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.operator.assignment",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.operator.arithmetic",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.operator.bitwise",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.operator.increment",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.operator.ternary",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "comment.line.double-slash",
      settings: {
        foreground: "var(--vesper-stone-500)",
      },
    },
    {
      scope: "object",
      settings: {
        foreground: "var(--vesper-teal-100)",
      },
    },
    {
      scope: "constant.language.null",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "meta.brace",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "meta.delimiter.period",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "punctuation.definition.string",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "punctuation.definition.string.begin.markdown",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "constant.language.boolean",
      settings: {
        foreground: "var(--vesper-red-600)",
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
        foreground: "var(--vesper-teal-600)",
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
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "meta.property-list entity.name.tag.reference",
      settings: {
        foreground: "var(--vesper-teal-300)",
      },
    },
    {
      scope: "constant.other.color.rgb-value punctuation.definition.constant",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "constant.other.color",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "meta.selector",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "entity.other.attribute-name.id",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "meta.property-name",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["entity.name.tag.doctype", "meta.tag.sgml.doctype"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "punctuation.definition.parameters",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "keyword.control.operator",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.operator.logical",
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["variable.other.object.property"],
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-stone-900)",
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
        foreground: "var(--vesper-sky-500)",
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
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "support.function",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "invalid.broken",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "invalid.unimplemented",
      settings: {
        foreground: "var(--vesper-green-300)",
      },
    },
    {
      scope: "invalid.illegal",
      settings: {
        foreground: "var(--vesper-red-400)",
      },
    },
    {
      scope: "variable.language",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "support.variable.property",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "variable.function",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "variable.interpolation",
      settings: {
        foreground: "var(--vesper-red-400)",
      },
    },
    {
      scope: "meta.function-call",
      settings: {
        foreground: "var(--vesper-sky-500)",
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
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-stone-900)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "italic",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "quote",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "raw",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-teal-300)",
      },
    },
    {
      scope: "variable.parameter.function.coffee",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.assignment.coffee",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "variable.other.readwrite.cs",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["entity.name.type.class.cs", "storage.type.cs"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "entity.name.type.namespace.cs",
      settings: {
        foreground: "var(--vesper-teal-600)",
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
        foreground: "var(--vesper-red-400)",
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
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: [
        "meta.attribute-selector.css entity.other.attribute-name.attribute",
        "variable.other.readwrite.js",
      ],
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: [
        "source.elixir support.type.elixir",
        "source.elixir meta.module.elixir entity.name.class.elixir",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "source.elixir entity.name.function",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: [
        "source.elixir constant.other.symbol.elixir",
        "source.elixir constant.other.keywords.elixir",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "source.elixir punctuation.definition.string",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: [
        "source.elixir variable.other.readwrite.module.elixir",
        "source.elixir variable.other.readwrite.module.elixir punctuation.definition.variable.elixir",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "source.elixir .punctuation.binary.elixir",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "constant.keyword.clojure",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "source.go meta.function-call.go",
      settings: {
        foreground: "var(--vesper-teal-600)",
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
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: [
        "source.go constant.language.go",
        "source.go constant.other.placeholder.go",
      ],
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: ["entity.name.function.preprocessor.cpp", "entity.scope.name.cpp"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["meta.namespace-block.cpp"],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: ["storage.type.language.primitive.cpp"],
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: ["meta.preprocessor.macro.cpp"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["variable.parameter"],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: ["variable.other.readwrite.powershell"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["support.function.powershell"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "entity.other.attribute-name.id.html",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "punctuation.definition.tag.html",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "meta.tag.sgml.doctype.html",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "meta.class entity.name.type.class.js",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "meta.method.declaration storage.type.js",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "terminator.js",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "meta.js punctuation.definition.js",
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-teal-300)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.parameter.function.js",
      settings: {
        foreground: "var(--vesper-purple-400)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["variable.js", "variable.other.js"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["entity.name.type.js", "entity.name.type.module.js"],
      settings: {
        fontStyle: "",
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "support.class.js",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "support.type.property-name.json",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "support.constant.json",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "meta.structure.dictionary.value.json string.quoted.double",
      settings: {
        foreground: "var(--vesper-purple-300)",
      },
    },
    {
      scope: "string.quoted.double.json punctuation.definition.string.json",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope:
        "meta.structure.dictionary.json meta.structure.dictionary.value constant.language",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: "variable.other.object.js",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["variable.other.ruby"],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["entity.name.type.class.ruby"],
      settings: {
        foreground: "var(--vesper-red-400)",
      },
    },
    {
      scope: "constant.language.symbol.hashkey.ruby",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "constant.language.symbol.ruby",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "entity.name.tag.less",
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "keyword.other.unit.css",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope:
        "meta.attribute-selector.less entity.other.attribute-name.attribute",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: [
        "markup.heading",
        "markup.heading.setext.1",
        "markup.heading.setext.2",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "markup.quote",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-stone-600)",
      },
    },
    {
      scope: "markup.inline.raw",
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["markup.underline.link", "markup.underline.link.image"],
      settings: {
        foreground: "var(--vesper-pink-300)",
      },
    },
    {
      scope: [
        "string.other.link.title.markdown",
        "string.other.link.description.markdown",
      ],
      settings: {
        foreground: "var(--vesper-stone-800)",
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
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["punctuation.definition.metadata.markdown"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["beginning.punctuation.definition.list.markdown"],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "markup.inline.raw.string.markdown",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["variable.other.php", "variable.other.property.php"],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "support.class.php",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: "meta.function-call.php punctuation",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "variable.other.global.php",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "variable.other.global.php punctuation.definition.variable",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "constant.language.python",
      settings: {
        foreground: "var(--vesper-red-600)",
      },
    },
    {
      scope: [
        "variable.parameter.function.python",
        "meta.function-call.arguments.python",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: ["meta.function-call.python", "meta.function-call.generic.python"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: "punctuation.python",
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "entity.name.function.decorator.python",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "source.python variable.language.special",
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: "keyword.control",
      settings: {
        fontStyle: "italic",
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: [
        "source.css.scss meta.at-rule variable",
        "source.css.sass meta.at-rule variable",
      ],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: [
        "meta.attribute-selector.scss entity.other.attribute-name.attribute",
        "meta.attribute-selector.sass entity.other.attribute-name.attribute",
      ],
      settings: {
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: ["entity.name.tag.scss", "entity.name.tag.sass"],
      settings: {
        foreground: "var(--vesper-teal-600)",
      },
    },
    {
      scope: ["keyword.other.unit.scss", "keyword.other.unit.sass"],
      settings: {
        foreground: "var(--vesper-purple-500)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: ["entity.name.type.ts", "entity.name.type.tsx"],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: ["support.class.node.ts", "support.class.node.tsx"],
      settings: {
        foreground: "var(--vesper-sky-500)",
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
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: [
        "meta.decorator punctuation.decorator.ts",
        "meta.decorator punctuation.decorator.tsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "meta.tag.js meta.jsx.children.tsx",
      settings: {
        foreground: "var(--vesper-sky-500)",
      },
    },
    {
      scope: "entity.name.tag.yaml",
      settings: {
        foreground: "var(--vesper-stone-900)",
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
        foreground: "var(--vesper-pink-600)",
      },
    },
    {
      scope: [
        "meta.jsx.children",
        "meta.jsx.children.js",
        "meta.jsx.children.tsx",
      ],
      settings: {
        foreground: "var(--vesper-stone-800)",
      },
    },
    {
      scope: "meta.class entity.name.type.class.tsx",
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: ["entity.name.type.tsx", "entity.name.type.module.tsx"],
      settings: {
        foreground: "var(--vesper-stone-900)",
      },
    },
    {
      scope: [
        "meta.class.ts meta.var.expr.ts storage.type.ts",
        "meta.class.tsx meta.var.expr.tsx storage.type.tsx",
      ],
      settings: {
        foreground: "var(--vesper-purple-500)",
      },
    },
    {
      scope: [
        "meta.method.declaration storage.type.ts",
        "meta.method.declaration storage.type.tsx",
      ],
      settings: {
        foreground: "var(--vesper-sky-500)",
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
        "punctuation.definintion.string",
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
  type: "light",
};
