import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";

import { Globe } from "@/components/icons/icons";
import { Tabs, type TabsVariant } from "@/components/tabs/tabs";
import { Typography } from "@/components/typography/typography";

import "@/styles/test.css";

const TABS_PERMUTATIONS: {
  name: string;
  variant: TabsVariant;
  defaultValue?: string;
}[] = [
  {
    name: "primary, no value",
    variant: "primary",
    defaultValue: undefined,
  },
  {
    name: "primary, value",
    variant: "primary",
    defaultValue: "tab-1",
  },
  {
    name: "secondary, no value",
    variant: "secondary",
    defaultValue: undefined,
  },
  {
    name: "secondary, value",
    variant: "secondary",
    defaultValue: "tab-1",
  },
];

const TabsTestComponent = ({
  variant,
  defaultValue,
  onValueChange,
}: {
  variant?: TabsVariant;
  defaultValue?: string;
  onValueChange?(value: string): void;
}) => (
  <Tabs
    data-testid="tabs"
    variant={variant}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
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

  test("defaults to primary variant", () => {
    const result = render(<TabsTestComponent />);

    const tabs = result.getByTestId("tabs");
    expect(tabs).toHaveClass("vesper-tabs-primary");
  });

  test("custom className", () => {
    const result = render(
      <Tabs
        data-testid="tabs"
        className="custom-class"
        variant="primary"
        items={[
          { value: "tab-1", label: "Tab 1", content: <div>Content</div> },
        ]}
      />,
    );

    const tabs = result.getByTestId("tabs");
    expect(tabs).toHaveClass("vesper-tabs-primary");
    expect(tabs).toHaveClass("custom-class");
  });

  test("icon rendering", () => {
    const result = render(<TabsTestComponent />);

    const [tab1, tab2, tab3] = result.getAllByRole("tab");
    expect(tab1!.querySelector(".vesper-tabs-trigger-icon")).not.toBeNull();
    expect(tab2!.querySelector(".vesper-tabs-trigger-icon")).toBeNull();
    expect(tab3!.querySelector(".vesper-tabs-trigger-icon")).toBeNull();
  });

  test("onValueChange callback", async () => {
    const onValueChange = vi.fn();
    const result = render(<TabsTestComponent onValueChange={onValueChange} />);

    const [, tab2] = result.getAllByRole("tab");
    await userEvent.click(tab2!);
    expect(onValueChange).toHaveBeenCalledWith("tab-2");
  });

  test("keyboard navigation", async () => {
    const result = render(<TabsTestComponent defaultValue="tab-1" />);

    const [tab1] = result.getAllByRole("tab");
    await userEvent.click(tab1!);
    expect(result.queryByTestId("tab-1-content")).not.toBeNull();

    await userEvent.keyboard("{ArrowRight}");
    expect(result.queryByTestId("tab-1-content")).toBeNull();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();

    await userEvent.keyboard("{ArrowRight}");
    expect(result.queryByTestId("tab-2-content")).toBeNull();
    expect(result.queryByTestId("tab-3-content")).not.toBeNull();

    await userEvent.keyboard("{ArrowLeft}");
    expect(result.queryByTestId("tab-3-content")).toBeNull();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();
  });
});

describe("tabs [snapshot]", () => {
  TABS_PERMUTATIONS.forEach((permutation) => {
    const { name, ...props } = permutation;

    test(name, async () => {
      const { container } = render(<TabsTestComponent {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe("tabs [a11y]", () => {
  describe.each(["light", "dark"] as const)("theme: %s", (theme) => {
    beforeEach(() => {
      document.documentElement.setAttribute("data-vesper-theme", theme);
      document.body.style.setProperty("background", "var(--vesper-stone-0)");
    });

    afterEach(() => {
      document.documentElement.removeAttribute("data-vesper-theme");
      document.body.style.removeProperty("background");
    });

    TABS_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`a11y (${name})`, async () => {
        const { container } = render(<TabsTestComponent {...props} />);
        expect(await axe.run(container)).toHaveNoViolations();
      });
    });
  });
});
