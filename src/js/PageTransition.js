class PageTransition {
  elements;
  dependency;
  preFetchElementsIds;

  previousKeyViewed;
  previousHTML;

  constructor(elements, dbInstance, lenis) {
    this.elements = document.querySelectorAll(elements)
    if (this.elements.length < 1) return

    this.db = dbInstance; // indexedDB
    this.preFetchElementsIds = new Set();
    
    this.previousKeyViewed   = "";
    this.previousHTML  = "";
    this.lenis  = lenis;

    this.closePageRendered = document.getElementById('closePageRender')
  }

  async init() {
    if (this.elements.length < 1) {
      console.error('class PageTransition constructor param "elements" is undefined.');
      return;
    }

    await this.retrieveAll();

    this.elements.forEach(el => {
      el.addEventListener('click', this.handleClick.bind(this))
      el.addEventListener('mouseenter', this.handleMouseEnter.bind(this), { once: true }) // fetch only once (preload page)
    })

    this.closePageRendered.addEventListener('click', this.popout.bind(this))
  }

  async handleClick(e) {
    e.preventDefault();

    let attr            = e.currentTarget.getAttribute('data-page');
    if (!attr)          return;

    attr                = attr.toLocaleLowerCase();
    const exists        = this.preFetchElementsIds.has(attr);
    if (!exists)         return;

    if (attr === this.previousKeyViewed) {
      this.popup(true)
      return
    }

    try {
      const req               = await this.db.getter("projects", attr);

      this.previousKeyViewed  = attr;
      this.previousHTML       = req.content;

      this.popup()
    } catch(error) {
      console.error(error)
    }
  }

  async handleMouseEnter(e) {
    let attr            = e.currentTarget.getAttribute('data-page');
    if (!attr)          return;

    attr                = attr.toLocaleLowerCase();
    const exists        = this.preFetchElementsIds.has(attr);
    if (exists)        return;

    const endpoint      = `/pages/${attr}.html`;
    try {
      const fetchHTML   = await fetch(endpoint);
      const result      = await fetchHTML.text();
      const parser      = new DOMParser();
      const doc         = parser.parseFromString(result, "text/html")
      const html        = JSON.stringify(doc.querySelector('.page').innerHTML)

      await this.db.setter('projects', { id: attr, content: html })

      // store ids in memory
      this.preFetchElementsIds.add(attr)
    } catch (error) {
      console.log(error)
    }
  }

  retrieveAll() {
    return new Promise((resolve, reject) => {
      // console.log('this db', this.db)
      const dbInstance      = this.db.dbInstance
      const tx              = dbInstance.transaction("projects", "readonly");
      const store           = tx.objectStore("projects")
      const getAllKeys      = store.getAllKeys()

      getAllKeys.onsuccess = () => {
        if (getAllKeys.result.length > 0) {
          getAllKeys.result.forEach(key => {
            this.preFetchElementsIds.add(key)
          })
        }
        resolve()
      }

      getAllKeys.onerror = () => reject('something went wrong after retrieving all keys')
    })
  }

  popup(same = false) {
    this.lenis.stop();

    const popup = document.getElementById('pageRender');

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    if (!same) {
      const div = document.createElement('div')
      div.innerHTML = JSON.parse(this.previousHTML);
      const node = div.firstElementChild
      popup.firstElementChild.appendChild(node);
    }

    const cursor = document.getElementById('cursor');
    cursor.classList = "cursor-size-max-enter";

    setTimeout(() => {
      popup.setAttribute('data-visible', true);
    }, 500)

    setTimeout(() => {
      cursor.classList = "cursor-size-max-enter-default"
    }, 600)
  }

  popout() {
    this.lenis.start();

    const popup = document.getElementById('pageRender');
    const cursor = document.getElementById('cursor');

    cursor.classList = "cursor-size-max-enter";

    popup.setAttribute('data-visible', false);

    document.body.style.overflow  = "unset";
    document.body.style.position  = "unset";
    document.body.style.top       = "unset";

    // const div = document.createElement('div')
    // div.innerHTML = JSON.parse(this.previousHTML);
    // const node = div.firstElementChild
    // popup.firstElementChild.appendChild(node);

    setTimeout(() => {
      cursor.classList = ""
    }, 150)
  }

  debounce(callback, delay = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay)
    }
  }
}