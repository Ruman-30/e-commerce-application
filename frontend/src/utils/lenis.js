import Lenis from "@studio-freight/lenis";

let lenis;

export function initLenis() {
  lenis = new Lenis({
    duration: 1, // scroll speed
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false, // disable smooth on touch devices if you want
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
