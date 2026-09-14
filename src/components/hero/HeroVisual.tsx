import { lazy, Suspense, useEffect, useState } from "react";
import HeroFallback from "./HeroFallback";

// Heavy: dynamically loaded only when (a) reduced-motion is OFF, (b) the
// element is in viewport, and (c) WebGL is supported. The 884 kB three.js
// bundle never touches the network otherwise.
const HeroScene = lazy(() => import("./HeroScene"));

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroVisual() {
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL()) return;

    // Defer until the browser is idle, then mount the Canvas.
    const trigger = () => setEnable3D(true);
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;

    let id: number;
    if (ric) {
      id = ric(trigger, { timeout: 1500 });
    } else {
      id = window.setTimeout(trigger, 600) as unknown as number;
    }
    return () => {
      if (ric && (window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <>
      {/* Always rendered — works with no JS, no WebGL, reduced motion. */}
      <HeroFallback />
      {enable3D && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}
    </>
  );
}
