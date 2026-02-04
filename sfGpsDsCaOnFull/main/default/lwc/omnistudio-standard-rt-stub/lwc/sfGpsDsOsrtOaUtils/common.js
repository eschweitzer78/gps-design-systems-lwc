import { ShowToastEvent } from "lightning/platformShowToastEvent";
import OAErrorLabel from "@salesforce/label/c.sfGpsDsOsrtOAErrorLabel";

/**
 * showToastMessage Displays the Salesforce Toast Message
 * @param componentRef: instance of the lwc component eg: this
 * @param title: string, title of the message
 * @param message: string , body of the message
 * @param variant: string, it can be error/success/warning/info
 */
const showToastMessage = (componentRef, title, message, variant) => {
  componentRef.dispatchEvent(
    new ShowToastEvent({
      title,
      message,
      variant
    })
  );
};

/**
 * handleError Displays the error message by parsing the error body
 * @param componentRef: instance of the lwc component eg: this
 * @param error: any, error message of any type.
 * @param displayToastMessage: boolean, Show toast message flag, default value is true
 */
const handleError = (componentRef, error, displayToastMessage = true) => {
  let errorMessage = "";
  if (error) {
    if (error.body) {
      if (typeof error.body === "string") {
        try {
          error.body = JSON.parse(error.body);
        } catch (err) {
          //Silent
        }
      }
      if (Array.isArray(error.body)) {
        errorMessage = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        errorMessage = error.body.message;
      }
    }
    errorMessage = errorMessage || error.message || error;
    console.error(error);
  }
  if (errorMessage && displayToastMessage) {
    showToastMessage(componentRef, OAErrorLabel, errorMessage, "error");
  }
};
/**
 * getInterpolatedFields returns list of template variables used in the string
 * @param input: string
 * @returns []
 * eg: input = 'https://www.googletagmanager.com/gtm.js?id=${id}';
 * Output: ['id']
 */
const getInterpolatedFields = (input) => {
  const regex = /(?:^|\W)\${(\w+)(?!\w)/g;
  let match;
  const matches = new Set();
  while ((match = regex.exec(input))) {
    matches.add(match[1]);
  }
  return [...matches];
};

/**
 * getDynamicFields returns list of percentage variables used in the string
 * @param input: string
 * @returns []
 * eg: input = `
 * 'event': 'addToCart',
    'ecommerce': {
        'currencyCode': '%currency%',
        'add': {
        'products': [{
            'name': '%product_name%',
            'id': '%product_id%',
        }]
        }
    }`
 * Output: ['currency', 'product_name', 'product_id']
 */
const getDynamicFields = (input) => {
  const regex = /(?:^|\W)%(\w+)(?!\w)/g;
  let match;
  const matches = new Set();
  while ((match = regex.exec(input))) {
    matches.add(match[1]);
  }
  return [...matches];
};

/**
 * generateHash
 * @returns Returns the unique string with timestamp and random value
 */
const generateHash = () => {
  // Timestamp + Math.random to generate unique hash to avoid collisions
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters after the decimal.
  return `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * debounce: Handles calling a method with certain delay
 * @param {function} callback Function to be called after delay
 * @param {number} delay Delay in milliseconds
 */
const debounce = function (callback, delay) {
  clearTimeout(this.timeout);
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  this.timeout = setTimeout(callback, delay);
};

/**
 * setCookie: Creates a new cookie
 * @param {name} name of the cookie
 * @param {value} value of the cookie
 * @param {expireDays} expiring days of the cookie
 */
const setCookie = (name, value, expireDays) => {
  let expires = "";
  if (expireDays) {
    const currentDate = new Date();
    currentDate.setTime(
      currentDate.getTime() + expireDays * 24 * 60 * 60 * 1000
    );
    expires = "expires=" + currentDate.toUTCString();
  }
  document.cookie = name + "=" + value + ";" + expires;
};

/**
 * getCookie: returns cookie details
 * @param {name} name of the cookie
 * @returns value of the cookie
 */
const getCookie = (name) => {
  const cookieName = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
};

/**
 * formatDate: returns formatted date in YYYY-MM-DD format
 * @param {date} input date object
 * @returns formatted date in YYYY-MM-DD format
 */
const formatDate = (date) => {
  if (date instanceof Date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
};

/**
 * removeEmptyKeys: Removes keys from the object whose value is null, undefiend or ''
 * It removes all the empty keys recursively to nested levels
 * @param {inputObject} object from which keys are to be removed
 */
const removeEmptyKeys = (inputObject) => {
  if (typeof inputObject === "object") {
    if (Array.isArray(inputObject)) {
      inputObject.forEach((eachObject) => {
        removeEmptyKeys(eachObject);
      });
    } else {
      for (let prop in inputObject) {
        if (typeof inputObject[prop] === "object") {
          removeEmptyKeys(inputObject[prop]);
        } else {
          if (
            inputObject[prop] === null ||
            inputObject[prop] === undefined ||
            inputObject[prop] === ""
          ) {
            delete inputObject[prop];
          }
        }
      }
    }
  }
};

/**
 * transformObjectKeysToLowerCase
 * @param {inputObject} object from which new object will be created with lowercase keys
 */
const transformObjectKeysToLowerCase = (inputObject) => {
  const resultObject = {};
  if (inputObject && typeof inputObject === "object") {
    for (let prop in inputObject) {
      if (prop) {
        resultObject[prop.toLowerCase()] = inputObject[prop];
      }
    }
  }
  return resultObject;
};

/**
 * renameKeys - Creates a new object with the own properties of the provided object, but the keys renamed according to the
 * keysMap object as {oldKey: newKey}.
 * If the key is not found in the keysMap, then it's passed as-is
 * @param {object} keysMap
 * @param {object} obj
 */

const renameKeys = (keysMap, obj) => {
  return Object.keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
};

export {
  showToastMessage,
  handleError,
  getInterpolatedFields,
  generateHash,
  debounce,
  setCookie,
  getCookie,
  getDynamicFields,
  formatDate,
  removeEmptyKeys,
  transformObjectKeysToLowerCase,
  renameKeys
};
