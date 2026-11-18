---
"@tenstorrent/vesper": patch
---

Refactored `<Tabs>` component to allow more fine-tuned composition. Consumers should now import and assemble the parts that make up a tabbed layout: `TabsRoot`, `TabsList`, `TabTrigger`, and `TabPanel`:

```tsx
<TabsRoot>
  <TabsList>
    <TabTrigger value="tab-1">tab 1</TabTrigger>
    <TabTrigger value="tab-2">tab 2</TabTrigger>
  </TabsList>
  <TabPanel value="tab-1">tab 1 content</TabPanel>
  <TabPanel value="tab-2">tab 2 content</TabPanel>
</TabsRoot>
```
