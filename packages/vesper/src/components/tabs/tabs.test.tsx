import type { ReactNode } from "react";

import { cleanup, render } from "@testing-library/react";
import axe from "axe-core";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { userEvent } from "vitest/browser";

import { Globe } from "@/components/icons/icons";
import { Tabs, type TabsVariant } from "@/components/tabs/tabs";
import { Typography } from "@/components/typography/typography";
import "@/styles/test.css";

const TABS_PERMUTATIONS: {
  name: string;
  variant: TabsVariant;
  defaultValue?: string;
  contentAsPanel?: boolean;
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
  {
    name: "primary, contentAsPanel",
    variant: "primary",
    defaultValue: "tab-1",
    contentAsPanel: true,
  },
  {
    name: "secondary, contentAsPanel",
    variant: "secondary",
    defaultValue: "tab-1",
    contentAsPanel: true,
  },
];

/**
 * content that is not a single react element, which can't be rendered as the
 * tab panel itself (even when `contentAsPanel` is set)
 */
const NON_ELEMENT_CONTENT: { name: string; content: ReactNode }[] = [
  { name: "text", content: "Tab content" },
  {
    name: "fragment",
    content: (
      <>
        <span>Tab</span> <span>content</span>
      </>
    ),
  },
  {
    name: "multiple element",
    content: [<span key="1">Tab</span>, " ", <span key="2">content</span>],
  },
];

/**
 * a content component that does not forward props to the element it renders,
 * so it can't be rendered as the tab panel itself
 */
const NonForwardingTabContent = ({ label }: { label: string }) => (
  <section data-testid={`${label}-content`}>
    <Typography style={{ color: "var(--vesper-stone-900)" }}>
      {label} Content
    </Typography>
  </section>
);

