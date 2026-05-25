import type { ComponentProps } from "react";

export const Trash = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 18H9V10H10V18Z" fill="currentColor"></path>
      <path d="M15 18H14V10H15V18Z" fill="currentColor"></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 19L17 21H7L5 19V7H19V19ZM6 18.5859L7.41406 20H16.5859L18 18.5859V8H6V18.5859Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 5.5H20V6.5H4V5.5H8V3H16V5.5ZM9 5.5H15V4H9V5.5Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
