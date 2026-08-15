import { RefObject } from "react";

interface Registrable {
  register: (element: HTMLInputElement) => void;
  unregister: (element: HTMLInputElement) => void;
}

export function createProxy(
  ref: RefObject<HTMLInputElement | null>,
  instanse: Registrable,
) {
  return new Proxy(ref, {
    set(target, property, element: HTMLInputElement | null) {
      if (property !== "current") {
        return false;
      }

      if (element !== ref.current) {
        if (ref.current !== null) {
          instanse.unregister(ref.current);
        }

        if (element !== null) {
          instanse.register(element);
        }
      }

      target[property] = element;

      return true;
    },
  });
}
