import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { Table } from "@/components/table/table";
import "@/styles/test.css";
import {
  emulateHighContrast,
  runAxeWcag2aaa,
} from "@/test-utils/high-contrast";

afterEach(cleanup);

describe("table [unit]", () => {
  test("renders a table", () => {
    const { container } = render(<TestTable />);
    expect(container.firstElementChild?.tagName).toBe("TABLE");
  });
});

describe("table [snapshot]", () => {
  test("renders correctly", async () => {
    const { container } = render(<TestTable />);

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("table [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`a11y (${theme})`, async () => {
      const { container } = render(<TestTable />);

      expect(await axe.run(container)).toHaveNoViolations();
    });
  });
});

describe("table [a11y, high contrast]", () => {
  emulateHighContrast();

  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    test(`wcag2aaa (${theme})`, async () => {
      const { container } = render(<TestTable />);
      expect(await runAxeWcag2aaa(container.firstChild!)).toHaveNoViolations();
    });
  });
});

function TestTable() {
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
          <td>Active</td>
          <td>5/11/2026, 1:15 PM</td>
          <td>---</td>
          <td>---</td>
          <td>7000</td>
        </tr>
        <tr>
          <td>Wan 2.2 14B</td>
          <td>n300</td>
          <td>Active</td>
          <td>5/11/2026, 1:15 PM</td>
          <td>---</td>
          <td>---</td>
          <td>7002</td>
        </tr>
        <tr>
          <td>Llama-3.3-70B-Instruct</td>
          <td>n300</td>
          <td>Deploying</td>
          <td>---</td>
          <td>---</td>
          <td>---</td>
          <td>7002</td>
        </tr>
        <tr>
          <td>SpeechT5 (TTS task) 3.8M</td>
          <td>n300</td>
          <td>Failed</td>
          <td>5/11/2026, 4:27 PM</td>
          <td>5/12/2026, 6:48 PM</td>
          <td>2h 21m</td>
          <td>7000</td>
        </tr>
      </tbody>
    </Table>
  );
}
