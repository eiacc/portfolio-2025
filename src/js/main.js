window.addEventListener("DOMContentLoaded", () => {
  handleLoader();
  observeBanner();

  const lenis = new Lenis({
    autoRaf: true,
    smooth: true, // Enables smooth scrolling
    lerp: 0.1, // Lower = smoother, Higher = snappier
    duration: 1, // Adjusts scroll ease duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function (optional)
  });

  if (window.innerWidth >= 768) {
    // cursor
    const cursor = document.getElementById("cursor");
    const pos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };
    const speed = 0.1;
    
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    function animateCursor() {
      pos.x += (mouse.x - pos.x) * speed;
      pos.y += (mouse.y - pos.y) * speed;
      
      cursor.style.setProperty("--x", `${pos.x}px`);
      cursor.style.setProperty("--y", `${pos.y}px`);
    
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover effect
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover-sm"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover-sm"));
    });
  }
  

  // Hover effect
  document.querySelectorAll("[data-letters]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover-xl"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover-xl"));
  });

  // animate
  const stickyParent = document.querySelector('#parallaxContainer')
  const stickyContainer = document.querySelector('.parallax')
  const scalingText = document.querySelector('.scaling-text')

  let animFrameId = null
  const options = { threshold: 0.1 }
  let percentage = 0

  const links = document.querySelectorAll('[data-scroll-to]')
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const attr = e.target.getAttribute('data-scroll-to')
      if (attr === '') {
        document.body.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      } else {
        document.getElementById(attr).scrollIntoView({
          behavior: "smooth",
          block: "start",  // "start", "center", "end", "nearest"
          inline: "nearest", // For horizontal scrolling
        })
      }
    })
  })

  const observer = new IntersectionObserver((entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate()
      } else {
        if (percentage > 50) {
          scalingText.style.setProperty('--scale', 100)
        } else {
          scalingText.style.setProperty('--scale', 1)
        }
        cancelAnimationFrame(animFrameId)
      }
    })
  }), options)
  observer.observe(stickyParent)

  function animate() {
    let tempPercentage = getStickyScrollPercentage(stickyContainer, stickyParent)

    if (tempPercentage !== percentage) {
      // console.log('perc', percentage)
      let scalePercentage = percentage <= 0 ? 1 : percentage;
      scalingText.style.setProperty('--scale', scalePercentage)
    }

    percentage = tempPercentage
    animFrameId = requestAnimationFrame(animate)
  }

  (() => {
    const { animate, stagger } = Motion;
    const works = document.getElementsByClassName('work')
    animate(
      works,
      { opacity: 1 },
      { delay: stagger(0.1, { startDelay: 0.2 }) }
    )
  })()
});

function getStickyScrollPercentage(stickyElement, container) {
  const containerRect = container.getBoundingClientRect();
  const stickyRect = stickyElement.getBoundingClientRect();

  // Get how far the sticky element has scrolled inside its container
  const relativeY = stickyRect.top - containerRect.top;

  // Prevent division by zero if container height is less than viewport height
  const scrollableHeight = containerRect.height - window.innerHeight;
  
  // Calculate percentage position of the sticky element inside its container
  const percentage = scrollableHeight > 0 ? (relativeY / scrollableHeight) * 100 : 0;

  return Math.min(Math.max(percentage, 1), 100); // Clamp between 0% and 100%
}