import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import { ArrowLeft } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

export default function NotFound() {
  return (
    <div>
      <Typography variant="heading-2xl" as="h1">
        Not Found
      </Typography>
      <Typography className="mt-vesper-8 mb-vesper-4">
        Could not find requested resource
      </Typography>
      <Button iconLeft={<ArrowLeft />} as={Link} href="/" variant="subtle">
        Back to docs
      </Button>
    </div>
  );
}
