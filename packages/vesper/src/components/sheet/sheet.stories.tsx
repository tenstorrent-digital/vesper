import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sheet, useSheet } from "@/components/sheet/sheet";
import { Button } from "@/components/button/button";

const meta = {
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "Sheet title",
    description: "Sheet description",
    side: "right",
  },
  render: function Render(props) {
    const sheet = useSheet();

    return (
      <>
        <Button onClick={sheet.open} variant="contrast">
          Open sheet
        </Button>
        <Sheet ref={sheet.ref} {...props} />
      </>
    );
  },
};
Playground.storyName = "sheet";
