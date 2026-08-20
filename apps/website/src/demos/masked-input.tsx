"use client";

import { useMemo, useState } from "react";
import { maskitoPhone } from "@maskito/phone";
import { type CountryCode, getCountries } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/min/metadata";

import { MaskedInput } from "@tenstorrent/vesper/masked-input";

const countries = getCountries(metadata);

interface MaskedInputDemoProps {
  kind:
    | "product-license"
    | "replace-regex"
    | "replace-string"
    | "replace-record"
    | "intl-phone-number"
    | "format-on-mount";
}

export function MaskedInputDemo(props: MaskedInputDemoProps) {
  if (props.kind === "product-license") {
    return (
      <MaskedInput
        label="Product license"
        placeholder="ex: jDf8-Kl32-CmX0-iU6v"
        mask={{ format: "____-____-____-____", replace: /[a-zA-Z\d]/ }}
      />
    );
  }

  if (props.kind === "replace-regex") {
    return (
      <MaskedInput
        label="Phone number"
        placeholder="ex: +1 (222) 333-4444"
        mask={{ format: "+1 (___) ___-____", replace: /\d/ }}
      />
    );
  }

  if (props.kind === "replace-string") {
    return (
      <MaskedInput
        label="Masked input"
        placeholder="ex. 1a2-b3c-4d5"
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
        label="Postal code"
        placeholder="ex: A0A 1B1"
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
function IntlPhoneNumberMaskedInput() {
  const [countryIsoCode, setCountryIsoCode] = useState<CountryCode>("US");
  const mask = useMemo(
    () =>
      maskitoPhone({
        countryIsoCode,
        metadata,
        format: "INTERNATIONAL",
        strict: true,
      }),
    [countryIsoCode],
  );

  return (
    <MaskedInput
      formatOnMaskChange
      label="Phone number"
      placeholder="Enter your phone number"
      mask={mask}
      dropdown={{
        options: countries,
        value: countryIsoCode,
        ariaLabel: "Country",
        onChange: (code) => setCountryIsoCode(code as CountryCode),
      }}
    />
  );
}
