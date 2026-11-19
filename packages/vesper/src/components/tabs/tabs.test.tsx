import { cleanup, render, waitFor, within } from "@testing-library/react";
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
import {
  TABS_VARIANTS,
  TabPanel,
  TabsList,
  TabsRoot,
  TabTrigger,
  type TabsActivationMode,
  type TabsVariant,
} from "@/components/tabs/tabs";
import { Typography } from "@/components/typography/typography";
import {
  emulateHighContrast,
  runAxeWcag2aaa,
} from "@/test-utils/high-contrast";
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

const TabContent = ({ value, label }: { value: string; label: string }) => (
  <Typography
    data-testid={`${value}-content`}
    style={{ color: "var(--vesper-color-stone-900)" }}
  >
    {label} Content
  </Typography>
);

const TabsTestComponent = ({
  variant,
  value,
  defaultValue,
  onValueChange,
  activationMode,
}: {
  variant?: TabsVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activationMode?: TabsActivationMode;
}) => (
  <TabsRoot
    data-testid="tabs"
    variant={variant}
    value={value}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    activationMode={activationMode}
  >
    <TabsList data-testid="tabs-list">
      <TabTrigger value="tab-1" icon={<Globe />}>
        Tab 1
      </TabTrigger>
      <TabTrigger value="tab-2">Tab 2</TabTrigger>
      <TabTrigger value="tab-3">Tab 3</TabTrigger>
    </TabsList>
    <TabPanel value="tab-1">
      <TabContent value="tab-1" label="Tab 1" />
    </TabPanel>
    <TabPanel value="tab-2">
      <TabContent value="tab-2" label="Tab 2" />
    </TabPanel>
    <TabPanel value="tab-3">
      <TabContent value="tab-3" label="Tab 3" />
    </TabPanel>
  </TabsRoot>
);

afterEach(cleanup);

