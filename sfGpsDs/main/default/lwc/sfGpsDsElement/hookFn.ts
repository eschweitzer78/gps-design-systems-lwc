import { 
  isArray, 
  isFunction, 
  isPromise 
} from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsElement";

export const HookTypes = {
  BEFORE_MOUNT: Symbol("_onBeforeMountHooks"),
  MOUNTED: Symbol("_onMountedHooks"),
  BEFORE_UPDATE: Symbol("_onBeforeUpdateHooks"),
  UPDATED: Symbol("_onUpdatedHooks"),
  BEFORE_UNMOUNT: Symbol("_onBeforeUnmountHooks"),
  UNMOUNTED: Symbol("_onUnmountedHooks"),
  FIRST_RENDER: Symbol("_firstRender")
};

export type HookType =
  typeof HookTypes.BEFORE_MOUNT |
  typeof HookTypes.MOUNTED |
  typeof HookTypes.BEFORE_UPDATE |
  typeof HookTypes.UPDATED |
  typeof HookTypes.BEFORE_UNMOUNT |
  typeof HookTypes.UNMOUNTED |
  typeof HookTypes.FIRST_RENDER;

function handleError(err: string, type: HookType) {
  if (DEBUG) console.debug(CLASS_NAME, "> handleError", err, type);
  console.error(err, type);
  if (DEBUG) console.debug(CLASS_NAME, "< handleError");
}

export function callWithErrorHandling(fn: Function, type: HookType, args?: any) {
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
    if (DEBUG) console.debug(CLASS_NAME, "< callWithErrorHandling1", rv);
    return rv;
  } catch (err) {
    const rv = handleError(err, type);
    if (DEBUG) console.debug(CLASS_NAME, "< callWithErrorHandling2", rv);
    return rv;
  }
}

export function callWithAsyncErrorHandling(fn: Function, type: HookType, args?: any) {
  if (DEBUG)
    console.debug(
      CLASS_NAME, "> callWithAsyncErrorHandling",
      "fn=", fn,
      "type=", type,
      "args=", args
    );

  if (isFunction(fn)) {
    const rv = callWithErrorHandling(fn, type, args);
    if (rv && isPromise(rv)) {
      rv.catch((err) => {
        const rv2 = handleError(err, type);
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

    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], type, args));
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< callWithAsyncErrorHandling3", values);
    return values;
  }

  if (DEBUG) console.debug(CLASS_NAME, "< callWithAsyncErrorHandling4");
  return null;
}
