import { Select } from "@/components/select/select";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("select", {
  render: (props) => <Select options={["a", "b"]} {...props} />,
  control: (container) => container.querySelector("button")!,
  reserved: ["aria-expanded", "aria-controls", "aria-haspopup"],
});
