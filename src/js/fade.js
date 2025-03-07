const fadeStateHashmap = {
  banner: false
}; // this is where we store the state of each section

let elements = {
  isIntersecting: false,
  observeBannerAnimationId: null,
  y: 0,
  height: 0,
  el: null
}

export function observeBanner() {
  const preloader = document.querySelector("[data-preloader]");
  const container = document.querySelector(".banner");
  // showBoundary(container, true)
  showBoundary(container)

  if (!container) {
    console.error("Banner section not found!");
    return;
  }

  const observer = new IntersectionObserver(handleIntersection(preloader), { threshold: 0.1 });
  observer.observe(container);

  // 🔥 MutationObserver to track when preloader finishes
  const mutationObserver = new MutationObserver(() => handleMutation(preloader, container, observer, mutationObserver));
  mutationObserver.observe(preloader, { attributes: true, attributeFilter: ["data-loading"] });

  // document.body.style.overflow = "unset"
}

/**
 * Intersection Observer Callback
 * 
 * @param {HTMLElement} preloader = preloader's container
 */
function handleIntersection(preloader) {
  return (entries) => {
    entries.forEach((entry) => {
      const isLoading = preloader.getAttribute("data-loading") === "true";
      
      if (!isLoading && entry.isIntersecting) {
        const { y, height } = entry.boundingClientRect;
        
        elements.isIntersecting = true
        elements.height = height
        elements.y = y
        elements.el = entry

        loopElements();
        fadeStateHashmap.banner = true;
        // animateBannerText()
      } else {
        elements.isIntersecting = false;

        console.log("🚫 Entry is blocked or not intersecting.");
        fadeStateHashmap.banner = false;
        // cancelAnimationFrame(elements.observeBannerAnimationId)
      }
    });
  };
}

/**
 * Handles mutation observer logic.
 * 
 * @param {HTMLElement} preloader - preloader's container
 * @param {HTMLElement} container - Section we want to observe
 * @param {IntersectionObserver} observer - The IntersectionObserver instance
 * @param {MutationObserver} mutationObserver - The MutationObserver instance
 */
function handleMutation(preloader, container, observer, mutationObserver) {
  if (preloader.getAttribute("data-loading") === "false") {
    console.log("🚀 preloader finished, re-running observer!");
    observer.disconnect();
    observer.observe(container);
    mutationObserver.disconnect(); // Stop observing once done
  }
}

/**
 * 
 * @param {HTMLElement} container - section we want to observe
 * @param {boolean} state
 * @returns void
 */
function showBoundary(container, state = false) {
  if (!state) return
  container.style.border = "20px dashed green"; // Debugging visual
}

function loopElements() {
  const elementsContainer = document.querySelectorAll('[data-fade-down]');
  const elementCountInsideContainer = elementsContainer.length;
  const transformSpeed = 175 * elementCountInsideContainer

  elementsContainer.forEach(el => {
    let delay = 0; // 🔥 Reset delay per container

    const innerElements = el.querySelectorAll("*");
    innerElements.forEach(tag => {
      tag.style.transition = `transform ${transformSpeed}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`; // 🔥 Delay in ms
      tag.style.transform   = "translateY(0%)";
      delay += 100; // 🔥 Increase delay by 500ms (0.5s)
    });
  });
}

// function animateBannerText() {
//   // console.log('height', height)
//   if (window.scrollY > elements.y + (elements.height * 0.15)) {
//     const fadeDownEl = document.querySelector('.banner__logo [data-fade-down]');
//     const scrollFactor = window.scrollY === 0 ? 1 : window.scrollY;
//     fadeDownEl.style.transform = `translateY(${(14 * scrollFactor) * 0.04}px)`;
//   }
//   console.log('run')
//   elements.observeBannerAnimationId = requestAnimationFrame(animateBannerText)
// }