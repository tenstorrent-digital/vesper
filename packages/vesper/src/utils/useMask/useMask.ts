import { useMemo, useRef } from "react";

import { createProxy } from "./createProxy";
import MaskInput from "./MaskInput";
import type { MaskOptions } from "./types";

export function useMask({ mask, replacement }: MaskOptions = {}) {
  const $ref = useRef<HTMLInputElement | null>(null);
  const $options = useRef({ mask, replacement });

  $options.current.mask = mask;
  $options.current.replacement = replacement;

  return useMemo(() => {
    return createProxy($ref, new MaskInput($options.current));
  }, []);
}
