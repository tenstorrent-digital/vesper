import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Combobox,
  COMBOBOX_SIZES,
  COMBOBOX_VARIANTS,
} from "@/components/combobox/combobox";

const meta = {
  component: Combobox,
  argTypes: {
    options: { table: { disable: true } },
    style: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    inputValue: { table: { disable: true } },
    defaultInputValue: { table: { disable: true } },
    onInputValueChange: { table: { disable: true } },
    name: { table: { disable: true } },
    id: { table: { disable: true } },
    form: { table: { disable: true } },
    container: { table: { disable: true } },
    inputRef: { table: { disable: true } },
    required: { table: { disable: true } },
    readOnly: { table: { disable: true } },
    clearButtonAriaLabel: { table: { disable: true } },
    dropdownTriggerAriaLabel: { table: { disable: true } },
    size: { control: "radio", options: COMBOBOX_SIZES },
    variant: { control: "radio", options: COMBOBOX_VARIANTS },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    variant: "default",
    placeholder: "e.g. Apple",
    disabled: false,
    emptyStateText: "No results",
    style: { width: "min(calc(100vw - 4rem), 400px)" },
    options: [
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
    ],
  },
};
Playground.storyName = "combobox";
