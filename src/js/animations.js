class Animations {
  /**
     * Initializes an animation with the given selectors and options.
     *
     * @param {("[data-fade-down]")} elements - The enum for elements.
     * @param {string} container - The container selector.
     * @param {number} speed - The speed of the animation.
     * @returns {void}
  */
  constructor(elements, container, speed, delayIncrement = 100) {
    this.container = document.querySelector(container)

    if (!this.container) {
      console.log('container is null');
      return
    }

    this.speed          = speed;
    this.delayIncrement = delayIncrement
    this.elements       = this.container.querySelectorAll(elements);
  }

  /**
     * Checks if the specified elements exist inside `this.container`
     * and triggers an animation if they are found.
     *
     * @returns {void} - Does not return anything.
  */
  stagger() {
    return (param) => {
      // console.log('test:', param)
      if (this.container && this.elements && this.elements.length < 1) {
        console.warn("there are no elements to stagger")
        return
      }

      const transformSpeed = this.speed * this.elements.length
  
      this.elements.forEach(element => {
        let delay = 0; // 🔥 Reset delay per container
  
        const innerElements = element.querySelectorAll("*");
        innerElements.forEach(tag => {
          tag.style.transition  = `transform ${transformSpeed}ms cubic-bezier(0.25, 1, 0.5, 1) ${delay}ms`; // 🔥 Delay in ms
          tag.style.transform   = "translateY(0%)";
          delay += this.delayIncrement; // 🔥 Increase delay by 100ms (0.1s)
        });
      });
    }
  }

  opacity() {
    return (param) => {
      if (this.container && this.elements && this.elements.length < 1) {
        console.warn("there are no elements to stagger")
        return
      }

      const transformSpeed = this.speed * this.elements.length

      let delay = 0; // 🔥 Reset delay per container
      this.elements.forEach(element => {
        element.style.transition  = `opacity ${transformSpeed}ms ease ${delay}ms`; // 🔥 Delay in ms
        element.style.opacity     = "1";
        delay += this.delayIncrement; // 🔥 Increase delay by 100ms (0.1s)
      });
    }
  }

  lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
  }
}