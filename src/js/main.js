window.addEventListener("DOMContentLoaded", async() => {
  await handleLoader();
  observeBanner();

  const lenis = new Lenis({
    autoRaf: true,
    smooth: true, // Enables smooth scrolling
    lerp: 0.1, // Lower = smoother, Higher = snappier
    duration: 1, // Adjusts scroll ease duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function (optional)
  });

  new ViewSectionScroll('[data-scroll-to]')
  const cursor = new CustomCursor('cursor')
  cursor.hover('[data-cursor-size]')

  const stickySection = new StickySection('[data-sticky-section]', '[data-transform-container]', '[data-dot]')
  stickySection.init();
});