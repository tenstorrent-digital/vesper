import { useEffect } from "react";

let lockCount = 0;

function lock() {
  lockCount++;
  if (lockCount === 1) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    /**
     * Add padding to prevent layout shift for macOS users with "Show scroll bars" set to "Always"
     *
     * (Settings > Appearance > Show scroll bars)
     * */
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "unset";
    document.body.style.paddingRight = "0px";
  }
}

export function useScrollLock(condition: boolean) {
  useEffect(() => {
    if (condition) {
      lock();
      return () => unlock();
    }
  }, [condition]);
}
