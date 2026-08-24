/**
 * Adapted from `@base-ui`'s internal `useMergedRefsN` utility to expose a variadic API
 *
 * @see https://github.com/mui/base-ui/blob/ccfe02679ec9ed08a518bc5444cb6d1ffb63f5e1/packages/utils/src/useMergedRefs.ts
 */

import { useRef } from "react";

type Empty = null | undefined;
export type InputRef<I> = React.Ref<I> | Empty;
type Result<I> = React.RefCallback<I> | null;
type Cleanup = () => void;

type ForkRef<I> = {
  callback: React.RefCallback<I> | null;
  cleanup: Cleanup | null;
  refs: InputRef<I>[];
};

const UNINITIALIZED = {};

function useRefWithInit<T>(init: () => T) {
  const ref = useRef(UNINITIALIZED as T);

  if (ref.current === UNINITIALIZED) {
    ref.current = init();
  }

  return ref;
}

export function useMergedRefs<I>(...refs: InputRef<I>[]): Result<I> {
  const forkRef = useRefWithInit(createForkRef<I>).current;
  if (didChangeN(forkRef, refs)) {
    update(forkRef, refs);
  }
  return forkRef.callback;
}

function createForkRef<I>(): ForkRef<I> {
  return {
    callback: null,
    cleanup: null as Cleanup | null,
    refs: [],
  };
}

function didChangeN<I>(forkRef: ForkRef<I>, newRefs: InputRef<I>[]) {
  return (
    forkRef.refs.length !== newRefs.length ||
    forkRef.refs.some((ref, index) => ref !== newRefs[index])
  );
}

function update<I>(forkRef: ForkRef<I>, refs: InputRef<I>[]) {
  forkRef.refs = refs;

  if (refs.every((ref) => ref == null)) {
    forkRef.callback = null;
    return;
  }

  forkRef.callback = (instance: I) => {
    if (forkRef.cleanup) {
      forkRef.cleanup();
      forkRef.cleanup = null;
    }

    if (instance != null) {
      const cleanupCallbacks = Array(refs.length).fill(
        null,
      ) as Array<Cleanup | null>;

      for (let i = 0; i < refs.length; i += 1) {
        const ref = refs[i];
        if (ref == null) {
          continue;
        }
        switch (typeof ref) {
          case "function": {
            const refCleanup = ref(instance);
            if (typeof refCleanup === "function") {
              cleanupCallbacks[i] = refCleanup;
            }
            break;
          }
          case "object": {
            ref.current = instance;
            break;
          }
          default:
        }
      }

      forkRef.cleanup = () => {
        for (let i = 0; i < refs.length; i += 1) {
          const ref = refs[i];
          if (ref == null) {
            continue;
          }
          switch (typeof ref) {
            case "function": {
              const cleanupCallback = cleanupCallbacks[i];
              if (typeof cleanupCallback === "function") {
                cleanupCallback();
              } else {
                // Legacy ref with no attach-time cleanup: detach by calling it with `null`.
                // It returns nothing; React 19 cleanups are handled in the branch above.
                void ref(null);
              }
              break;
            }
            case "object": {
              ref.current = null;
              break;
            }
            default:
          }
        }
      };
    }
  };
}
