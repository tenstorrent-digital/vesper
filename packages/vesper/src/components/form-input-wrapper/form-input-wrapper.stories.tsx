import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormInputWrapper } from "@/components/form-input-wrapper/form-input-wrapper";

const meta = {
  component: FormInputWrapper,
} satisfies Meta<typeof FormInputWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "form-input-wrapper";
