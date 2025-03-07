// run it after DOMContentLoaded
function handleLoader() {
  return new Promise((resolve) => {
    const preloader = document.querySelector('[data-preloader]')
    const line      = document.querySelector('[data-preloader-line]')
    const blinders  = document.querySelector('[data-preloader-blinders]')
    const svg       = document.querySelector('[data-preloader-svg]')
  
    line.setAttribute('data-preloader-line', true)
    setTimeout(() => {
      blinders.setAttribute('data-preloader-blinders', false)
    }, 501)
  
    setTimeout(() => {
      line.style.opacity = 0;
    }, 800)
  
    setTimeout(() => {
      blinders.setAttribute('data-preloader-blinders', true)
      svg.setAttribute('data-preloader-svg', true)
    }, 801)
  
    setTimeout(() => {
      preloader.style.zIndex = '-1';
      // blinders.setAttribute('data-preloader-blinders', true)
      // svg.setAttribute('data-preloader-svg', true)
      preloader.style.display = 'none';
      resolve(true)
    }, 801 + 1200 + 165) // svg transition speed + delay
  })
}