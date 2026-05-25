import type { ComponentProps } from "react";

export const ModeDark = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 8.88867V15.1113L15.1113 19H8.88867L5 15.1113V8.88867L8.88867 5H15.1113L19 8.88867ZM6 9.33301V14.667L9.33301 18H12V6H9.33301L6 9.33301Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
