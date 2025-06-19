import type { PubSubCallback } from "c/sfGpsDsPubSub";

/**
 * A basic pub-sub mechanism for sibling component communication.
 */

const callbacks: {
  [key: string]: Set<PubSubCallback>
} = {};

/**
 * Registers a callback for an event
 * @param {string} eventName - Name of the event to listen for.
 * @param {object} callbackobj - Contains callback function. Add uniqueObjectId in case of multiple calls being registered.
 */

function register(
  eventName: string, callbackobj: PubSubCallback
): void {
  if (!callbacks[eventName]) {
    callbacks[eventName] = new Set();
  }

  const found = callbackobj?.uniqueObjectId && 
    Array
      .from(callbacks[eventName])
      .some(item => item.uniqueObjectId === callbackobj.uniqueObjectId);

  if (!found) {
    callbacks[eventName].add(callbackobj);
  }
};

/**
 * Unregisters a callback for an event
 * @param {string} eventName - Name of the event to unregister from.
 * @param {object} callbackobj - Contains callback function. Add uniqueObjectId in case of multiple calls being registered.
 */

function unregister(
  eventName: string,
  callbackobj: PubSubCallback
): void {
  if (callbacks[eventName] && callbackobj?.uniqueObjectId) {
    callbacks[eventName].forEach(item => {
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
  shouldExecuteCallback: (_callback: PubSubCallback, _payload: any) => {
    return true;
  },
};

/**
 * Fires an event to listeners.
 * @param {string} eventName - Name of the event to fire.
 * @param {string} action - Name of the event to fire.
 * @param {*} payload - Payload of the event to fire.
 */

function fire(
  eventName: string, 
  action: string, 
  payload: any
): void {
  if (callbacks[eventName]) {
    callbacks[eventName].forEach(callback => {
      try {
        if (shouldExecuteCallbackHandler.shouldExecuteCallback(callback, payload)) {
          callback[action]?.(payload);
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
  shouldExecuteCallbackHandler,
};