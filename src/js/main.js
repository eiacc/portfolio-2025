// Find memory leaks - https://www.youtube.com/watch?v=gQkwkLxuLMc

window.addEventListener("load", async() => {
  Loader();

  const dbProps = {
    dbName       : "portfolio",
    dbStoreName : "projects",
    version       : 1
  }
  const dbInstance = new IndexedDatabase(dbProps); 
  dbInstance.init();
  document.addEventListener("LoaderFinished", () => init(dbInstance)) // LoaderFinished is a custom event located at loader.js file
});

async function init(dbInstance) {
  // Smooth Scroll and Custom Cursor
  if (window.innerWidth > 1024) {
    cursorInit()
  };
  const lenis = new Lenis({
    autoRaf: true,
    smooth: true,   // Enables smooth scrolling
    lerp: 0.1,      // Lower = smoother, Higher = snappier
    duration: 1,    // Adjusts scroll ease duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function (optional)
  });

  // Header Animations
  const headerAnim            = new Animations('[data-fade-down]', 'header', 500);
  const headerAnimAsDeps      = headerAnim.stagger();

  // Banner
  const bannerSVGAnim         = new Animations('[data-fade-down]', '#banner', 700, 35);
  const bannerTextAnim        = new Animations('[data-fade]', '#banner', 375, 100);
  const bannerSVGAnimAsDeps   = bannerSVGAnim.stagger();
  const bannerTextAnimAsDeps  = bannerTextAnim.opacity();

  // Observe Loading Screen
  const observeLoader         = new ObserveLoader({ preloader: '[data-preloader]', first_visible_section: '#banner' });
  observeLoader.init([headerAnimAsDeps, bannerSVGAnimAsDeps, bannerTextAnimAsDeps]);

  // Link Scroll To Section
  const scrollIntoView = new ViewSectionScroll('[data-scroll-to]')
  scrollIntoView.init()

  // Parallax
  const parallaxImagesAnim        = new Animations('[data-fade]', '#parallaxContainer', 175, 50)
  const parallaxImagesAnimAsDeps  = parallaxImagesAnim.opacity()

  // Parallax Sticky Section
  const stickySection             = new StickySection('[data-sticky-section]', '[data-transform-container]', '[data-dot]')
  stickySection.init(parallaxImagesAnimAsDeps);

  const worksEvent = new PageTransition('.work', dbInstance, lenis);
  await worksEvent.init()
}