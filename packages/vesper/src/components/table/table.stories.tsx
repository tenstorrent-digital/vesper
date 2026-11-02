import type { Meta, StoryObj } from "@storybook/react-vite";

import { Table } from "@/components/table/table";

const meta = {
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "table";
