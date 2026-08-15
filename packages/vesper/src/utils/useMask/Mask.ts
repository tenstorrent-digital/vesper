import filter from "./utils/filter";
import format from "./utils/format";
import formatToReplacementObject from "./utils/formatToReplacementObject";
import resolveSelection from "./utils/resolveSelection";
import unformat from "./utils/unformat";
import validate from "./utils/validate";
import { Input } from "./Input";
import { SyntheticChangeError } from "./SyntheticChangeError";
import type { MaskOptions, MaskPart, Overlap, Replacement } from "./types";
import * as utils from "./utils";

function normalizeOptions(options: MaskOptions) {
  return {
    mask: options.mask ?? "",
    replacement:
      typeof options.replacement === "string"
        ? formatToReplacementObject(options.replacement)
        : (options.replacement ?? {}),
  };
}

export default class Mask extends Input<{
  mask: string;
  replacement: Replacement;
}> {
  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {
      writable: false,
      enumerable: false,
      configurable: true,
      value: "Mask",
    });
  }

  format: (value: string) => string;
  formatToParts: (value: string) => MaskPart[];
  unformat: (value: string) => string;
  generatePattern: (overlap: Overlap) => string;

  constructor(options: MaskOptions = {}) {
    super({
      /**
       * Init
       */
      init: ({ initialValue }) => {
        const { mask, replacement } = normalizeOptions(options);

        if (process.env.NODE_ENV !== "production") {
          validate({ initialValue, mask, replacement });
        }

        return {
          value: initialValue,
          options: { mask, replacement },
        };
      },
      /**
       * Tracking
       */
      tracking: ({
        inputType,
        previousValue,
        previousOptions,
        addedValue,
        changeStart,
        changeEnd,
      }) => {
        const { mask, replacement } = normalizeOptions(options);

        // Дополнительно учитываем, что добавление/удаление символов не затрагивают значения до и после диапазона
        // изменения, поэтому нам важно получить их немаскированные значения на основе предыдущего значения и
        // закэшированных пропсов, то есть тех которые были применены к значению на момент предыдущего маскирования
        let beforeChangeValue = unformat(previousValue, {
          end: changeStart,
          ...previousOptions,
        });
        let afterChangeValue = unformat(previousValue, {
          start: changeEnd,
          ...previousOptions,
        });

        // Регулярное выражение по поиску символов кроме ключей `replacement`
        const regExp$1 = RegExp(`[^${Object.keys(replacement).join("")}]`, "g");
        // Находим все заменяемые символы для фильтрации пользовательского значения.
        // Важно определить корректное значение на данном этапе
        let replacementChars = mask.replace(regExp$1, "");

        if (beforeChangeValue) {
          beforeChangeValue = filter(beforeChangeValue, {
            replacementChars,
            replacement,
          });
          replacementChars = replacementChars.slice(beforeChangeValue.length);
        }

        if (addedValue) {
          // Поскольку нас интересуют только "полезные" символы, фильтруем без учёта заменяемых символов
          addedValue = filter(addedValue, {
            replacementChars,
            replacement,
          });
          replacementChars = replacementChars.slice(addedValue.length);
        }

        if (inputType === "insert" && addedValue === "") {
          throw new SyntheticChangeError(
            "The character does not match the key value of the `replacement` object.",
          );
        }

        if (afterChangeValue) {
          afterChangeValue = filter(afterChangeValue, {
            replacementChars,
            replacement,
          });
        }

        const input = beforeChangeValue + addedValue + afterChangeValue;
        const value = format(input, { mask, replacement });

        const selection = resolveSelection({
          inputType,
          value,
          addedValue,
          beforeChangeValue,
          mask,
          replacement,
        });

        return {
          value,
          selectionStart: selection,
          selectionEnd: selection,
          options: { mask, replacement },
        };
      },
    });

    this.format = (value) => {
      return utils.format(value, normalizeOptions(options));
    };

    this.formatToParts = (value) => {
      return utils.formatToParts(value, normalizeOptions(options));
    };

    this.unformat = (value) => {
      return utils.unformat(value, normalizeOptions(options));
    };

    this.generatePattern = (overlap) => {
      return utils.generatePattern(overlap, normalizeOptions(options));
    };
  }
}
