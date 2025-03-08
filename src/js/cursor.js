/** 
 * This class handles the animation for shadow cursor that follows the actual cursor.
 * The animation includes the following:
 *    hover: scales up/down the size of shadow cursor
 *    movement: the cursor's movement
 * 
 * Disable this animation on smaller screen sizes (table, phones)
 * 
 * Other deps needed:
 *  css: cursor.css
 *  tag: html element for the shadow cursor should have an id
 * 
 * */
class CustomCursor {
  cursor;
  #elements;

  constructor(tag) {
    this.cursor = document.getElementById(tag);

    if (!this.cursor) {
      console.error('missing element')
      return
    }

    this.pos    = { x: 0, y: 0 };
    this.mouse  = { x: 0, y: 0 };
    this.speed  = 0.1;

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
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  /**
   * Handles mouse enter event.
   * @param {MouseEvent} e
   * @private
   */
  #enter = (e) => {
    const attr = e.target.getAttribute('data-cursor-size')
    this.cursor.classList.add(`cursor-size-${attr}`);
  };

  /**
   * Handles mouse leave event.
   * @param {MouseEvent} e
   * @private
   */
  #leave = (e) => {
    const attr = e.target.getAttribute('data-cursor-size')
    this.cursor.classList.remove(`cursor-size-${attr}`);
  };

  /**
   * @param {string} tag - element selector
   */
  hover(tag) {
    // if (window.innerWidth < 768) {
    //   console.log('custom cursor disabled for phone')
    //   return
    // }
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

    this.cursor.style.setProperty("--x", `${(this.pos.x).toFixed(2)}px`);
    this.cursor.style.setProperty("--y", `${(this.pos.y).toFixed(2)}px`);

    requestAnimationFrame(this.animate);
  }
}