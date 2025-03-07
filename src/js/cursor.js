/** make sure we have cursor.css for styling */
class CustomCursor {
  cursor;
  #elements;

  constructor(tag) {
    if (window.innerWidth < 768) {
      console.log('custom cursor disabled for phone')
      return
    }

    this.cursor = document.getElementById(tag);

    if (!this.cursor) {
      console.error('missing element')
      return
    }

    this.pos    = { x: 0, y: 0 };
    this.mouse  = { x: 0, y: 0 };
    this.speed  = 0.1;

    // this.enter = this.enter.bind(this);
    // this.leave = this.leave.bind(this)

    this.move = this.move.bind(this)
    window.addEventListener('mousemove', this.move)

    this.animate = this.animate.bind(this)

    this.animate()
  }

  /**
   * 
   * @param {MouseEvent} e 
   */
  move(e) {
    if (window.innerWidth < 768) {
      console.log('custom cursor disabled for phone')
      return
    }
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  /**
   * Handles mouse enter event.
   * @param {MouseEvent} e
   * @private
   */
  #enter = (e) => {
    if (window.innerWidth < 768) {
      console.log('custom cursor disabled for phone')
      return
    }
    const attr = e.target.getAttribute('data-cursor-size')
    this.cursor.classList.add(`cursor-size-${attr}`);
  };

  /**
   * Handles mouse leave event.
   * @param {MouseEvent} e
   * @private
   */
  #leave = (e) => {
    if (window.innerWidth < 768) {
      console.log('custom cursor disabled for phone')
      return
    }
    const attr = e.target.getAttribute('data-cursor-size')
    this.cursor.classList.remove(`cursor-size-${attr}`);
  };

  /**
   * @param {string} tag - element selector
   */
  hover(tag) {
    if (window.innerWidth < 768) {
      console.log('custom cursor disabled for phone')
      return
    }
    this.#elements = document.querySelectorAll(tag)

    if (this.#elements.length < 1) {
      console.error('no elements to hover')
      return
    }

    this.#elements.forEach((el) => {
      el.addEventListener("mouseenter", (e) => this.#enter(e));
      el.addEventListener("mouseleave", (e) => this.#leave(e));
    });
  }

  animate() {
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

    this.cursor.style.setProperty("--x", `${this.pos.x}px`);
    this.cursor.style.setProperty("--y", `${this.pos.y}px`);

    requestAnimationFrame(this.animate);
  }
}