import type { ComponentProps } from "react";

export const Chip = (props: ComponentProps<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 9.59961V14.4004L14.4004 15H9.59961L9 14.4004V9.59961L9.59961 9H14.4004L15 9.59961Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 4H13V2H15V4H17L20 6.9668V9H22V11H20V13H22V15H20V16.8574L17 20H15V22H13V20H11V22H9V20H7L4 16.8574V15H2V13H4V11H2V9H4V6.9668L7 4H9V2H11V4ZM7 8.21875V15.6553L8.2832 17H15.7168L17 15.6553V8.21875L15.7676 7H8.23242L7 8.21875Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
