import { useEffect } from "react";

export function useScrollLock(condition: boolean) {
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (condition) {
      document.body.style.overflow = "hidden";
      /**
       * Add padding to prevent layout shift for macOS users with "Show scroll bars" set to "Always"
       *
       * (Settings > Appearance > Show scroll bars)
       * */
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [condition]);
}
