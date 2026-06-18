import { render, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import axe from "axe-core";

import { Tabs, type TabsVariant } from "@/components/tabs/tabs";
import { Globe } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import "@/styles/test.css";
import { userEvent } from "vitest/browser";

const TabsTestComponent = ({
  variant,
  defaultValue,
}: {
  variant?: TabsVariant;
  defaultValue?: string;
}) => (
  <Tabs
    data-testid="tabs"
    variant={variant}
    defaultValue={defaultValue}
    items={[
      {
        value: "tab-1",
        label: "Tab 1",
        icon: <Globe />,
        content: (
          <Typography
            data-testid="tab-1-content"
            style={{ color: "var(--vesper-stone-900)" }}
          >
            Tab 1 Content
          </Typography>
        ),
      },
      {
        value: "tab-2",
        label: "Tab 2",
        content: (
          <Typography
            data-testid="tab-2-content"
            style={{ color: "var(--vesper-stone-900)" }}
          >
            Tab 2 Content
          </Typography>
        ),
      },
      {
        value: "tab-3",
        label: "Tab 3",
        content: (
          <Typography
            data-testid="tab-3-content"
            style={{ color: "var(--vesper-stone-900)" }}
          >
            Tab 3 Content
          </Typography>
        ),
      },
    ]}
  />
);

afterEach(cleanup);

describe("tabs [unit]", () => {
  test("primary variant class", () => {
    const result = render(<TabsTestComponent variant="primary" />);

    const tabs = result.getByTestId("tabs");
    expect(tabs).toHaveClass("vesper-tabs-primary");
  });

  test("secondary variant class", () => {
    const result = render(<TabsTestComponent variant="secondary" />);

    const tabs = result.getByTestId("tabs");
    expect(tabs).toHaveClass("vesper-tabs-secondary");
  });

  test("no default value", () => {
    const result = render(<TabsTestComponent />);

    const tab1Content = result.queryByTestId("tab-1-content");
    expect(tab1Content).toBeNull();

    const tab2Content = result.queryByTestId("tab-2-content");
    expect(tab2Content).toBeNull();

    const tab3Content = result.queryByTestId("tab-3-content");
    expect(tab3Content).toBeNull();
  });

  test("default value", () => {
    const result = render(<TabsTestComponent defaultValue="tab-1" />);

    const tab1Content = result.queryByTestId("tab-1-content");
    expect(tab1Content).not.toBeNull();
  });

  test("clicking tabs", async () => {
    const result = render(<TabsTestComponent />);

    const [tab1, tab2, tab3] = result.getAllByRole("tab");

    await userEvent.click(tab1!);
    expect(result.queryByTestId("tab-1-content")).not.toBeNull();

    await userEvent.click(tab2!);
    expect(result.queryByTestId("tab-1-content")).toBeNull();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();

    await userEvent.click(tab3!);
    expect(result.queryByTestId("tab-2-content")).toBeNull();
    expect(result.queryByTestId("tab-3-content")).not.toBeNull();
  });
});

describe("tabs [snapshot]", () => {
  test("primary, no default value", async () => {
    const { container } = render(<TabsTestComponent variant="primary" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("primary, default value", async () => {
    const { container } = render(
      <TabsTestComponent variant="primary" defaultValue="tab-1" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("secondary, no default value", async () => {
    const { container } = render(<TabsTestComponent variant="secondary" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("secondary, default value", async () => {
    const { container } = render(
      <TabsTestComponent variant="secondary" defaultValue="tab-1" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("tabs [a11y]", () => {
  ["light", "dark"].forEach((theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
    });

    test(`wcag2aaa (primary, no value)`, async () => {
      const { container } = render(<TabsTestComponent variant="primary" />);
      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (primary, with value)`, async () => {
      const { container } = render(
        <TabsTestComponent variant="primary" defaultValue="tab-1" />,
      );
      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, no value)`, async () => {
      const { container } = render(<TabsTestComponent variant="secondary" />);
      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });

    test(`wcag2aaa (secondary, with value)`, async () => {
      const { container } = render(
        <TabsTestComponent variant="secondary" defaultValue="tab-1" />,
      );
      expect(
        await axe.run(container, { runOnly: "wcag2aaa" }),
      ).toHaveNoViolations();
    });
  });
});
