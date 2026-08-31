import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TEXT_AREA_SIZES,
  TEXT_AREA_VARIANTS,
  TextArea,
} from "@/components/text-area/text-area";

const meta = {
  component: TextArea,
  argTypes: {
    style: { table: { disable: true } },
    height: { control: "number" },
    size: { control: "radio", options: TEXT_AREA_SIZES },
    variant: { control: "radio", options: TEXT_AREA_VARIANTS },
  },
  parameters: {
    controls: {
      include: [
        "variant",
        "size",
        "disabled",
        "placeholder",
        "height",
        "resizeable",
        "style",
      ],
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    placeholder: "Tell us about yourself",
    height: 104,
    resizeable: false,
    style: { width: "min(calc(100vw - 4rem), 20rem)" },
    "aria-label": "Textarea example",
  },
};
Playground.storyName = "text-area";
