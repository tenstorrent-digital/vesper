import type { ComponentProps } from "react";

export const SuccessSolid = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M21 8V16L16 21H8L3 16V8L8 3H16L21 8ZM16.2402 8.2959L9.79102 14.4355H9.7793L7.75977 12.5127L7.58691 12.3486L7.41504 12.5127L6.82715 13.0713L6.6377 13.252L6.82715 13.4336L9.16406 15.6572L9.23633 15.7266H10.334L10.4062 15.6572L17.1729 9.2168L17.3623 9.03516L17.1729 8.85449L16.585 8.2959L16.4131 8.13184L16.2402 8.2959Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
