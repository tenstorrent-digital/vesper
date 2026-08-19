"use client";

import { MaskedInput } from "@tenstorrent/vesper/masked-input";

interface MaskedInputDemoProps {
  kind: "product-license" | "na-phone-number" | "postal-code";
}

export function MaskedInputDemo(props: MaskedInputDemoProps) {
  if (props.kind === "product-license") {
    return (
      <MaskedInput
        label="Product license"
        placeholder="ex: JDF8-KL32-CMX0-IU6V"
        mask={{ format: "____-____-____-____", replace: /[a-zA-Z\d]/ }}
        className="[&_input]:not-placeholder-shown:uppercase"
      />
    );
  }

  if (props.kind === "na-phone-number") {
    return (
      <MaskedInput
        label="Phone number"
        placeholder="ex: +1 (222) 333-4444"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    );
  }

  if (props.kind === "postal-code") {
    return (
      <MaskedInput
        label="Postal code"
        placeholder="ex: A0A 1B1"
        mask={{
          format: "ABA BAB",
          replace: { A: /[a-zA-Z]/, B: /\d/ },
        }}
      />
    );
  }

  return null;
}
