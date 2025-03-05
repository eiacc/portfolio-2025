export class SmoothScroll {
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