"use client";

import { MaskedInput } from "@tenstorrent/vesper/masked-input";

interface MaskedInputDemoProps {
  type: "product-license" | "na-phone-number";
}

export function MaskedInputDemo(props: MaskedInputDemoProps) {
  if (props.type === "product-license") {
    return (
      <MaskedInput
        label="Product license"
        placeholder="ex: JDF8-KL32-CMX0-IU6V"
        mask={{ format: "____-____-____-____", replace: /[a-zA-Z\d]/ }}
        className="[&_input]:not-placeholder-shown:uppercase"
      />
    );
  }

  if (props.type === "na-phone-number") {
    return (
      <MaskedInput
        label="Phone number"
        placeholder="ex: +1 (222) 333-4444"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    );
  }

  return null;
}
