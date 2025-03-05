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
  const loader = document.getElementById("loader");
  const container = document.querySelector(".banner");
  // showBoundary(container, true)
  showBoundary(container)

  if (!container) {
    console.error("Banner section not found!");
    return;
  }

  const observer = new IntersectionObserver(handleIntersection(loader), { threshold: 0.1 });
  observer.observe(container);

  // 🔥 MutationObserver to track when loader finishes
  const mutationObserver = new MutationObserver(() => handleMutation(loader, container, observer, mutationObserver));
  mutationObserver.observe(loader, { attributes: true, attributeFilter: ["data-loading"] });
}

/**
 * Intersection Observer Callback
 * 
 * @param {HTMLElement} loader = Loader's container
 */
function handleIntersection(loader) {
  return (entries) => {
    entries.forEach((entry) => {
      const isLoading = loader.getAttribute("data-loading") === "true";
      
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
 * @param {HTMLElement} loader - Loader's container
 * @param {HTMLElement} container - Section we want to observe
 * @param {IntersectionObserver} observer - The IntersectionObserver instance
 * @param {MutationObserver} mutationObserver - The MutationObserver instance
 */
function handleMutation(loader, container, observer, mutationObserver) {
  if (loader.getAttribute("data-loading") === "false") {
    console.log("🚀 Loader finished, re-running observer!");
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
  const elementCountInsideContainer = 7;
  const transformSpeed = 175 * elementCountInsideContainer

  elementsContainer.forEach(el => {
    let delay = 0; // 🔥 Reset delay per container

    const innerElements = el.querySelectorAll("*");
    innerElements.forEach(tag => {
      tag.style.transition = `transform ${transformSpeed}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`; // 🔥 Delay in ms
      tag.style.transform = "translateY(0%)";
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