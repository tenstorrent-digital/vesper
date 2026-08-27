import { Range } from "@/components/range/range";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("range", {
  render: (props) => <Range thumbAriaLabels={["Min", "Max"]} {...props} />,
  control: (container) => container.querySelector(".vesper-range")!,
  // applied to each thumb, so that the message is announced when a thumb takes focus
  distributed: ["aria-describedby"],
  reserved: [
    "aria-valuemin",
    "aria-valuemax",
    "aria-valuenow",
    "aria-valuetext",
    "aria-orientation",
  ],
});
