import { Button } from "@tenstorrent/vesper/button";

export const PlaygroundLink = () => {
  return (
    <Button
      as="a"
      href={
        process.env.NODE_ENV === "development"
          ? "http://localhost:5173"
          : "/storybook"
      }
      variant="tertiary"
      size="sm"
    >
      Playground
    </Button>
  );
};
