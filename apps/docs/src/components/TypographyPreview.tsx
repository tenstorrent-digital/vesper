import { Typography } from "@repo/vesper/Typography";

export function TypographyPreview() {
  return (
    <div className="bg-vesper-stone-100 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <Typography variant="display" size="lg">
        Display lg
      </Typography>
      <Typography variant="display" size="md">
        Display md
      </Typography>
      <Typography variant="display" size="sm">
        Display sm
      </Typography>
      <Typography variant="heading" size="2xl">
        Heading 2xl
      </Typography>
      <Typography variant="heading" size="xl">
        Heading xl
      </Typography>
      <Typography variant="heading" size="lg">
        Heading lg
      </Typography>
      <Typography variant="heading" size="md">
        Heading md
      </Typography>
      <Typography variant="heading" size="sm">
        Heading sm
      </Typography>
      <Typography variant="heading" size="xs">
        Heading xs
      </Typography>
      <Typography variant="copy" size="lg">
        Copy lg
      </Typography>
      <Typography variant="copy" size="lg" bold>
        Copy lg (bold)
      </Typography>
      <Typography variant="copy" size="md">
        Copy md
      </Typography>
      <Typography variant="copy" size="md" bold>
        Copy md (bold)
      </Typography>
      <Typography variant="copy" size="sm">
        Copy sm
      </Typography>
      <Typography variant="copy" size="sm" bold>
        Copy sm (bold)
      </Typography>
      <Typography variant="copy" size="xs">
        Copy xs
      </Typography>
      <Typography variant="copy" size="xs" bold>
        Copy xs (bold)
      </Typography>
      <Typography variant="copy" size="xs" mono>
        Copy xs (mono)
      </Typography>
      <Typography variant="label" size="lg">
        Label lg
      </Typography>
      <Typography variant="label" size="lg" bold>
        Label lg (bold)
      </Typography>
      <Typography variant="label" size="md">
        Label md
      </Typography>
      <Typography variant="label" size="md" bold>
        Label md (bold)
      </Typography>
      <Typography variant="label" size="md" mono>
        Label md (mono)
      </Typography>
      <Typography variant="label" size="sm">
        Label sm
      </Typography>
      <Typography variant="label" size="sm" bold>
        Label sm (bold)
      </Typography>
      <Typography variant="label" size="sm" mono>
        Label sm (mono)
      </Typography>
      <Typography variant="label" size="xs">
        Label xs
      </Typography>
      <Typography variant="label" size="xs" bold>
        Label xs (bold)
      </Typography>
      <Typography variant="label" size="xs" mono>
        Label xs (mono)
      </Typography>
    </div>
  );
}
