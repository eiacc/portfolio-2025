async function fetchPage(e) {
  e.preventDefault();
  try {
    const page = e.target.getAttribute('data-page')
    const url = `/pages/${page}.html`
    const req = await fetch(url, {
      method: "GET"
    })

    if (!req.ok) throw new Error('failed to fetch page: ', page)

    const res = await req.text();
    
    const indexedDB = window.indexedDB.open("TatsuyaProjects");
    console.log('indexdb', indexedDB)

    indexedDB.onerror = event => {
      console.error("Database error: " + event.target.errorCode);
    };
    indexedDB.onsuccess = event => {
      console.log('success', event.target.result);
    };

  } catch (error) {
    console.error(error)
  }
}

/*
  Read about this class here:
  https://github.com/eiacc/IndexedDB
*/
class IndexedDatabase {
  constructor(name = "projects", version = 0) {
    this.db         = window.indexedDB || window.mozIndexedDB || webkitIndexedDB || msIndexedDB || shimIndexedDB;
    this.dbState    = this.db ? true : false;
    this.dbRequest  = null;
    this.dbInstance = null;
    this.dbName     = name;
    this.dbVersion  = version;
  }

  init () {
    if (!this.dbState) return;

    this.dbRequest = this.db.open(this.dbName, this.dbVersion);
    this.dbRequest.onerror          = ((e) => this.#err(e));
    this.dbRequest.onupgradeneeded  = ((e) => this.#upgrade(e));
    this.dbRequest.onsuccess        = ((e) => this.#success(e));
  }

  #err(e) {
    console.log(`database error: ${e}`);
  }

  #upgrade(e) {
    const db = e.target.result
    if (!db.objectStoreNames.contains(this.dbName)) {
      db.createObjectStore(this.dbName, { keyPath: 'id', autoIncrement: true });
    }
  }

  #success(e) {
    console.log("Database opened successfully");
    this.dbInstance = e.target.result;
  }

  getter(objectStoreName, key) {
    return new Promise((resolve, reject) => {
      if (!this.dbInstance) return reject("Database not initialized");

      const tx          = this.dbInstance.transaction(objectStoreName, "readonly");
      const store       = tx.objectStore(objectStoreName);
      const request     = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror   = (e) => reject(`Error retrieving data: ${e.target.error}`);
    });
  }

  setter(objectStoreName, data) {
    return new Promise((resolve, reject) => {
      if (!this.dbInstance) return reject("Database not initialized");

      const tx          = this.dbInstance.transaction(objectStoreName, "readwrite");
      const store       = tx.objectStore(objectStoreName);
      const request     = store.put(data);

      request.onsuccess = () => resolve("Data saved successfully");
      request.onerror   = (e) => reject(`Error saving data: ${e.target.error}`);
    });
  }
}