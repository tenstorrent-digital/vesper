import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { Button } from "@/components/button/button";
import { Sheet, SHEET_SIDES, type SheetProps } from "@/components/sheet/sheet";
import { Typography } from "@/components/typography/typography";

function SheetStoryComponent({
  withButtons,
  ...props
}: Omit<SheetProps, "open" | "onOpenChange"> & { withButtons: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contrast">
        Open sheet
      </Button>
      <Sheet {...props} open={open} onOpenChange={setOpen}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--vesper-spacing-6)",
            minHeight: "100%",
          }}
        >
          <Typography>
            {`Don't be afraid to make decisions. Put your feelings into it, your heart, it's your world. You are just a whisper floating across a mountain.`}
          </Typography>
          {withButtons && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--vesper-spacing-4)",
                marginTop: "auto",
              }}
            >
              <Button size="lg" variant="tertiary" onClick={close}>
                Close
              </Button>
              <Button size="lg" variant="contrast" onClick={close}>
                Next
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </>
  );
}

const meta = {
  component: SheetStoryComponent,
  argTypes: {
    side: { control: "radio", options: SHEET_SIDES },
    withButtons: {
      description:
        "Not a `Sheet` component prop. This control toggles a row of buttons rendered as part of the sheet's children in the storybook preview UI.",
    },
  },
} satisfies Meta<typeof SheetStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "Sheet title",
    description: "Sheet description",
    side: "right",
    withButtons: false,
    popover: false,
  },
};
Playground.storyName = "sheet";
