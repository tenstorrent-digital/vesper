export const animateToastEnter = (ref: HTMLDivElement | null) =>
  ref?.animate(
    {
      opacity: [0, 1],
      transform: [
        "translateX(calc(100% + var(--vesper-spacing-6)))",
        "translateX(0%)",
      ],
      marginTop: ["0px", "var(--vesper-spacing-4)"],
    },
    { fill: "forwards", duration: 300, easing: "ease" },
  );

export const animateToastExit = (ref: HTMLDivElement | null) =>
  ref?.animate(
    {
      opacity: [1, 0],
      transform: [
        "translateX(0%)",
        "translateX(calc(100% + var(--vesper-spacing-6)))",
      ],
      marginTop: ["var(--vesper-spacing-4)", "0px"],
    },
    { fill: "forwards", duration: 300, easing: "ease" },
  );
