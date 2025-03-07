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

// class PositionScroll {
//   constructor() {
//     this.scroll = window.scrollY;
//     this.state  = false;
//     this.speed  = 0.04;

//     this.handleScroll = this.handleScroll.bind(this)
//     window.addEventListener('scroll', this.handleScroll)
//   }

//   handleScroll() {
//     let currentScrollY = window.scrollY;

//     if (currentScrollY > scroll) {
//       console.log("Scrolling down");
//       this.state = false
//     } else if (currentScrollY < scroll) {
//       console.log("Scrolling up");
//       this.state = true
//     }

//     this.scroll = currentScrollY;
//   }

//   scrollPercentage(sticky, container) {
//     const containerRect = container.getBoundingClientRect();
//     const stickyRect    = sticky.getBoundingClientRect();

//     // Get how far the sticky element has scrolled inside its container
//     const relativeY = stickyRect.top - containerRect.top;

//     // Prevent division by zero if container height is less than viewport height
//     const scrollableHeight = containerRect.height - window.innerHeight;

//     // Calculate percentage position of the sticky element inside its container
//     const percentage = scrollableHeight > 0 ? ((relativeY / scrollableHeight) * 100) * this.speed : 0;

//     return Math.min(Math.max(percentage, 1), 100); // Clamp between 0% and 100%
//   }
// }

// class ExpandScroll {
//   constructor(props) {
//     const { el, sticky, parent } = props;

//     this.el         = document.getElementById(el)
//     this.parent     = document.getElementById(parent)
//     this.sticky     = document.getElementById(sticky)

//     this.lastScroll = window.scrollY
//     if (!this.el || !this.parent || !this.sticky) console.error(`el/sticky/parent might be null.`)
  
//     this.listen = this.listen.bind(this)
//     window.addEventListener('scroll', this.listen)
//   }

//   listen() {
//     if (tempPercentage >= 10 && tempPercentage <= 70) {
//       tempScale.top = 10 + ((tempPercentage / 100) * (70 - 10));
//       expansion.style.setProperty('top', `${tempScale.top}%`)
//     }

//     if (tempPercentage > 70 && tempPercentage <= 100) {
//       tempScale.width = 10 + ((tempPercentage / 100) * (70 - 10));
//       expansion.style.setProperty('--width', `${tempScale.top}%`)
//     }
//   }
// }

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
    // this.elements.forEach(i => i.addEventListener('click', this.clickHandler))
    document.body.addEventListener('click', this.clickHandler)
  }

  /**
   * 
   * @param {MouseEvent} e - click event object
   * @returns 
   */
  clickHandler(e) {
    console.log('log')
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