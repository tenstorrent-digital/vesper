import { Combobox } from "@/components/combobox/combobox";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("combobox", {
  render: (props) => <Combobox options={["a", "b"]} {...props} />,
  control: (container) => container.querySelector("input")!,
  reserved: [
    "aria-expanded",
    "aria-controls",
    "aria-autocomplete",
    "aria-activedescendant",
  ],
});
