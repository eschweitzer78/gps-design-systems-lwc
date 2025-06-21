/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable @lwc/lwc/valid-api */
/* eslint-disable @lwc/lwc/no-leading-uppercase-api-name */

import { 
  LightningElement, 
  api 
} from "lwc";

import { 
  normaliseBoolean, 
  normaliseInteger, 
  normaliseString, 
  isArray, 
  isFunction, 
} from "c/sfGpsDsHelpers";
 
import { 
  callWithAsyncErrorHandling 
} from "./hookFn";

import type { 
  PropertyDefOptions,
  PropertyDefIntegerOptions,
  PropertyDefEnumOptions, 
  PropertyAccessor 
} from "c/sfGpsDsElement";

export const enum HookType { 
  BEFORE_MOUNT = "BEFORE_MOUNT",
  MOUNTED = "MOUNTED",
  BEFORE_UPDATE = "BEFORE_UPDATE",
  UPDATED = "UPDATED",
  BEFORE_UNMOUNT = "BEFORE_UNMOUNT",
  UNMOUNTED = "UNMOUNTED",
  FIRST_RENDER = "FIRST_RENDER"
}

const HookTypes = Object.freeze({
  BEFORE_MOUNT: Symbol("_onBeforeMountHooks"),
  MOUNTED: Symbol("_onMountedHooks"),
  BEFORE_UPDATE: Symbol("_onBeforeUpdateHooks"),
  UPDATED: Symbol("_onUpdatedHooks"),
  BEFORE_UNMOUNT: Symbol("_onBeforeUnmountHooks"),
  UNMOUNTED: Symbol("_onUnmountedHooks"),
  FIRST_RENDER: Symbol("_firstRender")
});

const DEBUG = false;
const CLASS_NAME = "SfGpsDsElement";

