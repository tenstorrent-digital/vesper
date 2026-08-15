import filter from "./utils/filter";
import format from "./utils/format";
import normalizeReplacement from "./utils/normalizeReplacementObject";
import resolveSelection from "./utils/resolveSelection";
import unformat from "./utils/unformat";
import validate from "./utils/validate";
import { SyntheticChangeError } from "./SyntheticChangeError";
import type { InputType, MaskOptions, Replacement } from "./types";

const ALLOWED_TYPES = ["text", "email", "tel", "search", "url"];

interface NormalizedOptions {
  mask: string;
  replacement: Replacement;
}

interface Handlers {
  onFocus: (event: FocusEvent) => void;
  onBlur: (event: FocusEvent) => void;
  onInput: (event: Event) => void;
}

interface TrackingParams {
  inputType: InputType;
  previousValue: string;
  previousOptions: NormalizedOptions;
  addedValue: string;
  changeStart: number;
  changeEnd: number;
}

/**
 * Registers an `input` element and formats its value with the given mask as the user types.
 *
 * Standalone equivalent of `Mask`, which implements the same behaviour by extending `Input`.
 */
export default class MaskInput {
  static {
    Object.defineProperty(this.prototype, Symbol.toStringTag, {
      writable: false,
      enumerable: false,
      configurable: true,
      value: "MaskInput",
    });
  }

  readonly #options: MaskOptions;
  readonly #handlersMap = new WeakMap<HTMLInputElement, Handlers>();

  constructor(options: MaskOptions = {}) {
    this.#options = options;
  }

  /**
   * Resolves the current options, which may be mutated between renders.
   */
  #normalizeOptions(): NormalizedOptions {
    return {
      mask: this.#options.mask ?? "",
      replacement: normalizeReplacement(this.#options.replacement ?? {}),
    };
  }

