function readOnly() {
  throw new Error("Can not modify read only value.");
}

/**
 * Enum for style variations.
 * @readonly
 * @enum {string}
 */
export const VARIATIONS = new Proxy(
  {
    info: "info",
    warning: "warning",
    error: "error",
    offline: "offline",
    default: "info"
  },
  {
    get: (proxy, name) => {
      return proxy[name] === undefined ? proxy.info : proxy[name];
    },
    set: readOnly,
    setPrototypeOf: readOnly,
    deleteProperty: readOnly,
    preventExtensions: readOnly
  }
);

/**
 * Dismissed event, fired when alert is dismissed.
 * @memberof module:c/alert
 * @event Alert#dismissed
 */
export class DismissedEvent {
  constructor() {
    return new CustomEvent("dismissed", {
      bubbles: true,
      cancelable: true,
      composed: true
    });
  }
}
