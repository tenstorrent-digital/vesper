import type { Meta, StoryObj } from "@storybook/react-vite";

import { Server } from "@/components/icons/icons";
import { Select } from "@/components/select/select";

const meta = {
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    options: [
      { value: "lions", label: "Lions" },
      { value: "tigers", label: "Tigers" },
      { value: "bears", label: "Bears" },
      { value: "oh_my", label: "Oh my" },
    ],
    size: "lg",
    placeholder: "Select an option",
    disabled: false,
    icon: <Server />,
  },
  render(props) {
    return (
      <Select style={{ width: "min(calc(100vw - 4rem), 240px)" }} {...props} />
    );
  },
};
Playground.storyName = "select";
