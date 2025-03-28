/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { isArray, isFunction, isPromise } from "c/sfGpsDsHelpersOs";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

/* IMPORTANT NOTE: this class is not automatically derived from sfGpsDsLwcOs */

const DEBUG = false;
const CLASS_NAME = "SfGpsDsLwc2";

const BEFORE_MOUNT = Symbol("_onBeforeMountHooks");
const MOUNTED = Symbol("_onMountedHooks");
const BEFORE_UPDATE = Symbol("_onBeforeUpdateHooks");
const UPDATED = Symbol("_onUpdatedHooks");
const BEFORE_UNMOUNT = Symbol("_onBeforeUnmountHooks");
const UNMOUNTED = Symbol("_onUnmountedHooks");

const FIRST_RENDER = Symbol("_firstRender");

function handleError(err, type) {
  if (DEBUG) console.log(CLASS_NAME, "> handleError", err, type);
  console.error(err, type);
  if (DEBUG) console.log(CLASS_NAME, "< handleError");
}

function callWithErrorHandling(fn, type, args) {
  if (DEBUG) console.log(CLASS_NAME, "> callWithErrorHandling", fn, type, args);

  try {
    const rv = args ? fn(...args) : fn();
    if (DEBUG) console.log(CLASS_NAME, "< callWithErrorHandling1", rv);
    return rv;
  } catch (err) {
    const rv = handleError(err, type);
    if (DEBUG) console.log(CLASS_NAME, "< callWithErrorHandling2", rv);
    return rv;
  }
}

function callWithAsyncErrorHandling(fn, type, args) {
  if (DEBUG)
    console.log(
      CLASS_NAME,
      "> callWithAsyncErrorHandling fn=",
      fn,
      ", type=",
      type,
      ", args=",
      args
    );

  if (isFunction(fn)) {
    const rv = callWithErrorHandling(fn, type, args);
    if (rv && isPromise(rv)) {
      rv.catch((err) => {
        const rv2 = handleError(err, type);
        if (DEBUG)
          console.log(CLASS_NAME, "< callWithAsyncErrorHandling1", rv2);
        return rv2;
      });
    }

    if (DEBUG) console.log(CLASS_NAME, "< callWithAsyncErrorHandling2", rv);
    return rv;
  }

  if (isArray(fn)) {
    const values = [];

    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], type, args));
    }

    if (DEBUG) console.log(CLASS_NAME, "< callWithAsyncErrorHandling3", values);
    return values;
  }

  if (DEBUG) console.log(CLASS_NAME, "< callWithAsyncErrorHandling4");
  return null;
}

export default class SfGpsDsLwcOsN extends OmniscriptBaseMixin(
  LightningElement
  // eslint-disable-next-line @lwc/lwc/no-leading-uppercase-api-name
) {
  @track _sfGpsDsErrors;

  /* getters for parity with non OS version - no easy way to do that with scope imports not permitted */

  get communityId() {
    return null;
  }

  get communityBasePath() {
    return null;
  }

  get isPreview() {
    return false;
  }

  /* methods: internal */

  addError(code, description) {
    let errors = this._sfGpsDsErrors || [];
    this._sfGpsDsErrors = [
      ...errors,
      {
        index: errors.length,
        code: code,
        description: description
      }
    ];
  }

  clearErrors() {
    this._sfGpsDsErrors = null;
  }

  callHook(type) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> .callHook type=",
        type,
        ", cbList=",
        this[type]
      );

    const hook = this[type];
    callWithAsyncErrorHandling(hook, type);

    if (DEBUG) console.log(CLASS_NAME, "< .callHook");
  }

  injectHook(type, hook, prepend = false) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> .injectHook type=",
        type,
        ", hook=",
        hook,
        ", preprend=",
        prepend
      );

    const hooks = this[type] || (this[type] = []);

    if (prepend) {
      hooks.unshift(hook);
    } else {
      hooks.push(hook);
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< .injectHook cbList=",
        this[type],
        ", hook=",
        hook
      );
    return hook;
  }

  _createHook = (type) => (hook) => {
    this.injectHook(type, (...args) => hook(...args));
  };

  update(fn) {
    this.callHook(BEFORE_UPDATE);

    if (isFunction(fn)) {
      fn();
    } else if (isArray(fn)) {
      for (let i = 0; i < fn.length; i++) {
        fn[i]();
      }
    }

    this.callHook(UPDATED);
  }

  // methods: external; for testing purposes only

  _handleBeforeMount;

  @api
  get handleBeforeMount() {
    return (
      this._handleBeforeMount ||
      (this._handleBeforeMount = this._createHook(BEFORE_MOUNT))
    );
  }

  _handleMounted;

  @api
  get handleMounted() {
    return (
      this._handleMounted || (this._handleMounted = this._createHook(MOUNTED))
    );
  }

  _handleBeforeUpdate;

  @api
  get handleBeforeUpdate() {
    return (
      this._handleBeforeUpdate ||
      (this._handleBeforeUpdate = this._createHook(BEFORE_UPDATE))
    );
  }

  _handleUpdated;

  @api
  get handleUpdated() {
    return (
      this._handleUpdated || (this._handleUpdated = this._createHook(UPDATED))
    );
  }

  _handleBeforeUnmount;

  @api
  get handleBeforeUnmount() {
    return (
      this._handleBeforeUnmount ||
      (this._handleBeforeUnmount = this._createHook(BEFORE_UNMOUNT))
    );
  }

  _handleUnmounted;

  @api
  get handleUnmounted() {
    return (
      this._handleMounted ||
      (this._handleUnmounted = this._createHook(UNMOUNTED))
    );
  }

  @api
  getErrors() {
    return this._sfGpsDsErrors;
  }

  // eslint-disable-next-line @lwc/lwc/valid-api
  @api __serialiseInner() {
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    return this.template.innerHTML;
  }

  /* lifecycle */

  _isConnected = false;

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "> .connectedCallback");

    this._isConnected = true;
    this[FIRST_RENDER] = true;

    // before mount hook is called before first render
    this.callHook(BEFORE_MOUNT);

    if (DEBUG) console.log(CLASS_NAME, "< .connectedCallback");
  }

  disconnectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "> .disconnectedCallback");

    // in LWC there isn't really a way to execute something *before* component is disconnected/unmounted
    this.callHook(BEFORE_UNMOUNT);
    this.callHook(UNMOUNTED);
    this._isConnected = false;

    if (DEBUG) console.log(CLASS_NAME, "< .disconnectedCallback");
  }

  renderedCallback() {
    if (this[FIRST_RENDER]) {
      this[FIRST_RENDER] = false;
      // mounted hook is called after first render
      this.callHook(MOUNTED);
    }
  }
}

SfGpsDsLwcOsN.PACKAGE_NAME = "omnistudio";
