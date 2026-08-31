"use client";

import { maskitoPhone } from "@maskito/phone";
import metadata from "libphonenumber-js/min/metadata";

import { MaskedInput } from "@tenstorrent/vesper/masked-input";

interface MaskedInputDemoProps {
  kind:
    | "product-license"
    | "replace-regex"
    | "replace-string"
    | "replace-record"
    | "intl-phone-number";
}

export function MaskedInputDemo(props: MaskedInputDemoProps) {
  if (props.kind === "product-license") {
    return (
      <MaskedInput
        aria-label="Product license"
        placeholder="Enter a product license, ex: jDf8-Kl32-CmX0-iU6v"
        mask={{ format: "____-____-____-____", replace: /[a-zA-Z\d]/ }}
      />
    );
  }

  if (props.kind === "replace-regex") {
    return (
      <MaskedInput
        aria-label="Phone number"
        placeholder="Enter a phone number, ex: +1 (222) 333-4444"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    );
  }

  if (props.kind === "replace-string") {
    return (
      <MaskedInput
        aria-label="Masked input"
        placeholder="Masked input, ex. 1a2-b3c-4d5"
        mask={{
          format: "xxx-xxx-xxx",
          replace: "x",
        }}
      />
    );
  }

  if (props.kind === "replace-record") {
    return (
      <MaskedInput
        aria-label="Postal code"
        placeholder="Enter your postal code, ex: A0A 1B1"
        mask={{
          format: "ABA BAB",
          replace: { A: /[a-zA-Z]/, B: /\d/ },
        }}
      />
    );
  }

  if (props.kind === "intl-phone-number") {
    return <IntlPhoneNumberMaskedInput />;
  }

  return null;
}

const mask = maskitoPhone({
  metadata,
  format: "INTERNATIONAL",
  strict: true,
});

function IntlPhoneNumberMaskedInput() {
  return (
    <MaskedInput
      aria-label="Phone number"
      placeholder="Enter your phone number"
      mask={mask}
    />
  );
}
