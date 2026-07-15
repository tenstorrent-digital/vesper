import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Sheet,
  SHEET_SIDES,
  type SheetProps,
  useSheet,
} from "@/components/sheet/sheet";
import { Button } from "@/components/button/button";
import { Typography } from "@/components/typography/typography";

function SheetStoryComponent({
  withButtons,
  ...props
}: SheetProps & { withButtons: boolean }) {
  const sheet = useSheet();

  return (
    <>
      <Button onClick={sheet.open} variant="contrast">
        Open sheet
      </Button>
      <Sheet
        ref={sheet.ref}
        {...props}
        buttons={
          withButtons
            ? [
                { children: "Close", onClick: sheet.close },
                { children: "Next", onClick: sheet.close },
              ]
            : []
        }
      >
        <Typography>
          {`Don't be afraid to make decisions. Put your feelings into it, your heart, it's your world. You are just a whisper floating across a mountain.`}
        </Typography>
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
        "Not a `Toast` component prop; this control is used to easily toggle on/off buttons in the storybook preview UI.",
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
