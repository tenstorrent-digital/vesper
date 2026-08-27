import { TextArea } from "@/components/text-area/text-area";

import { describeFormInputForwarding } from "@/utils/test-utils/describeFormInputForwarding";

describeFormInputForwarding("text-area", {
  render: (props) => <TextArea {...props} />,
  control: (container) => container.querySelector("textarea")!,
});
