import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/badge/badge";
import { StatusIndicator } from "@/components/status-indicator/status-indicator";
import { Table } from "@/components/table/table";

const meta = {
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render() {
    return (
      <Table>
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Device</th>
            <th>Status</th>
            <th>Deployed at</th>
            <th>Stopped at</th>
            <th>Duration</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SD-XL 1.0-base 8B</td>
            <td>n300</td>
            <td>
              <StatusIndicator label="Active" state="ready" />
            </td>
            <td>5/11/2026, 1:15 PM</td>
            <td>---</td>
            <td>---</td>
            <td>7000</td>
          </tr>
          <tr>
            <td>Wan 2.2 14B</td>
            <td>n300</td>
            <td>
              <StatusIndicator label="Active" state="ready" />
            </td>
            <td>5/11/2026, 1:15 PM</td>
            <td>---</td>
            <td>---</td>
            <td>7002</td>
          </tr>
          <tr>
            <td>Llama-3.3-70B-Instruct</td>
            <td>n300</td>
            <td>
              <StatusIndicator animated label="Deploying" state="progress" />
            </td>
            <td>---</td>
            <td>---</td>
            <td>---</td>
            <td>7002</td>
          </tr>
          <tr>
            <td>SpeechT5 (TTS task) 3.8M</td>
            <td>n300</td>
            <td>
              <Badge variant="danger" subtle>
                Failed
              </Badge>
            </td>
            <td>5/11/2026, 4:27 PM</td>
            <td>5/12/2026, 6:48 PM</td>
            <td>2h 21m</td>
            <td>7000</td>
          </tr>
        </tbody>
      </Table>
    );
  },
};
Playground.storyName = "table";
