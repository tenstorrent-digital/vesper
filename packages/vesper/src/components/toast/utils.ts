export const focusOldestToast = () => {
  document
    .querySelector<HTMLDivElement>(
      '.vesper-toast:not([data-state="dismissed"])',
    )
    ?.focus();
};

export const getNearestActiveToast = (ref: HTMLDivElement) => {
  const toastElements = Array.from(
    document.querySelectorAll<HTMLDivElement>(".vesper-toast"),
  );

  const currentIndex = toastElements.indexOf(ref);

  // the last active toast before the current one (`findLast` is es2023)
  const prev = toastElements.reduce<HTMLDivElement | undefined>(
    (nearest, e, i) =>
      i < currentIndex && e.dataset.state !== "dismissed" ? e : nearest,
    undefined,
  );

  const next = toastElements.find(
    (e, i) => i > currentIndex && e.dataset.state !== "dismissed",
  );

  return prev || next;
};

/**
 * Checks where an element can be focused. An element can be focused if:
 * - It exists in the document
 * - Neither it nor any of its ancestors are inert or disabled
 *
 */
export function isFocusable(el: HTMLElement): boolean {
  return (
    document.body.contains(el) &&
    !el.closest("[disabled], [inert]") &&
    el.checkVisibility()
  );
}
