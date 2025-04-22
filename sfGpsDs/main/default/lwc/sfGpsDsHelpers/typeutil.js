export const EMPTY_OBJ = {};
export const EMPTY_ARR = [];
export const NOOP = () => {};

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val, key) => hasOwnProperty.call(val, key);

export const objectToString = Object.prototype.toString;
export const toTypeString = (value) => objectToString.call(value);
export const toRawType = (value) => toTypeString(value).slice(8, -1);
export const isPlainObject = (val) => toTypeString(val) === "[object Object]";

export const isArray = Array.isArray;
export const isMap = (val) => toTypeString(val) === "[object Map]";
export const isSet = (val) => toTypeString(val) === "[object Set]";
export const isRegEx = (val) => toTypeString(val) === "[object RegExp]";
export const isFunction = (val) => typeof val === "function";
export const isString = (val) => typeof val === "string";
export const isSymbol = (val) => typeof val === "symbol";
export const isObject = (val) => val !== null && typeof val === "object";
export const isPromise = (val) => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  );
};

export const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};

export const extend = Object.assign;

export function toNumber(val) {
  if (typeof val === "number") return val;

  return parseFloat(val);
}

export const toArray = (value) => (isArray(value) ? value : [value]);
