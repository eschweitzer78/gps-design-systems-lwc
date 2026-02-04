export const EMPTY_OBJ = {};
export const EMPTY_ARR = [];
export const NOOP = () => {};

const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (val: any, key: any): boolean => hasOwnProperty.call(val, key);

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: any) => objectToString.call(value);
export const toRawType = (value: any) => toTypeString(value).slice(8, -1);
export const isPlainObject = (val: any) => toTypeString(val) === "[object Object]";

export const isArray = Array.isArray;
export const isMap = (val: any): boolean => toTypeString(val) === "[object Map]";
export const isSet = (val: any): boolean => toTypeString(val) === "[object Set]";
export const isRegEx = (val: any): boolean => toTypeString(val) === "[object RegExp]";
export const isFunction = (val: any): boolean => typeof val === "function";
export const isString = (val: any): boolean => typeof val === "string";
export const isSymbol = (val: any): boolean => typeof val === "symbol";
export const isObject = (val: any): boolean => val != null && typeof val === "object";
export const isPromise = (val: any): boolean => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  );
};

export const def = (obj: any, key: any, value: any, writable: boolean = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};

export const extend = Object.assign;

export function toNumber(val: any): number {
  if (typeof val === "number") return val;

  return parseFloat(val);
}

export function toArray<T = any>(value: T): T[] {
  return isArray(value) ? value : [value]
};