const TabsTestComponent = ({
  variant,
  defaultValue,
  onValueChange,
  contentAsPanel,
}: {
  variant?: TabsVariant;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  contentAsPanel?: boolean;
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
        contentAsPanel,
        content: (
          <Typography
            data-testid="tab-1-content"
            style={{ color: "var(--vesper-color-stone-900)" }}
          >
            Tab 1 Content
          </Typography>
        ),
      },
      {
        value: "tab-2",
        label: "Tab 2",
        contentAsPanel,
        content: (
          <Typography
            data-testid="tab-2-content"
            style={{ color: "var(--vesper-color-stone-900)" }}
          >
            Tab 2 Content
          </Typography>
        ),
      },
      {
        value: "tab-3",
        label: "Tab 3",
        contentAsPanel,
        content: (
          <Typography
            data-testid="tab-3-content"
            style={{ color: "var(--vesper-color-stone-900)" }}
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
    expect(tab1Content).not.toBeNull();

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

  describe("content rendered inside a tab panel", () => {
    test("renders content inside the tab panel", () => {
      const result = render(<TabsTestComponent />);

      const [tab1] = result.getAllByRole("tab");
      const panel = result.getByRole("tabpanel");
      const content = result.getByTestId("tab-1-content");

      assert.instanceOf(panel, HTMLDivElement);
      expect(panel).not.toBe(content);
      expect(panel).toContainElement(content);
      expect(panel).toHaveAttribute("aria-labelledby", tab1!.id);
      expect(tab1).toHaveAttribute("aria-controls", panel.id);
      expect(content).not.toHaveAttribute("role");
    });

    test("does not forward panel props to content", () => {
      const result = render(<TabsTestComponent />);

      const content = result.getByTestId("tab-1-content");
      expect(content).not.toHaveAttribute("id");
      expect(content).not.toHaveAttribute("aria-labelledby");
      expect(content).not.toHaveAttribute("tabindex");
    });

    test("renders the active panel when content components do not forward props", async () => {
      const result = render(
        <Tabs
          defaultValue="tab-1"
          items={[
            {
              value: "tab-1",
              label: "Tab 1",
              content: <NonForwardingTabContent label="tab-1" />,
            },
            {
              value: "tab-2",
              label: "Tab 2",
              content: <NonForwardingTabContent label="tab-2" />,
            },
          ]}
        />,
      );

      const [tab1, tab2] = result.getAllByRole("tab");

      await userEvent.click(tab1!);
      expect(result.queryByTestId("tab-1-content")).not.toBeNull();
      expect(result.queryByTestId("tab-2-content")).toBeNull();
      expect(result.getByRole("tabpanel")).toContainElement(
        result.getByTestId("tab-1-content"),
      );

      await userEvent.click(tab2!);
      expect(result.queryByTestId("tab-1-content")).toBeNull();
      expect(result.queryByTestId("tab-2-content")).not.toBeNull();
      expect(result.getByRole("tabpanel")).toContainElement(
        result.getByTestId("tab-2-content"),
      );
    });

    NON_ELEMENT_CONTENT.forEach(({ name, content }) => {
      test(`renders ${name} content inside the tab panel`, () => {
        const result = render(
          <Tabs items={[{ value: "tab-1", label: "Tab 1", content }]} />,
        );

        const panel = result.getByRole("tabpanel");
        assert.instanceOf(panel, HTMLDivElement);
        expect(panel).toHaveTextContent("Tab content");
      });
    });
  });

  describe("content as the tab panel itself via contentAsPanel", () => {
    test("renders content as the tab panel", () => {
      const result = render(<TabsTestComponent contentAsPanel />);

      const [tab1] = result.getAllByRole("tab");
      const panel = result.getByRole("tabpanel");

      expect(panel).toBe(result.getByTestId("tab-1-content"));
      expect(panel).toHaveAttribute("aria-labelledby", tab1!.id);
      expect(tab1).toHaveAttribute("aria-controls", panel.id);
    });

    test("preserves the content's own props", () => {
      const result = render(<TabsTestComponent contentAsPanel />);

      const panel = result.getByRole("tabpanel");
      assert.instanceOf(panel, HTMLParagraphElement);
      expect(panel).toHaveClass(
        "vesper-typography",
        "vesper-typography-copy-md",
      );
      expect(panel.style.color).toBe("var(--vesper-stone-900)");
      expect(panel).toHaveTextContent("Tab 1 Content");
    });

    test("clicking tabs", async () => {
      const result = render(<TabsTestComponent contentAsPanel />);

      const [tab1, tab2, tab3] = result.getAllByRole("tab");

      await userEvent.click(tab1!);
      expect(result.getByRole("tabpanel")).toBe(
        result.getByTestId("tab-1-content"),
      );

      await userEvent.click(tab2!);
      expect(result.queryByTestId("tab-1-content")).toBeNull();
      expect(result.getByRole("tabpanel")).toBe(
        result.getByTestId("tab-2-content"),
      );

      await userEvent.click(tab3!);
      expect(result.queryByTestId("tab-2-content")).toBeNull();
      expect(result.getByRole("tabpanel")).toBe(
        result.getByTestId("tab-3-content"),
      );
    });

    test("can be set per item", async () => {
      const result = render(
        <Tabs
          defaultValue="tab-1"
          items={[
            {
              value: "tab-1",
              label: "Tab 1",
              contentAsPanel: true,
              content: <section data-testid="tab-1-content">Tab 1</section>,
            },
            {
              value: "tab-2",
              label: "Tab 2",
              content: <section data-testid="tab-2-content">Tab 2</section>,
            },
          ]}
        />,
      );

      const [, tab2] = result.getAllByRole("tab");

      expect(result.getByRole("tabpanel")).toBe(
        result.getByTestId("tab-1-content"),
      );

      await userEvent.click(tab2!);
      const panel = result.getByRole("tabpanel");
      const content = result.getByTestId("tab-2-content");
      expect(panel).not.toBe(content);
      expect(panel).toContainElement(content);
    });

    NON_ELEMENT_CONTENT.forEach(({ name, content }) => {
      test(`falls back to rendering ${name} content inside the tab panel`, () => {
        const result = render(
          <Tabs
            items={[
              { value: "tab-1", label: "Tab 1", content, contentAsPanel: true },
            ]}
          />,
        );

        const panel = result.getByRole("tabpanel");
        assert.instanceOf(panel, HTMLDivElement);
        expect(panel).toHaveTextContent("Tab content");
      });
    });
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
      document.body.style.setProperty(
        "background",
        "var(--vesper-color-stone-0)",
      );
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
