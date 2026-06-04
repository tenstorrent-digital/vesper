import { ProgressBar, type ProgressBarProps } from "@repo/vesper/progress-bar";
import { Typography } from "@repo/vesper/typography";

const SIZES: ProgressBarProps["size"][] = ["sm", "md", "lg"];

const VALUES = [17, 43, 79, 100];

export function ProgressBarPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-vesper-2">
          <Typography variant="copy" size="md" bold>
            default variant, {size} size
          </Typography>
          {VALUES.map((value) => (
            <div key={`default-${value}`} className="flex gap-vesper-2">
              <Typography variant="copy" size="xs" mono>
                {value}%
              </Typography>
              <ProgressBar variant="default" size={size} value={value} />
            </div>
          ))}
          <Typography variant="copy" size="md" bold>
            steps variant, {size} size
          </Typography>
          {VALUES.map((value) => (
            <div key={`steps-${value}`} className="flex gap-vesper-2">
              <Typography variant="copy" size="xs" mono>
                {value}%
              </Typography>
              <ProgressBar variant="steps" size={size} value={value} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
