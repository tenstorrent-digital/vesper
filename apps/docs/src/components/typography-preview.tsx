import { Typography } from "@repo/vesper/typography";

export function TypographyPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <Typography variant="display-lg">Display lg</Typography>
      <Typography variant="display-md">Display md</Typography>
      <Typography variant="display-sm">Display sm</Typography>
      <Typography variant="heading-2xl">Heading 2xl</Typography>
      <Typography variant="heading-xl">Heading xl</Typography>
      <Typography variant="heading-lg">Heading lg</Typography>
      <Typography variant="heading-md">Heading md</Typography>
      <Typography variant="heading-sm">Heading sm</Typography>
      <Typography variant="heading-xs">Heading xs</Typography>
      <Typography variant="copy-lg">Copy lg</Typography>
      <Typography variant="copy-lg-bold">Copy lg (bold)</Typography>
      <Typography variant="copy-md">Copy md</Typography>
      <Typography variant="copy-md-bold">Copy md (bold)</Typography>
      <Typography variant="copy-sm">Copy sm</Typography>
      <Typography variant="copy-sm-bold">Copy sm (bold)</Typography>
      <Typography variant="copy-xs">Copy xs</Typography>
      <Typography variant="copy-xs-bold">Copy xs (bold)</Typography>
      <Typography variant="copy-xs-mono">Copy xs (mono)</Typography>
      <Typography variant="label-lg">Label lg</Typography>
      <Typography variant="label-lg-bold">Label lg (bold)</Typography>
      <Typography variant="label-md">Label md</Typography>
      <Typography variant="label-md-bold">Label md (bold)</Typography>
      <Typography variant="label-md-mono">Label md (mono)</Typography>
      <Typography variant="label-sm">Label sm</Typography>
      <Typography variant="label-sm-bold">Label sm (bold)</Typography>
      <Typography variant="label-sm-mono">Label sm (mono)</Typography>
      <Typography variant="label-xs">Label xs</Typography>
      <Typography variant="label-xs-bold">Label xs (bold)</Typography>
      <Typography variant="label-xs-mono">Label xs (mono)</Typography>
    </div>
  );
}
