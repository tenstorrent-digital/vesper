import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  INTERACTIVE_MATERIAL_STATES,
  Material,
  MATERIAL_VARIANTS,
} from "@/components/material/material";

const meta = {
  component: Material,
  argTypes: {
    variant: { control: "radio", options: MATERIAL_VARIANTS },
    state: {
      control: "radio",
      options: [...INTERACTIVE_MATERIAL_STATES, undefined],
    },
  },
} satisfies Meta<typeof Material>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "outlined",
    state: undefined,
  },
  render(props) {
    return (
      <Material as="button" style={{ width: 200, aspectRatio: 1 }} {...props} />
    );
  },
};
Playground.storyName = "material";
