"use client";

import { useEffect, useRef, useState } from "react";

import { Typography } from "@tenstorrent/vesper/typography";

const MASK = "(___) ___-____";
const REPLACEMENT: Record<string, RegExp> = { _: /\d/, x: /./ };

export default function Page() {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const input = ref.current;

    const handleInput = (e: Event) => {
      const event = e as InputEvent;

      const raw = input.value;

      const cleansed = (() => {
        const replacements = MASK.split("").map((char) =>
          char in REPLACEMENT ? REPLACEMENT[char]! : null,
        );

        let i = 0;
        let result = "";
        for (const r of replacements) {
          if (r === null) continue;
          while (i < raw.length && !r.test(raw[i]!)) i++;
          if (raw[i]) {
            result += raw[i];
            i++;
          }
        }

        return result;
      })();

      const formatted = (() => {
        let i = -1;
        return MASK.split("")
          .map((char) => {
            if (i >= cleansed.length) return "";
            if (char in REPLACEMENT) {
              i++;
              return cleansed[i] ?? "";
            }
            return char;
          })
          .join("");
      })();

      input.value = formatted;
    };

    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, []);

  return (
    <Typography
      ref={ref}
      as="input"
      className="border-vesper-border-primary w-10 border"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
