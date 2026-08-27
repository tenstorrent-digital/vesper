import { Checkbox } from "@/components/checkbox/checkbox";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("checkbox", {
  render: (props) => <Checkbox text="Checkbox text" {...props} />,
  control: (container) => container.querySelector("input")!,
});
