export const animateToastEnter = (
  wrapper: HTMLDivElement | null,
  toast: HTMLDivElement | null,
  cb = () => {},
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
      { duration: 300, easing: "ease" },
    )
    .finished.then(cb);

export const animateToastExit = (
  wrapper: HTMLDivElement | null,
  toast: HTMLDivElement | null,
  cb = () => {},
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
      { fill: "forwards", duration: 300, easing: "ease" },
    )
    .finished.then(cb);
