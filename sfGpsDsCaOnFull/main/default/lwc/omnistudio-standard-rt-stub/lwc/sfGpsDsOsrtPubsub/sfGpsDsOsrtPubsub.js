/**
 * A basic pub-sub mechanism for sibling component communication.
 */

const callbacks = {};

/**
 * Registers a callback for an event
 * @param {string} eventName - Name of the event to listen for.
 * @param {object} callbackobj - Contains callback function. Add uniqueObjectId in case of multiple calls being registered.
 */
const register = (eventName, callbackobj) => {
  if (!callbacks[eventName]) {
    callbacks[eventName] = new Set();
  }
  if (callbackobj && callbackobj.uniqueObjectId) {
    let isobjectPresent = false;
    callbacks[eventName].forEach((item) => {
      if (item.uniqueObjectId === callbackobj.uniqueObjectId) {
        isobjectPresent = true;
      }
    });
    if (!isobjectPresent) {
      callbacks[eventName].add(callbackobj);
    }
  } else {
    callbacks[eventName].add(callbackobj);
  }
};

/**
 * Unregisters a callback for an event
 * @param {string} eventName - Name of the event to unregister from.
 * @param {object} callbackobj - Contains callback function. Add uniqueObjectId in case of multiple calls being registered.
 */
const unregister = (eventName, callbackobj) => {
  if (callbacks[eventName] && callbackobj && callbackobj.uniqueObjectId) {
    callbacks[eventName].forEach((item) => {
      if (item.uniqueObjectId === callbackobj.uniqueObjectId) {
        callbacks[eventName].delete(item);
      }
    });
  } else if (callbacks[eventName]) {
    callbacks[eventName].delete(callbackobj);
  }
};

/**
 * Wrapper object for shouldExecuteCallback method.
 * shouldExecuteCallback - Used as a check before executing the callback. Always true is returned.
 * This function can be overridden to implement a check before executing the callback.
 *
 */
const shouldExecuteCallbackHandler = {
  shouldExecuteCallback: () => {
    return true;
  }
};

/**
 * Fires an event to listeners.
 * @param {string} eventName - Name of the event to fire.
 * @param {string} action - Name of the event to fire.
 * @param {*} payload - Payload of the event to fire.
 */
const fire = (eventName, action, payload) => {
  if (callbacks[eventName]) {
    callbacks[eventName].forEach((callback) => {
      try {
        if (
          shouldExecuteCallbackHandler.shouldExecuteCallback(callback, payload)
        ) {
          callback[action] && callback[action](payload);
        }
      } catch (error) {
        // fail silently
      }
    });
  }
};

export default {
  register,
  unregister,
  fire,
  shouldExecuteCallbackHandler
};
