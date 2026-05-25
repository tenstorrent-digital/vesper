import type { ComponentProps } from "react";

export const Icon_link = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.75 8.75H5.06055L3.5 10.3105V13.6895L5.06055 15.25H9.75V16.75H4.43945L2 14.3105V9.68945L4.43945 7.25H9.75V8.75Z"
        fill="currentColor"
      ></path>
      <path
        d="M22 9.68945V14.3105L19.5605 16.75H14.25V15.25H18.9395L20.5 13.6895V10.3105L18.9395 8.75H14.25V7.25H19.5605L22 9.68945Z"
        fill="currentColor"
      ></path>
      <path d="M17 12.75H7V11.25H17V12.75Z" fill="currentColor"></path>
    </svg>
  );
};
