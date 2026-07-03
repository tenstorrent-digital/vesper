import type { Meta, StoryObj } from "@storybook/react-vite";

import { Modal, useModalRef } from "@/components/modal/modal";
import { Button } from "@/components/button/button";

const meta = {
  component: Modal,
  parameters: { layout: "centered" },
  argTypes: {
    buttons: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    width: 452,
    title: "Are you absolutely sure?",
    description:
      "This action cannot be undone. This will permanently delete your account from our servers.",
  },
  render: function Render(props) {
    const ref = useModalRef();

    return (
      <>
        <Button onClick={() => ref.current.open()} variant="contrast">
          open modal
        </Button>
        <Modal
          ref={ref}
          buttons={[
            {
              variant: "tertiary",
              children: "cancel",
              onClick: () => ref.current.close(),
            },
            {
              variant: "primary",
              children: "continue",
              onClick: () => ref.current.close(),
            },
          ]}
          {...props}
        />
      </>
    );
  },
};
Playground.storyName = "modal";
