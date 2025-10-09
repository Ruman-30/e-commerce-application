// utils/lenis.js
import Lenis from "@studio-freight/lenis";

export let lenis;

export function initLenis() {
  lenis = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

// helper functions
export function pauseLenis() {
  if (lenis) lenis.stop(); // pauses Lenis
}

export function resumeLenis() {
  if (lenis) lenis.start(); // resumes Lenis
}
