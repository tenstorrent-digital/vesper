"use client";

import { Combobox } from "@tenstorrent/vesper/combobox";

interface ComboboxDemoProps {
  kind: "fruits";
}

export function ComboboxDemo(props: ComboboxDemoProps) {
  if (props.kind === "fruits") {
    return (
      <Combobox
        placeholder="e.g. Apple"
        options={[
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
          { label: "Orange", value: "orange" },
          { label: "Pineapple", value: "pineapple" },
          { label: "Grape", value: "grape" },
          { label: "Mango", value: "mango" },
          { label: "Strawberry", value: "strawberry" },
          { label: "Blueberry", value: "blueberry" },
          { label: "Raspberry", value: "raspberry" },
          { label: "Blackberry", value: "blackberry" },
          { label: "Cherry", value: "cherry" },
          { label: "Peach", value: "peach" },
          { label: "Pear", value: "pear" },
          { label: "Plum", value: "plum" },
          { label: "Kiwi", value: "kiwi" },
          { label: "Watermelon", value: "watermelon" },
          { label: "Cantaloupe", value: "cantaloupe" },
          { label: "Honeydew", value: "honeydew" },
          { label: "Papaya", value: "papaya" },
          { label: "Guava", value: "guava" },
          { label: "Lychee", value: "lychee" },
          { label: "Pomegranate", value: "pomegranate" },
          { label: "Apricot", value: "apricot" },
          { label: "Grapefruit", value: "grapefruit" },
          { label: "Passionfruit", value: "passionfruit" },
        ]}
      />
    );
  }
}
