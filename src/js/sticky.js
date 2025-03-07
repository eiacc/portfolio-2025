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
  isIntersecting = false;

  constructor(parent_tag, child_tag, dot_tag) {
    this.parent = document.querySelector(parent_tag);
    this.child = document.querySelector(child_tag);
    this.dot = document.querySelector(dot_tag);

    if (!this.parent || !this.child || !this.dot) {
      console.error('Parent/Child/Dot is null');
      return;
    }

    this.lastScrollY = window.scrollY;
    this.children = Array.from(this.parent.querySelectorAll('[data-transform]'));
    if (this.children.length === 0) return;

    this.scroll = this.scroll.bind(this);
    this.init();

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      root: null,
      threshold: 1
    });

    this.observer.observe(this.child);
    window.addEventListener('scroll', this.scroll);
  }

  init() {
    const parentRect = this.parent.getBoundingClientRect();

    this.children.forEach(child => {
      const childRect = child.getBoundingClientRect();
      let childCurrentPos = childRect.top - parentRect.top;

      this.props.push({
        el: child,
        initialPos: childCurrentPos,
        targetPos: 15, // Fixed instead of random
        speed: 0.02, // Fixed speed for smoother animation
        tempY: 0
      });
    });
  }

  scroll() {
    if (!this.isIntersecting) return;

    requestAnimationFrame(() => {
      let currentScrollY = window.scrollY;
      const isGoingUp = this.isScrollingUp(currentScrollY);
      this.lastScrollY = currentScrollY;

      this.props.forEach(prop => {
        let tempY = (prop.initialPos + prop.targetPos) * prop.speed;
        prop.tempY = isGoingUp ? Math.max(prop.tempY - tempY, 0) : prop.tempY + tempY;
        prop.el.style.transform = `translateY(${prop.tempY}px)`;
      });

      // Circle movement
      const tempY = this.getScrollPercentage();
      const mapYScroll = this.mapScroll(45, tempY);
      this.dot.style.setProperty('--scale', `${mapYScroll}%`);
    });
  }

  getScrollPercentage() {
    const parentRect = this.parent.getBoundingClientRect();
    const parentHeight = this.parent.offsetHeight;
    const scrollInsideParent = -parentRect.top; // Keep negative value

    let percent = (scrollInsideParent / (parentHeight - window.innerHeight)) * 100;
    return Math.round(Math.max(0, Math.min(100, percent)));
  }

  mapScroll(min, scrollPercentage) {
    let m = ((scrollPercentage - min) / (100 - min)) * 100;
    return Math.round(Math.max(0, Math.min(100, m)));
  }

  isScrollingUp(currentScrollY) {
    return currentScrollY < this.lastScrollY;
  }

  onIntersect(entries) {
    this.isIntersecting = entries.some(entry => entry.isIntersecting);
  }

  destroy() {
    window.removeEventListener('scroll', this.scroll);
    this.observer.disconnect();
  }
}


