import type { ComponentProps } from "react";

export const Search = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 6.61133V12.3887L14.7334 13.6543L21 19.9209L19.9209 21L13.6543 14.7334L12.3887 16H6.61133L3 12.3887V6.61133L6.61133 3H12.3887L16 6.61133ZM4.5 7.23242V11.7676L7.23242 14.5H11.7676L14.5 11.7676V7.23242L11.7676 4.5H7.23242L4.5 7.23242Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
