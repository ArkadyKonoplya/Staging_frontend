export const localStorageHelper = {
  /**
   * load
   * gets the item from local storage
   *
   * @param {string} key - the key of the item stored on local storage
   * @returns the saved item
   */
  load(key) {
    const stored = localStorage.getItem(key);
    return stored === null ? null : JSON.parse(stored);
  },

  /**
   * store
   * saves the item into local storage
   *
   * @param {string} key - the key of the item to save the data as
   * @param {*} value - value to be saved
   * @returns returns a reference to the local storage object
   */
  store(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * modify
   * gets the item from local-storage using the key and updates an item saved on local storage
   *
   * @param {string} key - the key of the item to save the data as
   * @param {function name(params) {}} fn - a callback function to update the data
   * @returns returns a reference to the local storage object
   */
  modify(key, fn) {
    this.store(key, fn(this.load(key)));
  },
};
