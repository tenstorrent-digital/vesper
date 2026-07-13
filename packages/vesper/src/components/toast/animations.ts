const getIsReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const animateToastEnter = (
  wrapper: HTMLDivElement | null,
  toast: HTMLDivElement | null,
  onFinished: () => void,
) =>
  wrapper
    ?.animate(
      {
        opacity: [0, 1],
        transform: [
          "translateX(calc(100% + var(--vesper-spacing-6)))",
          "translateX(0%)",
        ],
        marginTop: ["0px", "var(--vesper-spacing-4)"],
        height: ["0px", (toast?.getBoundingClientRect().height || 0) + "px"],
      },
      { duration: getIsReducedMotion() ? 0 : 300, easing: "ease" },
    )
    .finished.then(onFinished);

export const animateToastExit = (
  wrapper: HTMLDivElement | null,
  toast: HTMLDivElement | null,
  onFinished: () => void,
) =>
  wrapper
    ?.animate(
      {
        opacity: [1, 0],
        transform: [
          "translateX(0%)",
          "translateX(calc(100% + var(--vesper-spacing-6)))",
        ],
        marginTop: ["var(--vesper-spacing-4)", "0px"],
        height: [(toast?.getBoundingClientRect().height || 0) + "px", "0px"],
      },
      {
        fill: "forwards",
        duration: getIsReducedMotion() ? 0 : 300,
        easing: "ease",
      },
    )
    .finished.then(onFinished);
