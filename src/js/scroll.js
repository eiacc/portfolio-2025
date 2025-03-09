class SmoothScroll {
  /**
   * @param {string} element_id
   * @returns void
   */
  constructor(element_id) {
    const body        = document.body;

    this.offset       = 0;
    this.speed        = 0.075;
    this.wrapper      = document.getElementById(element_id);

    this.height       = this.wrapper.getBoundingClientRect().height - 1;
    body.style.height = Math.floor(this.height) + "px";

    // Bind the activate method to the current instance
    this.activate = this.activate.bind(this)
  }

  activate() {
    this.offset += window.scrollY < -0.1 ? 0 : (window.scrollY - this.offset) * this.speed;

    this.wrapper.style.transform = `translateY(-${this.sanitizeOffset(this.offset)}px) translateZ(0)`;

    requestAnimationFrame(this.activate)
  }

  sanitizeOffset(value) {
    return Math.abs(value) < 1e-3 ? 0 : value;
  }
}

class ViewSectionScroll {
  /**
   * 
   * @param {string} tag - element selector
   * @returns void
   */
  constructor(tag) {
    this.elements = document.querySelectorAll('[data-scroll-to]')
    
    if (!this.elements) {
      console.error('missing | unknown elements')
      return
    }

    this.clickHandler = this.clickHandler.bind(this)
  }

  init() {
    this.elements.forEach(i => i.addEventListener('click', this.clickHandler))
  }

  /**
   * 
   * @param {MouseEvent} e - click event object
   * @returns 
   */
  clickHandler(e) {
    console.log('log', e.target)
    const el = e.target.closest('[data-scroll-to]');
    if (!el) return; // Click outside elements should be ignored

    e.preventDefault();
    const attr    = e.target.getAttribute('data-scroll-to')

    const target  = document.getElementById(attr);

    if (!target) {
      document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return
    }

    target.scrollIntoView({
      behavior  : "smooth",
      block     : "start",  // "start", "center", "end", "nearest"
      inline    : "nearest", // For horizontal scrolling
    })
  }
}