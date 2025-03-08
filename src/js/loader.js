// run it after DOMContentLoaded
function Loader() {
  return new Promise((resolve) => {
    const preloader = document.querySelector('[data-preloader]')
    const line      = document.querySelector('[data-preloader-line]')
    const blinders  = document.querySelector('[data-preloader-blinders]')
    const svg       = document.querySelector('[data-preloader-svg]')

    line.setAttribute('data-preloader-line', true)
    setTimeout(() => {
      blinders.setAttribute('data-preloader-blinders', false)
    }, 501)

    setTimeout(() => {
      line.style.opacity = 0;
    }, 800)

    setTimeout(() => {
      blinders.setAttribute('data-preloader-blinders', true)
      // svg.setAttribute('data-preloader-svg', true)
    }, 801)

    setTimeout(() => {
      preloader.style.zIndex    = '-1';
      preloader.style.display   = 'none';
      preloader.setAttribute('data-preloader', 'false')
      document.body.style.overflow = "unset"
      resolve(true)
    }, 801 + 1000 + 165) // svg transition speed + delay
  })
}

class ObserveLoader {
  constructor(selectors) {
    const { preloader, first_visible_section } = selectors
    this.preloader = document.querySelector(preloader);
    this.container = document.querySelector(first_visible_section)

    if (!this.preloader || !this.container) {
      console.log('preloader/container is null')
      return
    }

    this.observer = new IntersectionObserver(this.handleIntersection(), { threshold: 0.1 });
    this.mutation = new MutationObserver(this.handleMutation)

    this.dependencies = [(params) => {}]
  }

  init(dependencies) {
    this.dependencies = [
      ...this.dependencies,
      ...dependencies.filter((dep) => typeof dep === "function")
    ]

    this.observer.observe(this.container)
    this.mutation.observe(this.preloader, { attributes: true, attributeFilter: ["data-loading"]}) // TODO: check attributeFilter
  }

  /***
   * Intersection Observer Callback 
   * Checks the preloader 
   * 
  */
  handleIntersection() {
    return (entries) => {
      entries.forEach((entry) => {
        const attr = this.preloader.getAttribute("data-preloader")
        if (!attr) {
          console.error('data-preloader was not set. further animations will be stopped here.')
          return
        }

        // if its still loading means the preloader is visible and the element underneath is expected to be this.container
        const isLoading = attr === "true" ? true : false; 

        if (!isLoading && entry.isIntersecting) {
          this.dependencies.forEach(dep => dep())
          this.observer.disconnect()
        } else {
          console.log("🚫 Entry is blocked or not intersecting.");
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
  handleMutation() {
    const attr = this.preloader.getAttribute('data-loading')
    if (!attr) return
    if (attr !== "false") return

    console.log("🚀 preloader finished, re-running observer!");
    this.observer.disconnect();
    this.observer.observe(this.container);
    this.mutation.disconnect(); // Stop observing once done
  }

  enableBoundary() {
    if (!this.container) {
      console.log('container is null')
      return
    }

    this.container.style.border = "20px dashed green"; // Debugging visual
  }
}