import isSessionStorageSupported from "./isSessionStorageSupported";

const localStore = {};

const localStoreMethods = {
  getItem: (key) => {
    if (isSessionStorageSupported()) {
      return sessionStorage.getItem(key);
    }
    return localStore[key] ? localStore[key] : null;
  },
  setItem: (key, value) => {
    if (isSessionStorageSupported()) {
      sessionStorage.setItem(key, value);
    } else {
      localStore[key] = value;
    }
  },
  removeItem: (key) => {
    delete localStore[key];
  }
};

export default localStoreMethods;
