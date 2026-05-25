import type { ComponentProps } from "react";

export const Size = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M19.6904 18.9834L19.9053 18.7686V13.6924H20.9971V19.2207L19.2207 20.9971H13.6924V19.9053H18.7686L18.9834 19.6904L12.6201 13.3271L13.3271 12.6201L19.6904 18.9834Z"
        fill="currentColor"
      ></path>
      <path
        d="M10.3047 4.0918H5.22852L5.01367 4.30664L11.377 10.6699L10.6699 11.377L4.30664 5.01367L4.0918 5.22852V10.3047H3V4.77637L4.77637 3H10.3047V4.0918Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
