/*
  insider parent element
    this.parent.getBoundingClientRect().top <= 0

  parent element cannot be seen on screen:
    this.parent.getBoundingClientRect().top * -1

  child element hits the last available space for parent & I also think when scroll start from bottom going to top,
  this is the ideal checkpoint
    if (this.parent.getBoundingClientRect().top === (this.parent.getBoundingClientRect().top * -1) - this.child.getBoundingClientRect().height)       

  percentage passed as we scroll to bottom
    ((this.parent.getBoundingClientRect().top * -1) / this.parent.getBoundingClientRect().height) * 100
*/

class StickyScroll {
  parent    = null;
  child     = null;
  animId    = null;
  scroll    = 0;
  speed     = 0.04; // similar to custom smooth scroll
  // isOutside = true;
  tick      = 0;
  isTicking = false;
  topOffset = 15; // positive means top bound + the offset (outside), else reverse
  isOutside = null;

  constructor(props) {
    this.parent = document.getElementById(props.parent)
    this.child  = document.getElementById(props.child)

    if (!this.parent || !this.child) {
      console.error('emulate sticky parent or child element  is null')
    }
  }

  cancelAnimation() {
    /**
     * approaching target boundary check
     */
    const parent  = this.parent.getBoundingClientRect()
    const child   = this.child.getBoundingClientRect()

    const pt = Math.floor(parent.top)
    const ph = parent.height
    const ct = Math.floor(child.top)
    const ch = child.height

    if (parent.top > 0) {
      console.log('outside the boundary')
      this.child.classList.remove('fixed')
      // cancelAnimationFrame(this.animId)
      return true
    }

    if (pt >= ph - ch) {
      console.log('outside the boundary')
      this.child.classList.remove('fixed')
      // cancelAnimationFrame(this.animId)
      return true
    }

    return false
  }

  outsideToTop(pt) {
    if (pt > -10) {
      this.child.classList.remove('fixed')
      this.outside = null;
      return true
    }

    return false
  }

  outsideToBottom(pt) {

  }

  containers() {
    if (!this.parent || !this.child) return false
    return true
  }

  init () {
    if (!this.containers()) return
    this.animate()
  }

  animate() {

    const parent = this.parent.getBoundingClientRect()
    const child   = this.child.getBoundingClientRect()

    const pt = parent.top
    const ph = parent.height
    const ct = child.top
    const ch = child.height

    if (!(this.child.classList.contains('fixed'))) this.child.classList.add('fixed')
    if (this.outsideToTop(pt)) return


    // const childHeight = Math.floor(this.child.getBoundingClientRect().height);
    // const lowerBound = Math.floor((height - childHeight) * -1);

    // if (top >= lowerBound && top <= 0) {
    //   // this.scroll = Math.floor(((top * -1) / height) * 100)
    //   this.scroll = Math.floor((top * -1) / height)
    //   // this.child.style.top = `calc(${this.scroll} - ${childHeight}px)`;
    //   console.log(this.child)
    //   // this.child.style.setProperty('--top', `calc(${this.scroll}% - ${childHeight}px)`)
    //   // this.child.style.setProperty('--top', `${(this.scroll - 0) * this.speed}%`)
    //   this.child.style.setProperty('--top', `${(this.scroll - 0) * this.speed}px`)
    //   console.log('inside');
    // }

    // stop if we are going lower
    // console.log('top', top)
    // if (top >= (height - this.child.getBoundingClientRect().height) * -1) {
    // }

    // console.log(top)
    // console.log((height - this.child.getBoundingClientRect().height) * -1)

    // console.log('inside the container')

    // this.tick += 1;

    // // early exit if tick hits 1 sec
    // if (this.tick <= 61) {
    //   cancelAnimationFrame(this.animId)
    //   return
    // }

    // this.tick = 0;
    // this.isTicking = false
    console.log('passed railguard?')


    // this.animId = requestAnimationFrame(() => this.animate());
  }
}

// class StickySection {
//   lastScrollY = 0;
//   observer = null;
//   isScrolling = false;

//   constructor(tag) {
//     this.parent = document.querySelector(tag);
//     if (!this.parent) {
//       console.error('Parent is null');
//       return;
//     }

//     this.lastScrollY = window.scrollY;
//     this.children = this.parent.querySelectorAll('[data-transform]');
//     this.scroll = this.scroll.bind(this);
//     this.observe();
//   }

//   init() {
//     if (this.children.length < 1) return;
//   }

//   observe() {
//     const options = {
//       root: null, // Observe relative to viewport
//       threshold: 0.1, // When 10% of the section is visible
//     };

//     this.observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           this.startScroll();
//         } else {
//           this.stopScroll();
//         }
//       });
//     }, options);

//     this.observer.observe(this.parent);
//   }

//   startScroll() {
//     if (!this.isScrolling) {
//       window.addEventListener('scroll', this.scroll);
//       this.isScrolling = true;
//     }
//   }

