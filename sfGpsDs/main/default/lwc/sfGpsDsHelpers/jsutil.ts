/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export function deepCopy(
  obj: any
): any {
  if (Object(obj) !== obj) {
    return obj;
  }
  if (obj instanceof Set) {
    return new Set(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (typeof obj === "function") {
    return obj.bind({});
  }
  if (Array.isArray(obj)) {
    const obj2 = [];
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      obj2.push(deepCopy(obj[i]));
    }
    return obj2;
  }
  const result = Object.create({});
  let keys = Object.keys(obj);
  if (obj instanceof Error) {
    keys = Object.getOwnPropertyNames(obj);
  }

  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    result[key] = deepCopy(obj[key]);
  }
  return result;
}

export function arraysEqual(
  array1: any[] | null, 
  array2: any[] | null
): boolean {
  if (!array1 || !array2) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  for (let index = 0; index < array1.length; index++) {
    if (array1[index] instanceof Array && array2[index] instanceof Array) {
      if (!arraysEqual(array1[index], array2[index])) {
        return false;
      }
    } else if (array1[index] !== array2[index]) {
      return false;
    }
  }

  return true;
}

export function debounce(
  func: Function, 
  delay: number, 
  options?: {
    leading?: boolean
  }
): (...args: any[]) => void {
  const _options = options || {};
  let invokeLeading = _options.leading;
  let timer: NodeJS.Timeout | string | number;

  return (...args: any[]): void => {
    if (invokeLeading) {
      // @ts-ignore
      func.apply(this, args);
      invokeLeading = false;
    }

    clearTimeout(timer);

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args);
      invokeLeading = _options.leading;
    }, delay);
  };
}

export function once(
  func: Function
): (...args: any[]) => void {
  let called = false;

  return function () {
    if (!called) {
      called = true;
      // @ts-ignore
      func.apply(this, arguments);
    }
  };
}

export function invokeArrayFns(
  fns: Function[],
  ...args: any[]
): any {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...args);
  }
};

export function hasChanged(
  value: any, 
  oldValue: any
): boolean {
  return !Object.is(value, oldValue);
}
