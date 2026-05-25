import type { ComponentProps } from "react";

export const CaretUp = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.9414 16.3242L13.1016 9.49512L10.8984 9.49512L4.05859 16.3242L3 15.2676L10.2783 8L13.7217 8L21 15.2676L19.9414 16.3242Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
