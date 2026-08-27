import { TextInput } from "@/components/text-input/text-input";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("text-input", {
  render: (props) => <TextInput {...props} />,
  control: (container) => container.querySelector("input")!,
});