describe("tabs [unit]", () => {
  describe.each(TABS_VARIANTS)("variant: %s", (variant) => {
    test("applies the variant class to each part", () => {
      const otherVariant = TABS_VARIANTS.find((v) => v !== variant);
      const result = render(<TabsTestComponent variant={variant} />);

      const tabs = result.getByTestId("tabs");
      expect(tabs).toHaveClass(`vesper-tabs-${variant}`);
      expect(tabs).not.toHaveClass(`vesper-tabs-${otherVariant}`);

      const list = result.getByRole("tablist");
      expect(list).toHaveClass(`vesper-tabs-list-${variant}`);
      expect(list).not.toHaveClass(`vesper-tabs-list-${otherVariant}`);

      result.getAllByRole("tab").forEach((trigger) => {
        expect(trigger).toHaveClass(`vesper-tabs-trigger-${variant}`);
        expect(trigger).not.toHaveClass(`vesper-tabs-trigger-${otherVariant}`);
      });
    });
  });

  test("defaults to primary variant", () => {
    const result = render(<TabsTestComponent />);

    expect(result.getByTestId("tabs")).toHaveClass("vesper-tabs-primary");
    expect(result.getByRole("tablist")).toHaveClass("vesper-tabs-list-primary");
    result.getAllByRole("tab").forEach((trigger) => {
      expect(trigger).toHaveClass("vesper-tabs-trigger-primary");
    });
  });

  test("renders each part as the expected element", () => {
    const result = render(<TabsTestComponent />);

    const tabs = result.getByTestId("tabs");
    assert.instanceOf(tabs, HTMLDivElement);
    expect(tabs).toHaveClass("vesper-tabs");

    const list = result.getByRole("tablist");
    assert.instanceOf(list, HTMLDivElement);
    expect(list).toBe(result.getByTestId("tabs-list"));
    expect(list).toHaveClass("vesper-tabs-list");
    expect(tabs).toContainElement(list);

    const triggers = result.getAllByRole("tab");
    expect(triggers).toHaveLength(3);
    triggers.forEach((trigger) => {
      assert.instanceOf(trigger, HTMLButtonElement);
      expect(trigger).toHaveClass("vesper-tabs-trigger");
      expect(list).toContainElement(trigger);
    });

    const panel = result.getByRole("tabpanel");
    assert.instanceOf(panel, HTMLDivElement);
    expect(panel).toContainElement(result.getByTestId("tab-1-content"));
  });

  test("custom className", () => {
    const result = render(
      <TabsRoot data-testid="tabs" className="custom-root" variant="primary">
        <TabsList className="custom-list">
          <TabTrigger className="custom-trigger" value="tab-1">
            Tab 1
          </TabTrigger>
        </TabsList>
        <TabPanel className="custom-panel" value="tab-1">
          Content
        </TabPanel>
      </TabsRoot>,
    );

    const tabs = result.getByTestId("tabs");
    expect(tabs).toHaveClass("vesper-tabs-primary", "custom-root");

    const list = result.getByRole("tablist");
    expect(list).toHaveClass("vesper-tabs-list", "custom-list");

    const trigger = result.getByRole("tab");
    expect(trigger).toHaveClass("vesper-tabs-trigger", "custom-trigger");

    const panel = result.getByRole("tabpanel");
    expect(panel).toHaveClass("custom-panel");
  });

  test("forwards props to the underlying elements", () => {
    const result = render(
      <TabsRoot data-testid="tabs" title="root">
        <TabsList aria-label="Settings">
          <TabTrigger data-testid="trigger" value="tab-1">
            Tab 1
          </TabTrigger>
        </TabsList>
        <TabPanel data-testid="panel" title="panel" value="tab-1">
          Content
        </TabPanel>
      </TabsRoot>,
    );

    expect(result.getByTestId("tabs")).toHaveAttribute("title", "root");
    expect(result.getByRole("tablist", { name: "Settings" })).not.toBeNull();
    expect(result.getByTestId("trigger")).toBe(result.getByRole("tab"));

    const panel = result.getByRole("tabpanel");
    expect(panel).toBe(result.getByTestId("panel"));
    expect(panel).toHaveAttribute("title", "panel");
  });

  describe.each([
    ["primary", "label-md"],
    ["secondary", "label-sm"],
  ] as const)("trigger label typography (%s)", (variant, typography) => {
    test(`renders the label with the ${typography} typography variant`, () => {
      const result = render(<TabsTestComponent variant={variant} />);

      result.getAllByRole("tab").forEach((trigger, index) => {
        const label = trigger.querySelector(".vesper-tabs-trigger-label");
        assert.instanceOf(label, HTMLSpanElement);
        expect(label).toHaveClass(`vesper-typography-${typography}`);
        expect(label).toHaveTextContent(`Tab ${index + 1}`);
      });
    });
  });

  test("icon rendering", () => {
    const result = render(<TabsTestComponent />);

    const [tab1, tab2, tab3] = result.getAllByRole("tab");
    expect(tab1!.querySelector(".vesper-tabs-trigger-icon")).not.toBeNull();
    expect(tab2!.querySelector(".vesper-tabs-trigger-icon")).toBeNull();
    expect(tab3!.querySelector(".vesper-tabs-trigger-icon")).toBeNull();
  });

  test("links each trigger to its panel", async () => {
    const result = render(<TabsTestComponent />);

    const expectLinked = (trigger: HTMLElement) => {
      const panel = result.getByRole("tabpanel");
      expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
      expect(trigger).toHaveAttribute("aria-controls", panel.id);
    };

    const [tab1, tab2, tab3] = result.getAllByRole("tab");
    expectLinked(tab1!);

    await userEvent.click(tab2!);
    expectLinked(tab2!);

    await userEvent.click(tab3!);
    expectLinked(tab3!);
  });

  test("no default value", () => {
    const result = render(<TabsTestComponent />);

    const [tab1] = result.getAllByRole("tab");
    expect(tab1).toHaveAttribute("aria-selected", "true");

    expect(result.queryByTestId("tab-1-content")).not.toBeNull();
    expect(result.queryByTestId("tab-2-content")).toBeNull();
    expect(result.queryByTestId("tab-3-content")).toBeNull();
  });

  test("default value", () => {
    const result = render(<TabsTestComponent defaultValue="tab-2" />);

    const [tab1, tab2] = result.getAllByRole("tab");
    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("aria-selected", "true");

    expect(result.queryByTestId("tab-1-content")).toBeNull();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();
    expect(result.queryByTestId("tab-3-content")).toBeNull();
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

  test("onValueChange callback", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <TabsTestComponent defaultValue="tab-1" onValueChange={onValueChange} />,
    );

    const [, tab2] = result.getAllByRole("tab");
    await userEvent.click(tab2!);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("tab-2");
  });

  test("controlled value", async () => {
    const onValueChange = vi.fn();
    const result = render(
      <TabsTestComponent value="tab-2" onValueChange={onValueChange} />,
    );

    expect(result.queryByTestId("tab-2-content")).not.toBeNull();

    // the selected tab only changes once `value` changes
    const [, , tab3] = result.getAllByRole("tab");
    await userEvent.click(tab3!);
    expect(onValueChange).toHaveBeenLastCalledWith("tab-3");
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();
    expect(result.queryByTestId("tab-3-content")).toBeNull();

    result.rerender(
      <TabsTestComponent value="tab-3" onValueChange={onValueChange} />,
    );
    await waitFor(() => {
      expect(result.queryByTestId("tab-2-content")).toBeNull();
      expect(result.queryByTestId("tab-3-content")).not.toBeNull();
    });
  });

  test("keyboard navigation (automatic activation)", async () => {
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

  test("keyboard navigation (manual activation)", async () => {
    const result = render(
      <TabsTestComponent defaultValue="tab-1" activationMode="manual" />,
    );

    const [tab1, tab2, tab3] = result.getAllByRole("tab");
    await userEvent.click(tab1!);
    expect(result.queryByTestId("tab-1-content")).not.toBeNull();

    // moving focus doesn't change the selected tab
    await userEvent.keyboard("{ArrowRight}");
    expect(tab2).toHaveFocus();
    expect(result.queryByTestId("tab-1-content")).not.toBeNull();
    expect(result.queryByTestId("tab-2-content")).toBeNull();

    await userEvent.keyboard("{Enter}");
    expect(result.queryByTestId("tab-1-content")).toBeNull();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();

    await userEvent.keyboard("{ArrowRight}");
    expect(tab3).toHaveFocus();
    expect(result.queryByTestId("tab-2-content")).not.toBeNull();

    await userEvent.keyboard(" ");
    expect(result.queryByTestId("tab-2-content")).toBeNull();
    expect(result.queryByTestId("tab-3-content")).not.toBeNull();
  });

  describe("invalid nesting throws", () => {
    let consoleError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // hide React's (expected) logs about the errors thrown while rendering
      consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    test("TabsList throws", () => {
      expect(() => render(<TabsList />)).toThrow(
        "TabsList must be rendered within TabsRoot",
      );
    });

    test("TabTrigger throws", () => {
      expect(() =>
        render(<TabTrigger value="tab-1">Tab 1</TabTrigger>),
      ).toThrow("TabTrigger must be rendered within TabsList");
    });

    test("TabPanel throws", () => {
      expect(() => render(<TabPanel value="tab-1" />)).toThrow(
        "TabPanel must be rendered within TabsRoot",
      );
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

describe("tabs [a11y, high contrast]", () => {
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

    TABS_PERMUTATIONS.forEach((permutation) => {
      const { name, ...props } = permutation;

      test(`wcag2aaa (${name})`, async () => {
        const { container } = render(<TabsTestComponent {...props} />);
        expect(await runAxeWcag2aaa(container)).toHaveNoViolations();
      });
    });
  });
});
