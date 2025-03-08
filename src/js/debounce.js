function debounce(callback, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), delay)
  }
}
