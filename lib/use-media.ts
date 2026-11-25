"use client";

import { useSyncExternalStore } from "react";

/** A media query's current value; undefined on the server and during hydration. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => undefined,
  );
}

const noSubscribe = () => () => {};
const readSaveData = () =>
  Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData,
  );

/** True when the visitor has Data Saver on; false on the server. */
export function useSaveData() {
  return useSyncExternalStore(noSubscribe, readSaveData, () => false);
}

/** Show a still instead of moving video: reduced motion or Data Saver. */
export function useStillMedia() {
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const saveData = useSaveData();
  return Boolean(reducedMotion) || saveData;
}
