/**
 * @module ns/asyncUtils
 * @description This module exposes a collection of utilities designed to simplify asynchronous operations.
 */

/**
 * Delay the execution of a function for the given amount of time. Use to throttle the the
 * call rate of a method that can be repeatedly called.
 * @param {Function} func - Function to execute after the given duration.
 * @param {number} wait - Time in milliseconds to delay.
 * @param {boolean} immediate - When true, will execute on the front end onf the duration instead of after.
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    /** @todo apply all arguments! */
    let context = this,
      args = arguments[0]?.target;
    let later = function () {
      timeout = null;
      if (!immediate) func.call(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timeout = setTimeout(later, wait);
    if (callNow) func.call(context, args);
  };
}

/**
 * Delays execution in the form of a promise.
 * @param {number} waitFor - Number of milliseconds to delay by.
 * @param {*} [result] - Pass through a previous result.
 */
export function delay(waitFor, result) {
  return new Promise((resolve) => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => resolve(result), waitFor);
  });
}
