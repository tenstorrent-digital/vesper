import type { ComponentProps } from "react";

export const CaretDown = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4.05859 8L10.8984 14.8291L13.1016 14.8291L19.9414 8L21 9.05664L13.7217 16.3242L10.2783 16.3242L3 9.05664L4.05859 8Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
