import type { Meta, StoryObj } from "@storybook/react-vite";

import { Choicebox } from "@/components/choicebox/choicebox";

function ChoiceboxStoryComponent({
  disabled,
  multiselect,
  withDescriptions,
}: {
  disabled: boolean;
  multiselect: boolean;
  withDescriptions: boolean;
}) {
  return (
    <Choicebox
      multiselect={multiselect}
      disabled={disabled}
      name="example"
      options={[
        {
          label: "Option A",
          value: "option-a",
          description: withDescriptions ? "This is a description" : undefined,
        },
        {
          label: "Option B",
          value: "option-b",
          description: withDescriptions ? "This is a description" : undefined,
        },
        {
          label: "Option C",
          value: "option-c",
          description: withDescriptions ? "This is a description" : undefined,
        },
      ]}
      style={{ width: "min(calc(100vw - 4rem), 400px)" }}
    />
  );
}

const meta = {
  component: ChoiceboxStoryComponent,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ChoiceboxStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    multiselect: false,
    disabled: false,
    withDescriptions: true,
  },
};
Playground.storyName = "choicebox";
