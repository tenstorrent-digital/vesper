import { MaskitoOptions, maskitoTransform } from "@maskito/core";
import { describe, expect, test } from "vitest";

import { getMaskitoOptions } from "./getMaskitoOptions";

/** The permissive mask returned when no masking should be applied */
const NO_MASK: MaskitoOptions = { mask: /./ };

describe("getMaskitoOptions", () => {
  describe("no mask", () => {
    test("returns a permissive mask when mask is undefined", () => {
      expect(getMaskitoOptions(undefined)).toEqual(NO_MASK);
    });

    test("returns a permissive mask when mask is an empty string", () => {
      expect(getMaskitoOptions("")).toEqual(NO_MASK);
    });

    test.each([
      { name: "undefined", mask: undefined },
      { name: "string", mask: "___-___" },
      { name: "format/replace object", mask: { format: "___", replace: "_" } },
      { name: "MaskitoOptions", mask: { mask: [/\d/, /\d/] } },
    ])("returns a permissive mask when multiline (mask: $name)", ({ mask }) => {
      expect(getMaskitoOptions(mask, true)).toEqual(NO_MASK);
    });

    test("applies no masking to arbitrary values", () => {
      expect(maskitoTransform("a1!-Z", getMaskitoOptions(undefined))).toBe(
        "a1!-Z",
      );
    });
  });

  describe("string mask", () => {
    test("converts underscores into wildcard expressions", () => {
      expect(getMaskitoOptions("__-__")).toEqual({
        mask: [/./, /./, "-", /./, /./],
      });
    });

    test("preserves every non-underscore character as a literal", () => {
      expect(getMaskitoOptions("+1 (__)")).toEqual({
        mask: ["+", "1", " ", "(", /./, /./, ")"],
      });
    });

    test("returns only literals when there are no underscores", () => {
      expect(getMaskitoOptions("abc")).toEqual({ mask: ["a", "b", "c"] });
    });

    test("masks a value with the derived mask", () => {
      expect(maskitoTransform("123456", getMaskitoOptions("__-__"))).toBe(
        "12-34",
      );
    });
  });

  describe("MaskitoOptions mask", () => {
    test("returns the options unchanged", () => {
      const optionsA: MaskitoOptions = {
        mask: [/\d/, /\d/, ":", /\d/, /\d/],
        preprocessors: [],
        postprocessors: [],
      };
      expect(getMaskitoOptions(optionsA)).toBe(optionsA);

      const optionsB: MaskitoOptions = { mask: /^\d+$/ };
      expect(getMaskitoOptions(optionsB)).toBe(optionsB);

      const optionsC: MaskitoOptions = { mask: () => [/\d/, /\d/] };
      expect(getMaskitoOptions(optionsC)).toBe(optionsC);
    });
  });

  describe("format with string replace", () => {
    test("converts the replace character into wildcard expressions", () => {
      expect(getMaskitoOptions({ format: "##/##", replace: "#" })).toEqual({
        mask: [/./, /./, "/", /./, /./],
      });
    });

    test("treats underscores as literals when replace is not an underscore", () => {
      expect(getMaskitoOptions({ format: "#_#", replace: "#" })).toEqual({
        mask: [/./, "_", /./],
      });
    });

    test("returns only literals when the replace character is absent", () => {
      expect(getMaskitoOptions({ format: "12/34", replace: "#" })).toEqual({
        mask: ["1", "2", "/", "3", "4"],
      });
    });

    test("returns only literals when replace is longer than one character", () => {
      expect(getMaskitoOptions({ format: "##", replace: "##" })).toEqual({
        mask: ["#", "#"],
      });
    });

    test("masks a value with the derived mask", () => {
      const options = getMaskitoOptions({ format: "##/##", replace: "#" });

      expect(maskitoTransform("1234", options)).toBe("12/34");
    });
  });

  describe("format with RegExp replace", () => {
    test("converts underscores into the provided expression", () => {
      expect(getMaskitoOptions({ format: "__-__", replace: /\d/ })).toEqual({
        mask: [/\d/, /\d/, "-", /\d/, /\d/],
      });
    });

    test("reuses the same expression instance for every underscore", () => {
      const replace = /\d/;
      const { mask } = getMaskitoOptions({ format: "__", replace });

      expect(mask).toEqual([replace, replace]);
      (mask as RegExp[]).forEach((entry) => expect(entry).toBe(replace));
    });

    test("returns only literals when there are no underscores", () => {
      expect(getMaskitoOptions({ format: "ab", replace: /\d/ })).toEqual({
        mask: ["a", "b"],
      });
    });

    test("rejects characters that do not match the expression", () => {
      const options = getMaskitoOptions({ format: "__-__", replace: /\d/ });

      expect(maskitoTransform("12ab", options)).toBe("12");
      expect(maskitoTransform("1234", options)).toBe("12-34");
    });
  });

  describe("format with replace map", () => {
    test("maps each format character to its expression", () => {
      expect(
        getMaskitoOptions({
          format: "AA-00",
          replace: { A: /[a-z]/i, 0: /\d/ },
        }),
      ).toEqual({ mask: [/[a-z]/i, /[a-z]/i, "-", /\d/, /\d/] });
    });

    test("keeps format characters without an entry as literals", () => {
      expect(
        getMaskitoOptions({ format: "0_x", replace: { 0: /\d/ } }),
      ).toEqual({ mask: [/\d/, "_", "x"] });
    });

    test("returns only literals when the map is empty", () => {
      expect(getMaskitoOptions({ format: "ab", replace: {} })).toEqual({
        mask: ["a", "b"],
      });
    });

    test("masks a value with the derived mask", () => {
      const options = getMaskitoOptions({
        format: "AA-00",
        replace: { A: /[a-z]/i, 0: /\d/ },
      });

      expect(maskitoTransform("ab12", options)).toBe("ab-12");
      expect(maskitoTransform("12", options)).toBe("");
    });
  });

  describe("empty format", () => {
    test.each([
      { name: "string replace", mask: { format: "", replace: "#" } },
      { name: "RegExp replace", mask: { format: "", replace: /\d/ } },
      { name: "map replace", mask: { format: "", replace: { "#": /\d/ } } },
    ])("returns an empty mask for an empty format ($name)", ({ mask }) => {
      expect(getMaskitoOptions(mask)).toEqual({ mask: [] });
    });
  });
});
