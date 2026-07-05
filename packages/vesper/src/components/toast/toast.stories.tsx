import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toasts, addToast } from "@/components/toast/toast";
import { Button } from "@/components/button/button";
import { Accordion } from "../accordion/accordion";

function ToastStoryComponent() {
  return (
    <>
      <Button
        variant="contrast"
        onClick={() => {
          const dismissToast = addToast({
            content: (
              <Accordion title="This expands">
                What does it expand to??
              </Accordion>
            ),
            dismissable: true,
            timeout: false,
            buttons: [
              { children: "Undo" },
              { children: "Dismiss", onClick: () => dismissToast() },
            ],
          });
        }}
      >
        add toast
      </Button>
      <Toasts />
    </>
  );
}

const meta = {
  component: ToastStoryComponent,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ToastStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "toast";
