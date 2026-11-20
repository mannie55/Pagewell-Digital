type Engine = typeof import("./motion-engine");

let engine: Engine | null = null;
let loading: Promise<Engine> | null = null;

/** The animation engine, if it has finished loading. */
export const getMotionEngine = () => engine;

/** Loads the animation engine once; safe to call repeatedly. */
export function loadMotionEngine() {
  loading ??= import("./motion-engine").then((mod) => (engine = mod));
  return loading;
}

/**
 * Resolves on the visitor's first scroll, touch, click or key press, or when
 * the browser has nothing better to do. Until then the navbar is static, so
 * none of this code competes with the page becoming interactive.
 */
function whenNeeded() {
  return new Promise<void>((resolve) => {
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const done = () => {
      events.forEach((e) => window.removeEventListener(e, done));
      resolve();
    };
    events.forEach((e) =>
      window.addEventListener(e, done, { once: true, passive: true }),
    );
    if ("requestIdleCallback" in window) {
      requestIdleCallback(done, { timeout: 6000 });
    } else {
      setTimeout(done, 4000);
    }
  });
}

/** For <LazyMotion features>: hands over the features once they are needed. */
export const loadMotionFeaturesWhenNeeded = () =>
  whenNeeded()
    .then(loadMotionEngine)
    .then((mod) => mod.domAnimation);
