export const focusOldestToast = () => {
  document
    .querySelector<HTMLDivElement>(".vesper-toast:not(.vesper-toast-dismissed)")
    ?.focus();
};

export const getNearestActiveToast = (ref: HTMLDivElement) => {
  const toastElements = Array.from(
    document.querySelectorAll<HTMLDivElement>(".vesper-toast"),
  );

  const prev = toastElements
    .filter(
      (e, i) =>
        i < toastElements.indexOf(ref) &&
        !e.classList.contains("vesper-toast-dismissed"),
    )
    .reverse()[0];

  const next = toastElements.filter(
    (e, i) =>
      i > toastElements.indexOf(ref) &&
      !e.classList.contains("vesper-toast-dismissed"),
  )[0];

  return prev || next;
};