  register = (element: HTMLInputElement): void => {
    if (!ALLOWED_TYPES.includes(element.type)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Warn: The input element type does not match one of the types: ${ALLOWED_TYPES.join(", ")}.`,
        );
      }

      return;
    }

    const { initialValue = "" } =
      (element as { _wrapperState?: { initialValue?: string } })
        ._wrapperState ?? {};

    // При создании `input` элемента возможно программное изменение свойства `value`, что может
    // сказаться на отображении состояния элемента, поэтому важно учесть свойство `value` в приоритете.
    // ISSUE: https://github.com/GoncharukOrg/react-input/issues/3
    const value = element.value || initialValue;
    const options = this.#normalizeOptions();

    if (process.env.NODE_ENV !== "production") {
      validate({ initialValue: value, ...options });
    }

    const cache = {
      value,
      options,
      fallbackOptions: options,
    };

    const timeout = {
      id: -1,
      cachedId: -1,
    };

    const tracker = {
      value: "",
      selectionStart: 0,
      selectionEnd: 0,
    };

    // Важно сохранить дескриптор создаваемый React
    const descriptor = Object.getOwnPropertyDescriptor(
      "_valueTracker" in element ? element : HTMLInputElement.prototype,
      "value",
    );

    // Поскольку значение элемента может быть изменено вне текущей логики,
    // нам важно перехватывать каждое изменение для обновления `tracker.value`.
    // `tracker.value` служит заменой `_valueTracker.getValue()` предоставляемый React.
    Object.defineProperty(element, "value", {
      ...descriptor,
      set: (value: string) => {
        tracker.value = value;
        descriptor?.set?.call(element, value);
      },
    });

    // Поскольку при инициализации возможно изменение инициализированного значения, мы
    // также должны изменить значение элемента, при этом мы не должны устанавливать
    // позицию каретки, так как установка позиции здесь приведёт к автофокусу.
    element.value = value;

    /**
     * Handle focus
     */
    const onFocus = () => {
      const setSelection = () => {
        tracker.selectionStart = element.selectionStart ?? 0;
        tracker.selectionEnd = element.selectionEnd ?? 0;

        timeout.id = window.setTimeout(setSelection);
      };

      timeout.id = window.setTimeout(setSelection);
    };

    /**
     * Handle blur
     */
    const onBlur = () => {
      window.clearTimeout(timeout.id);

      timeout.id = -1;
      timeout.cachedId = -1;
    };

    /**
     * Handle input
     */
    const onInput = (event: Event) => {
      try {
        // Если событие вызывается слишком часто, смена курсора может не поспеть за новым событием,
        // поэтому сравниваем `timeoutId` кэшированный и текущий для избежания некорректного поведения маски
        if (timeout.cachedId === timeout.id) {
          throw new SyntheticChangeError(
            "The input selection has not been updated.",
          );
        }

        timeout.cachedId = timeout.id;

        const { value, selectionStart, selectionEnd } = element;

        if (selectionStart === null || selectionEnd === null) {
          throw new SyntheticChangeError(
            "The selection attributes have not been initialized.",
          );
        }

        const previousValue = tracker.value;
        let inputType: InputType | undefined;

        // При автоподстановке значения браузер заменяет значение полностью, как если бы мы
        // выделили значение и вставили новое, однако `tracker.selectionStart` и `tracker.selectionEnd`
        // не изменятся что приведёт к не правильному определению типа ввода, например, при
        // автоподстановке значения меньше чем предыдущее, тип ввода будет определён как `deleteBackward`.
        // Учитывая что при автоподстановке `inputType` не определён и значение заменяется полностью,
        // нам надо имитировать выделение всего значения, для этого переопределяем позиции выделения
        // @ts-expect-error if `event.inputType` is missing it resolves to `undefined`
        if (event.inputType === undefined) {
          tracker.selectionStart = 0;
          tracker.selectionEnd = previousValue.length;
        }

        // Определяем тип ввода (ручное определение типа ввода способствует кроссбраузерности)
        if (selectionStart > tracker.selectionStart) {
          inputType = "insert";
        } else if (
          selectionStart <= tracker.selectionStart &&
          selectionStart < tracker.selectionEnd
        ) {
          inputType = "deleteBackward";
        } else if (
          selectionStart === tracker.selectionEnd &&
          value.length < previousValue.length
        ) {
          inputType = "deleteForward";
        }

        if (
          inputType === undefined ||
          ((inputType === "deleteBackward" || inputType === "deleteForward") &&
            value.length > previousValue.length)
        ) {
          throw new SyntheticChangeError("Input type detection error.");
        }

        let addedValue = "";
        let changeStart = tracker.selectionStart;
        let changeEnd = tracker.selectionEnd;

        if (inputType === "insert") {
          addedValue = value.slice(tracker.selectionStart, selectionStart);
        } else {
          // Для `delete` нам необходимо определить диапазон удаленных символов, так как
          // при удалении без выделения позиция каретки "до" и "после" будут совпадать
          const countDeleted = previousValue.length - value.length;

          changeStart = selectionStart;
          changeEnd = selectionStart + countDeleted;
        }

        // Предыдущее значение всегда должно соответствовать маскированному значению из кэша. Обратная ситуация может
        // возникнуть при контроле значения, если значение не было изменено после ввода. Для предотвращения подобных
        // ситуаций, нам важно синхронизировать предыдущее значение с кэшированным значением, если они различаются
        if (cache.value !== previousValue) {
          cache.options = cache.fallbackOptions;
        } else {
          cache.fallbackOptions = cache.options;
        }

        const previousOptions = cache.options;

        const { options, ...attributes } = this.#track({
          inputType,
          previousValue,
          previousOptions,
          addedValue,
          changeStart,
          changeEnd,
        });

        element.value = attributes.value;
        element.setSelectionRange(
          attributes.selectionStart,
          attributes.selectionEnd,
        );

        cache.value = attributes.value;
        cache.options = options;

        tracker.selectionStart = attributes.selectionStart;
        tracker.selectionEnd = attributes.selectionEnd;

        // Действие необходимо только при работе React, для правильной работы события `change`!
        // После изменения значения с помощью `setInputAttributes` значение в свойстве `_valueTracker` также
        // изменится и будет соответствовать значению в элементе что приведёт к несрабатыванию события `change`.
        // Чтобы обойти эту проблему с версии React 16, устанавливаем предыдущее состояние на отличное от текущего.
        (
          element as {
            _valueTracker?: { setValue?: (value: string) => void };
          }
        )._valueTracker?.setValue?.(previousValue);
      } catch (error) {
        element.value = tracker.value;
        element.setSelectionRange(tracker.selectionStart, tracker.selectionEnd);

        event.preventDefault();
        event.stopPropagation();

        if ((error as SyntheticChangeError).name !== "SyntheticChangeError") {
          throw error;
        }
      }
    };

    // Событие `focus` не сработает при рендере, даже если включено свойство `autoFocus`,
    // поэтому нам необходимо запустить определение позиции курсора вручную при автофокусе.
    if (document.activeElement === element) {
      onFocus();
    }

    element.addEventListener("focus", onFocus);
    element.addEventListener("blur", onBlur);
    element.addEventListener("input", onInput);

    this.#handlersMap.set(element, { onFocus, onBlur, onInput });
  };

  unregister = (element: HTMLInputElement): void => {
    const handlers = this.#handlersMap.get(element);

    if (handlers !== undefined) {
      element.removeEventListener("focus", handlers.onFocus);
      element.removeEventListener("blur", handlers.onBlur);
      element.removeEventListener("input", handlers.onInput);

      this.#handlersMap.delete(element);
    }
  };

  /**
   * Resolves the masked value and caret position for a single change of the input value.
   */
  #track({
    inputType,
    previousValue,
    previousOptions,
    addedValue,
    changeStart,
    changeEnd,
  }: TrackingParams) {
    const { mask, replacement } = this.#normalizeOptions();

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
  }
}
