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
class StickySection {
  props = [];
  lastScrollY = 0;
  isIntersecting = false;
  ticking = false; // Throttle variable

  constructor(parent_tag, child_tag, dot_tag) {
    this.parent = document.querySelector(parent_tag);
    this.child = document.querySelector(child_tag);
    this.dot = document.querySelector(dot_tag);

    if (!this.parent || !this.child || !this.dot) {
      console.error("Parent/Child/Dot is null");
      return;
    }

    this.lastScrollY = window.scrollY;
    this.children = Array.from(this.parent.querySelectorAll("[data-transform]"));
    if (this.children.length === 0) return;

    this.init();

    this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
      root: null,
      threshold: 0.8, // Reduced sensitivity
    });

    this.observer.observe(this.child);
    window.addEventListener("scroll", this.onScroll.bind(this), { passive: true });

    this.dependency = () => {};
  }

  init(dependency) {
    if (dependency && typeof dependency === "function") this.dependency = dependency

    this.children.forEach((child) => {
      this.props.push({
        el: child,
        initialPos: 0,
        targetPos: Math.random() * (100 - 25) + 25, // Fixed instead of random
        speed: Math.random() * (0.04 - 0.02) + 0.02, // Fixed speed for smoother animation
        tempY: 0,
      });
    });
  }

  onScroll() {
    if (!this.isIntersecting || this.ticking) return;

    this.ticking = true;
    requestAnimationFrame(() => {
      this.updateScroll();
      this.ticking = false;
    });
  }

  updateScroll() {
    let currentScrollY = window.scrollY;
    const isGoingUp = this.isScrollingUp(currentScrollY);
    this.lastScrollY = currentScrollY;

    this.props.forEach((prop) => {
      let tempY = (prop.initialPos + prop.targetPos) * prop.speed;
      let newY = isGoingUp ? Math.max(prop.tempY + tempY, 0) : prop.tempY - tempY;
      
      prop.tempY = this.lerp(prop.tempY, newY, 1);
      
      prop.el.style.transform = `translateY(${prop.tempY}px)`;
    });

    // Circle movement
    const tempY = this.getScrollPercentage();
    const mapYScroll = this.mapScroll(10, tempY);
    this.dot.style.setProperty("--scale", `${mapYScroll}%`);
  }

  lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
  }

  getScrollPercentage() {
    const parentRect = this.parent.getBoundingClientRect();
    const parentHeight = this.parent.offsetHeight;
    const scrollInsideParent = -parentRect.top;

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
    this.isIntersecting = entries.some((entry) => {
      if (!this.isIntersecting && entry.isIntersecting) {
        this.dependency() // run animation
      }

      return entry.isIntersecting
    });
  }

  destroy() {
    window.removeEventListener("scroll", this.onScroll);
    this.observer.disconnect();
  }
}



