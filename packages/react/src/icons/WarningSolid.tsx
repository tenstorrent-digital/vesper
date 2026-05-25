import type { ComponentProps } from "react";

export const WarningSolid = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 18.5536L20.8761 20.5H3.10328L2 18.5902L10.966 3.5H13.0557L22 18.5536ZM10.8377 16.9828V18.1552L11.4243 18.7414H12.5975L13.1841 18.1552V16.9828L12.5975 16.3966H11.4243L10.8377 16.9828ZM11.131 7.01724L10.5444 7.60345L11.131 14.6379L11.7176 15.2241H12.3042L12.8908 14.6379L13.4773 7.60345L12.8908 7.01724H11.131Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
