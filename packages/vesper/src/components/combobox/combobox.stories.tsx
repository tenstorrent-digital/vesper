import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "@/components/combobox/combobox";

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
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    emptyStateText: "No results",
    disabled: false,
    style: { width: "min(calc(100vw - 4rem), 15rem)" },
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