//   stopScroll() {
//     if (this.isScrolling) {
//       window.removeEventListener('scroll', this.scroll);
//       this.isScrolling = false;
//     }
//   }

//   scroll() {
//     if (this.props.length < 1) return;

//     let currentScrollY = window.scrollY;
//     const isGoingUp = this.scrollState(currentScrollY);
//     this.lastScrollY = currentScrollY;

//     this.children.forEach(child => {
//       const p = this.child.parentElement.getBoundingClientRect();
//       const c = this.child.getBoundingClientRect();

//       const pt = p.top + currentScrollY
//       const ct = c.top + currentScrollY

//       let childCurrentPos = ct - pt
//       const ph = p.height / (Math.random() * (4 - 2) + 2);
//       const ch = c.height / (Math.random() * (4 - 2) + 2);

//       let childTargetPos = Math.random() * (ph - ch) + ch;
//       let speed = Math.random() * (0.07 - 0.01) + 0.01;

//       let tempY = (childCurrentPos - childTargetPos) * speed;
//       child.style.transform = `translateY(${tempY}px)`;
//     });
//   }

//   scrollState(currentScrollY) {
//     return currentScrollY < this.lastScrollY;
//   }

//   destroy() {
//     this.stopScroll();
//     if (this.observer) {
//       this.observer.disconnect();
//     }
//   }
// }

class StickySection {
  props = [];
  lastScrollY = 0;

  constructor(parent_tag, child_tag, dot_tag) {
    this.parent   = document.querySelector(parent_tag);
    this.child    = document.querySelector(child_tag)
    this.dot      = document.querySelector(dot_tag)

    if (!this.parent || !this.child || !this.dot) {
      console.error('Parent/Child/Dot is null');
      return;
    }

    this.lastScrollY = window.scrollY;
    this.children = [...this.parent.querySelectorAll('[data-transform]')];

    this.scroll = this.scroll.bind(this);
    this.init(); // Initialize child properties

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      root: null, // Observe within viewport
      threshold: 1 // Trigger when at least 10% of parent is visible
    });

    this.observer.observe(this.child);
  }

  init() {
    if (this.children.length < 1) return;

    this.children.forEach(child => {
      const parentRect = this.parent.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();

      let childCurrentPos = childRect.top - parentRect.top;
      let ph = parentRect.height / (Math.random() * (4 - 2) + 2);
      let ch = childRect.height / (Math.random() * (4 - 2) + 2);
      let childTargetPos = Math.random() * (21 - 3) + 3;
      let speed = Math.random() * (0.03 - 0.01) + 0.01;

      this.props.push({
        el: child,
        initialPos: childCurrentPos,
        targetPos: childTargetPos,
        speed,
        tempY: 0
      });
    });
  }

  scroll() {
    if (this.props.length < 1) return;

    let currentScrollY = window.scrollY;
    const isGoingUp = this.scrollState(currentScrollY);
    this.lastScrollY = currentScrollY;

    this.props.forEach(prop => {
      let tempY = (prop.initialPos + prop.targetPos) * prop.speed;

      if (isGoingUp) {
        // Ensure it doesn't go above its original Y position
        prop.tempY = Math.max(prop.tempY - tempY, 0);
      } else {
        prop.tempY += tempY;
      }

      prop.el.style.transform = `translateY(${prop.tempY}px)`;
    });

    // circle
    // const p = this.parent.getBoundingClientRect()
    // const c = this.child.getBoundingClientRect()
    const tempY = this.getScrollPercentage()
    if (tempY >= 15) {
      const mapYScroll = this.mapScroll(45, tempY)
      console.log('y', mapYScroll)
      this.dot.style.setProperty('--perc', mapYScroll + '%')
    }
  }

  getScrollPercentage() {
    const parentRect    = this.parent.getBoundingClientRect();
    const parentHeight  = this.parent.offsetHeight; // Actual rendered height in pixels

    // Amount scrolled inside parent
    const scrollInsideParent = Math.abs(parentRect.top);

    // Normalize to percentage
    let percent = (scrollInsideParent / (parentHeight - window.innerHeight)) * 100;

    // Clamp between 0% and 100%
    return Math.round(Math.max(0, Math.min(100, percent)));
  }

  mapScroll(min, scrollPercentage) {
    const minScroll = min; // 20% of parent scroll is 0% of `m`
    const maxScroll = 100; // 100% of parent scroll is 100% of `m`

    // Normalize scrollPerc to the `m` range (0% to 100%)
    let m = ((scrollPercentage - minScroll) / (maxScroll - minScroll)) * 100;

    // Clamp between 0% and 100%
    return Math.round(Math.max(0, Math.min(100, m)));
  }

  scrollState(currentScrollY) {
    return currentScrollY < this.lastScrollY;
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', this.scroll);
      } else {
        window.removeEventListener('scroll', this.scroll);
      }
    });
  }

  destroy() {
    window.removeEventListener('scroll', this.scroll);
    this.observer.disconnect();
  }
}