export default 
class SfGpsDsElement 
extends LightningElement {
  [HookTypes.BEFORE_MOUNT]?: Function[];
  [HookTypes.BEFORE_UNMOUNT]?: Function[];
  [HookTypes.BEFORE_UPDATE]?: Function[];
  [HookTypes.FIRST_RENDER]?: Function[];
  [HookTypes.MOUNTED]?: Function[];
  [HookTypes.UNMOUNTED] ?: Function[];
  [HookTypes.UPDATED]?: Function[];

  /* methods: internal - hooks */

  static HookTypes = HookTypes;

  callHook(
    type: HookType
  ): void {
    const hookSymbol = HookTypes[type];

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> callHook",
        "type=", type,
        "cbList=", hookSymbol ? this[hookSymbol] : "N/A"
      );
    }

    const hook = hookSymbol ? this[hookSymbol] : undefined;
    callWithAsyncErrorHandling(hook, type);

    if (DEBUG) {
      console.debug(CLASS_NAME, "< callHook");
    }
  }

  /**
   * Allows to add a hook for a certain type of event with a choice 
   * of prepending to the current list.
   * @param {HookType} type the type of hook with a choice of 
   * @param {Function} hook 
   * @param {boolean} prepend indicates the hook should be added at beginning
   * @returns {Function} the hook itself
   */

  injectHook(
    type: HookType, 
    hook: Function, 
    prepend: boolean = false
  ): Function {
    const hookSymbol = HookTypes[type];
    
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> injectHook",
        "type=", type,
        "hook=", hook,
        "preprend=", prepend
      );
    }

    if (hookSymbol) {
      const hooks = this[hookSymbol] || (this[hookSymbol] = []);

      if (prepend) {
        hooks.unshift(hook);
      } else {
        hooks.push(hook);
      }
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< injectHook",
        "cbList=", hookSymbol ? this[hookSymbol] : "N/A",
        "hook=", hook
      );
    }

    return hook;
  }

  _createHook = (type: HookType) => (hook: Function): Function => {
    return this.injectHook(type, (...args: any[]) => hook(...args));
  };

  update(
    fn: Function | Function[]
  ): void {
    this.callHook(HookType.BEFORE_UPDATE);

    if (isFunction(fn)) {
      (fn as Function)();
    } else if (isArray(fn)) {
      for (let i = 0; i < fn.length; i++) {
        (fn as Function[])[i]();
      }
    }

    this.callHook(HookType.UPDATED);
  }

  // methods: external - hooks, for testing purposes only

  _handleBeforeMount?: Function;

  // @ts-ignore
  @api
  get handleBeforeMount() {
    return (
      this._handleBeforeMount ||
      (this._handleBeforeMount = this._createHook(HookType.BEFORE_MOUNT))
    );
  }

  _handleMounted?: Function;

  // @ts-ignore
  @api
  get handleMounted() {
    return (
      this._handleMounted || (this._handleMounted = this._createHook(HookType.MOUNTED))
    );
  }

  _handleBeforeUpdate?: Function;

  // @ts-ignore
  @api
  get handleBeforeUpdate() {
    return (
      this._handleBeforeUpdate ||
      (this._handleBeforeUpdate = this._createHook(HookType.BEFORE_UPDATE))
    );
  }

  _handleUpdated?: Function;

  // @ts-ignore
  @api
  get handleUpdated() {
    return (
      this._handleUpdated || (this._handleUpdated = this._createHook(HookType.UPDATED))
    );
  }

  _handleBeforeUnmount?: Function;

  // @ts-ignore
  @api
  get handleBeforeUnmount() {
    return (
      this._handleBeforeUnmount ||
      (this._handleBeforeUnmount = this._createHook(HookType.BEFORE_UNMOUNT))
    );
  }

  _handleUnmounted?: Function;

  // @ts-ignore
  @api
  get handleUnmounted() {
    return (
      this._handleUnmounted ||
      (this._handleUnmounted = this._createHook(HookType.UNMOUNTED))
    );
  }

  _handleFirstRender?: Function;

  get handleFirstRender() {
    return (
      this._handleFirstRender ||
      (this._handleFirstRender = this._createHook(HookType.FIRST_RENDER))
    );
  }

  // @ts-ignore
  @api 
  __serialiseInner(): string {
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    return this.template?.innerHTML || "";
  }

  /* methods: internal - property management */

  __dirty = 0;

  defineProperty(
    propertyName: string, 
    options?: PropertyDefOptions<any>
  ): PropertyAccessor<any> {
    const {
      defaultValue,
      watcher, 
      transform = (x: any): any => x
    } = options || {};

    const propOriginal = Symbol(`_${propertyName}Original`);
    const prop = Symbol(`_${propertyName}`);
    this[propOriginal] = defaultValue;
    this[prop] = transform(defaultValue);
    // @ts-ignore
    this[propertyName] = defaultValue;

    Object.defineProperty(this, propertyName, {
      set: (value) => {
        this[propOriginal] = value;
        const oldValue: any = this[prop];
        const newValue: any = this[prop] = transform(value);
        if (oldValue !== newValue) this.__dirty++; // force render

        for (const watcherFunction of Array.isArray(watcher) ? watcher : [watcher]) {
          if (typeof watcherFunction === "function") {
            watcherFunction(propertyName, oldValue, newValue);
          }
        }
      },
      get: () => {
        return this[propOriginal];
      },
      enumerable: true,
      configurable: true
    });

    const getter = () => { 
      // eslint-disable-next-line no-unused-vars
      const dirty = this.__dirty; // this will make sure the template re-renders if value changed
      return this[prop];
    };
    
    const setter = (value: any) => {
      this[prop] = value;
      this.__dirty++;
    }

    return {
      get value() { return getter(); },
      set value(value) { setter(value); }
    }
  }

  defineBooleanProperty(
    propertyName: string, 
    options?: PropertyDefOptions<boolean>
  ): PropertyAccessor<boolean> {
    const safeOptions = options || {};

    if (safeOptions.transform) {
      return this.defineProperty(propertyName, safeOptions);
    } 

    return this.defineProperty(
      propertyName, 
      {
        ...options, 
        transform: (value) => normaliseBoolean(
          value, { 
            acceptString: true, 
            fallbackValue: safeOptions.defaultValue 
          }
        )
      }
    );
  }

  defineIntegerProperty<T = number>(
    propertyName: string, 
    options?: PropertyDefIntegerOptions
  ): PropertyAccessor<T> {
    const safeOptions = options || {};

    if (safeOptions.transform) {
      return this.defineProperty(propertyName, safeOptions);
    } 

    return this.defineProperty(
      propertyName, 
      {
        ...options, 
        transform: (value) => normaliseInteger(
          value, { 
            acceptString: true, 
            min: safeOptions.minValue,
            max: safeOptions.maxValue,
            fallbackValue: safeOptions.defaultValue 
          }
        )
      }
    );
  }

  defineStringProperty<T = string>(
    propertyName: string, 
    options?: PropertyDefOptions<string>
  ): PropertyAccessor<T> {
    const safeOptions = options || {};

    return this.defineProperty(propertyName, safeOptions);
  }

  defineEnumProperty<T = string>(
    propertyName: string, 
    options?: PropertyDefEnumOptions<T>
  ): PropertyAccessor<T> {
    const safeOptions = options || {};

    if (safeOptions.transform) {
      return this.defineProperty(propertyName, safeOptions);
    } 

    return this.defineProperty(
      propertyName, 
      {
        ...options,
        transform: (value) => normaliseString(
          value, { 
            validValues: safeOptions.validValues,
            fallbackValue: safeOptions.defaultValue,
            returnObjectValue: safeOptions.returnObjectValue 
          }
        )
      }
    );
  }

  defineEnumObjectProperty<T, K = string>(
    propertyName: string, 
    options?: PropertyDefEnumOptions<T, K>
  ): PropertyAccessor<T> {
    const safeOptions = options || {};

    if (safeOptions.transform) {
      return this.defineProperty(propertyName, safeOptions);
    } 

    return this.defineProperty(
      propertyName, 
      {
        ...safeOptions, 
        transform: (value) => normaliseString(
          value, { 
            validValues: safeOptions.validValues,
            fallbackValue: safeOptions.defaultValue,
            returnObjectValue: true
          }
        )
      }
    );
  }

  /* lifecycle */

  _isConnected = false;
  _isRendered = false;

  connectedCallback(): void {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> connectedCallback"
      );
    }

    this._isConnected = true;
    this._isRendered = false;

    // before mount hook is called before first render
    this.callHook(HookType.BEFORE_MOUNT);

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< connectedCallback"
      );
    }
  }

  disconnectedCallback() {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> disconnectedCallback"
      );
    }

    // in LWC there isn't really a way to execute something 
    // *before* component is disconnected/unmounted, so we do it right when it happens
    // but the element is no longer in the DOM so we can't do fancy stuff like fade outs
    // before the component is removed.
    this.callHook(HookType.BEFORE_UNMOUNT);
    this.callHook(HookType.UNMOUNTED);
    this._isConnected = false;

    if (DEBUG) {
      console.debug(
        CLASS_NAME, "< disconnectedCallback"
      );
    }
  }

  renderedCallback() {
    if (!this._isRendered) {
      this._isRendered = true;

      // mounted hook is called after first render
      this.callHook(HookType.MOUNTED);
      this.callHook(HookType.FIRST_RENDER);
    }
  }
}
