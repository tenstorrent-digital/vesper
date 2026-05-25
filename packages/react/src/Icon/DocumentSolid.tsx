import type { ComponentProps } from "react";

export const DocumentSolid = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 8L14 9H19V20L18 21H6L5 20V4L6 3H13V8ZM8 16V17H16V16H8ZM8 14H16V13H8V14Z"
        fill="currentColor"
      ></path>
      <path d="M19 8H14.5L14 7.5V3L19 8Z" fill="currentColor"></path>
    </svg>
  );
};
