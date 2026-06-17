import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";

const meta = {
  component: ThemeSwitcher,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "theme-switcher";
