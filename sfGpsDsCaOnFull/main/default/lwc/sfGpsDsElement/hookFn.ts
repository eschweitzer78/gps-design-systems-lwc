import { 
  isArray, 
  isFunction, 
  isPromise 
} from "c/sfGpsDsHelpers";

import { HookType } from "./sfGpsDsElement";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsElement";

function handleError(
  err: string | undefined,
  type: HookType
): void {
  if (typeof err === "undefined") err = "Undefined error";

  if (DEBUG) console.debug(CLASS_NAME, "> handleError", err, type);
  console.error(err, type);
  if (DEBUG) console.debug(CLASS_NAME, "< handleError");
}

export function callWithErrorHandling(
  fn: Function, 
  type: HookType, 
  args?: any
): any {
  if (DEBUG) {
    console.debug(
      CLASS_NAME, "> callWithErrorHandling", 
      "fn=", fn, 
      "type=", type, 
      "args=", args
    );
  }

  try {
    const rv = args ? fn(...args) : fn();

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< callWithErrorHandling1", 
        rv
      );
    }

    return rv;
  } catch (err) {
    const rv = handleError(err?.toString?.(), type);
    if (DEBUG) console.debug(CLASS_NAME, "< callWithErrorHandling2", rv);
    return rv;
  }
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[] | undefined, 
  type: HookType, 
  args?: any
): any | any[] {
  if (DEBUG) {
    console.debug(
      CLASS_NAME, "> callWithAsyncErrorHandling",
      "fn=", fn,
      "type=", type,
      "args=", args
    );
  }

  if (isFunction(fn)) {
    const rv = callWithErrorHandling(fn as Function, type, args);
    if (rv && isPromise(rv)) {
      rv.catch((err: any) => {
        const rv2 = handleError(err?.toString?.(), type);
        if (DEBUG)
          console.debug(CLASS_NAME, "< callWithAsyncErrorHandling1", rv2);
        return rv2;
      });
    }

    if (DEBUG) console.debug(CLASS_NAME, "< callWithAsyncErrorHandling2", rv);
    return rv;
  }

  if (isArray(fn)) {
    const values = [];

    for (let i = 0; i < (fn as Function[]).length; i++) {
      values.push(callWithAsyncErrorHandling((fn as Function[])[i], type, args));
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< callWithAsyncErrorHandling3", 
        values
      );
    }

    return values;
  }

  if (DEBUG) {
    console.debug(
      CLASS_NAME, "< callWithAsyncErrorHandling4"
    );
  }

  return null;
}
