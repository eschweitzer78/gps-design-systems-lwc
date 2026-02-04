/*
 * Copyright (c) 2022-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * Heavily inspired by vue2's Transition component and vShow directive by Carlos Rodrigues and Evan You
 */

import { api, track } from "lwc";
import {
  isObject,
  toNumber,
  normaliseString,
  normaliseBoolean,
  once
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  isValidDuration,
  normaliseDuration,
  getHookArgumentsLength,
  nextFrame,
  getTimeout
} from "./transition-util";

import type { 
  TransitionMode, 
  TransitionType,
  TransitionCallback,
  CSSDurations,
  CSSDelays,
  Duration,
  TransitionHook,
  Transition
} from "c/sfGpsDsTransition";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsTransition";

const ORIGINAL_DISPLAY_KEY = Symbol("_od");
const LEAVE_CB_KEY = Symbol("_leaveCb");
const ENTER_CB_KEY = Symbol("_enterCb");

const TYPE_ANIMATION = "animation";
const TYPE_TRANSITION = "transition";
const TYPE_VALUES = [TYPE_ANIMATION, TYPE_TRANSITION];
const TYPE_DEFAULT = TYPE_ANIMATION;

const MODE_INOUT = "in-out";
const MODE_OUTIN = "out-in";
const MODE_VALUES = [MODE_INOUT, MODE_OUTIN];
const MODE_DEFAULT = MODE_INOUT;

const DISABLED_DEFAULT = false;

const TRANSITION_PROP = "transition";
const TRANSITION_ENDEVENT = "transitionend";
const ANIMATION_PROP = "animation";
const ANIMATION_ENDEVENT = "animationend";

const TRANSFORM_RE = /\b(transform|all)(,|$)/;

export default class SfGpsDsTransition extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  [ORIGINAL_DISPLAY_KEY]?: string;
  [LEAVE_CB_KEY]?: TransitionCallback;
  [ENTER_CB_KEY]?: Function;

  _isMounted = false;

  constructor() {
    super();

    this.handleMounted(() => {
      this._isMounted = true;
    });
  }

  /* api: name */

  _name?: string;

  // @ts-ignore
  @api
  get name() {
    return this._name;
  }

  set name(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set name value=", value);

    this._name = value;
    this.updateTransition();

    if (DEBUG) console.debug(CLASS_NAME, "< set name", this._name);
  }

  /* api: type */

  _type?: TransitionType;
  _typeOriginal?: TransitionType;

  // @ts-ignore
  @api
  get type(): TransitionType | undefined {
    return this._typeOriginal;
  }

  set type(value: TransitionType) {
    if (DEBUG) console.debug(CLASS_NAME, "> set type value=", value);

    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    }) as TransitionType;

    if (DEBUG) console.debug(CLASS_NAME, "< set type", this._type);
  }

  /* api: mode */

  _mode?: TransitionMode;
  _modeOriginal?: TransitionMode;

  // @ts-ignore
  @api
  get mode(): TransitionMode | undefined {
    return this._modeOriginal;
  }

  set mode(value: TransitionMode) {
    if (DEBUG) console.debug(CLASS_NAME, "> set mode value=", value);

    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    }) as TransitionMode;

    if (DEBUG) console.debug(CLASS_NAME, "< set mode", this._mode);
  }

  /* api: v-show */

  _show?: boolean;
  _hasShow?: boolean;

  // @ts-ignore
  @api
  get show() {
    return this._show;
  }

  set show(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set show value=", value);

    if (!value !== !this._show) {
      this._show = value;
      this.updateTransition();
    }

    if (DEBUG) console.debug(CLASS_NAME, "< set show", this._show);
  }

  /* api: appear */

  _appear: boolean = false;

  // @ts-ignore
  @api
  get appear(): boolean {
    return this._appear;
  }

  set appear(value: any) {
    if (DEBUG) console.debug(CLASS_NAME, "> set appear", JSON.stringify(value));

    if (value != null) {
      this._appear = value !== false && value !== "false";
    }

    if (DEBUG)
      console.debug(CLASS_NAME, "< set appear", JSON.stringify(this._appear));
  }

  /* api: duration */

  _duration?: Duration;
  _durationOriginal: any;

  // @ts-ignore
  @api
  get duration() {
    return this._durationOriginal;
  }

  set duration(value) {
    this._durationOriginal = value;
    this._duration = normaliseDuration(value);
  }

  /* api: disabled, Boolean */

  _disabled = DISABLED_DEFAULT;
  _disabledOriginal = DISABLED_DEFAULT;

  // @ts-ignore
  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISABLED_DEFAULT
    });

    this.updateTransition();
  }

  /* methods */

  _bound = false;

  updateTransition(): void {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> updateTransition",
        this._name,
        this._show,
        this.getDisplayStyle()
      );

    if (!this._name || this._show === undefined || this._disabled) {
      if (DEBUG) console.debug(CLASS_NAME, "< updateTransition not bound");
      return;
    }

    let justBound = false;
    if (!this._bound) {
      this._hasShow = true;
      this._bound = true;
      justBound = true;
      const sd = this.getDisplayStyle();
      this[ORIGINAL_DISPLAY_KEY] = sd === "none" ? "" : sd;
    }

    if (this._show) {
      this.enter(() => {
        this.setDisplayStyle(this[ORIGINAL_DISPLAY_KEY]);
      });
    } else if (justBound) {
      /* bind and show=false */
      this.setDisplayStyle(this._show ? this[ORIGINAL_DISPLAY_KEY] : "none");
    } else {
      /* update and show=false */
      this.leave(() => {
        this.setDisplayStyle("none");
      });
    }

    if (DEBUG) console.debug(CLASS_NAME, "< updateTransition");
  }

  /* classes */
  /* ------- */

  _enterClass?: string;

  // @ts-ignore
  @api
  get enterClass(): string {
    return this._enterClass || this._name + "-enter";
  }

  set enterClass(value: string) {
    this._enterClass = value;
  }

  _leaveClass?: string;

  // @ts-ignore
  @api
  get leaveClass(): string {
    return this._leaveClass || this._name + "-leave";
  }

  set leaveClass(value: string) {
    this._leaveClass = value;
  }

  _enterToClass?: string;

  // @ts-ignore
  @api
  get enterToClass(): string {
    return this._enterToClass || this._name + "-enter-to";
  }

  set enterToClass(value: string) {
    this._enterToClass = value;
  }

  _leaveToClass?: string;

  // @ts-ignore
  @api
  get leaveToClass(): string {
    return this._leaveToClass || this._name + "-leave-to";
  }

  set leaveToClass(value: string) {
    this._leaveToClass = value;
  }

  _enterActiveClass?: string;

  // @ts-ignore
  @api
  get enterActiveClass(): string {
    return this._enterActiveClass || this._name + "-enter-active";
  }

  set enterActiveClass(value: string) {
    this._enterActiveClass = value;
  }

  _leaveActiveClass?: string;

  // @ts-ignore
  @api
  get leaveActiveClass(): string {
    return this._leaveActiveClass || this._name + "-leave-active";
  }

  set leaveActiveClass(value: string) {
    this._leaveActiveClass = value;
  }

  // @ts-ignore
  @api 
  appearClass?: string;

  // @ts-ignore
  @api 
  appearActiveClass?: string;
  // @ts-ignore
  @api 
  appearToClass?: string;

  /* hooks */
  /* ----- */

  // @ts-ignore
  @api handleBeforeEnter: TransitionHook;
  // @ts-ignore
  @api handleEnter: TransitionHook;
  // @ts-ignore
  @api handleAfterEnter: TransitionHook;
  // @ts-ignore
  @api handleEnterCancelled: TransitionHook;

  // @ts-ignore
  @api handleBeforeLeave: TransitionHook;
  // @ts-ignore
  @api handleLeave: TransitionHook;
  // @ts-ignore
  @api handleAfterLeave: TransitionHook;
  // @ts-ignore
  @api handleLeaveCancelled: TransitionHook;

  // @ts-ignore
  @api handleBeforeAppear: TransitionHook;
  // @ts-ignore
  @api handleAppear: TransitionHook;
  // @ts-ignore
  @api handleAfterAppear: TransitionHook;
  // @ts-ignore
  @api handleAppearCancelled: TransitionHook;

  // for LWC compatibility, deprecated -- typo
  // @ts-ignore
  @api 
  get hanndleAppearCancelled(): TransitionHook {
    return this.handleAppearCancelled;
  }

  set hanndleAppearCancelled(hook: TransitionHook) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.handleAppearCancelled = hook;
  }

  /* methods */

  whenTransitionEnds(
    expectedType: TransitionType, 
    cb: Function
  ): void {
    const { type, timeout, propCount } = this.getTransitionInfo(expectedType);

    if (!type) {
      cb();
      return;
    }

    const event = type === TYPE_TRANSITION 
      ? TRANSITION_ENDEVENT 
      : ANIMATION_ENDEVENT;

    let ended = 0;

    const end = () => {
      // eslint-disable-next-line no-use-before-define
      this.removeEventListener(event, onEnd as EventListener);
      cb();
    };

    const onEnd = (e: TransitionEvent) => {
      if (e.target === this.hostElement) {
        if (++ended >= propCount) {
          end();
        }
      }
    };

    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);

    this.addEventListener(event, onEnd as EventListener);
  }

  getTransitionInfo(
    expectedType?: TransitionType
  ): Transition {
    const styles = window.getComputedStyle(this.hostElement);

    // JSDOM may return undefined for transition properties
    // @ts-ignore
    const transitionDelays: CSSDelays = (styles[TRANSITION_PROP + "Delay"] || "").split(
      ", "
    );
      // @ts-ignore
    const transitionDurations: CSSDurations = (styles[TRANSITION_PROP + "Duration"] || "").split(", ");
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    // @ts-ignore
    const animationDelays: CSSDelays = (styles[ANIMATION_PROP + "Delay"] || "").split(", ");
    // @ts-ignore
    const animationDurations: CSSDurations = (styles[ANIMATION_PROP + "Duration"] || "").split(", ");
    const animationTimeout = getTimeout(animationDelays, animationDurations);

    let type: TransitionType | undefined;
    let timeout = 0;
    let propCount = 0;

    if (expectedType === TYPE_TRANSITION) {
      if (transitionTimeout > 0) {
        type = TYPE_TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === TYPE_ANIMATION) {
      if (animationTimeout > 0) {
        type = TYPE_ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type =
        timeout > 0
          ? transitionTimeout > animationTimeout
            ? TYPE_TRANSITION
            : TYPE_ANIMATION
          : undefined;
      propCount = type
        ? type === TYPE_TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }

    const hasTransform =
      // @ts-ignore
      type === TYPE_TRANSITION && TRANSFORM_RE.test(styles[TRANSITION_PROP + "Property"]);
      
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }

  addTransitionClass(
    cls: string
  ): void {
    if (DEBUG)
      console.debug(CLASS_NAME, "> addTransitionClass", cls, this.classList);
    this.classList.add(cls);
    if (DEBUG)
      console.debug(CLASS_NAME, "< addTransitionClass", this.classList);
  }

  removeTransitionClass(
    cls: string
  ): void {
    if (DEBUG)
      console.debug(CLASS_NAME, "> removeTransitionClass", cls, this.classList);
    this.classList.remove(cls);
    if (DEBUG)
      console.debug(CLASS_NAME, "< removeTransitionClass", this.classList);
  }

  _enter() {
    if (this._hasShow !== true) {
      this.enter();
    }
  }

  _hasCancelCb = false;

    // eslint-disable-next-line no-unused-vars
  _cancelCb = (_event: TransitionEvent): void => {
    this.hostElement.removeEventListener("transitionend", this._cancelCb);
    this._hasCancelCb = false;
  };

  enter(toggleDisplay?: () => void): void {
    if (this._hasCancelCb === false) {
      this._hasCancelCb = true;
      this.hostElement.addEventListener("transitionend", this._cancelCb);
    }

    if (this[LEAVE_CB_KEY]) {
      (this[LEAVE_CB_KEY] as TransitionCallback).cancelled = true;
      (this[LEAVE_CB_KEY] as TransitionCallback)();
    }

    const isAppear = !this._isMounted;

    if (isAppear && !this._appear) { //} && this._appear !== "") {
      return;
    }

    const startClass =
      isAppear && this.appearClass ? this.appearClass : this.enterClass;
    const activeClass =
      isAppear && this.appearActiveClass
        ? this.appearActiveClass
        : this.enterActiveClass;
    const toClass =
      isAppear && this.appearToClass ? this.appearToClass : this.enterToClass;
    const beforeEnterHook = isAppear
      ? this.handleBeforeAppear || this.handleBeforeEnter
      : this.handleBeforeEnter;
    const enterHook = isAppear
      ? this.handleAppear || this.handleEnter
      : this.handleEnter;
    const afterEnterHook = isAppear
      ? this.handleAfterAppear || this.handleAfterEnter
      : this.handleAfterEnter;
    const enterCancelledHook = isAppear
      ? this.handleAppearCancelled || this.handleEnterCancelled
      : this.handleEnterCancelled;

    const explicitEnterDuration = toNumber(
      isObject(this.duration) ? this.duration.enter : this.duration
    );
    const expectsCSS = true; //this.css !== false;
    const userWantsControl = getHookArgumentsLength(enterHook);

    const cb: TransitionCallback = (
      this[ENTER_CB_KEY] = once(() => {
        if (expectsCSS) {
          this.removeTransitionClass(toClass);
          this.removeTransitionClass(activeClass);
        }

        if (cb.cancelled) {
          if (expectsCSS) {
            this.removeTransitionClass(startClass);
          }

          if (enterCancelledHook) {
            enterCancelledHook();
          }
        } else {
          if (afterEnterHook) {
            afterEnterHook();
          }
        }

        this[ENTER_CB_KEY] = undefined;
      })
    );

    /* dropping the bit about leave element */

    beforeEnterHook?.();

    if (expectsCSS) {
      this.addTransitionClass(startClass);
      this.addTransitionClass(activeClass);

      nextFrame(() => {
        this.removeTransitionClass(startClass);
        if (!cb.cancelled) {
          this.addTransitionClass(toClass);

          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(cb, explicitEnterDuration);
            } else if (this._type) {
              this.whenTransitionEnds(this._type, cb);
            }
          }
        }
      });
    }

    if (this._hasShow) {
      toggleDisplay?.();
      enterHook?.(cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  leave(rm: () => void): void {
    if (DEBUG) console.debug(CLASS_NAME, "> leave");

    if (this[ENTER_CB_KEY]) {
      (this[ENTER_CB_KEY] as TransitionCallback).cancelled = true;
      (this[ENTER_CB_KEY] as TransitionCallback)();
    }

    if (this._show === undefined) {
      rm();
      return;
    }

    if (
      this[LEAVE_CB_KEY] !== null && 
      this[LEAVE_CB_KEY] !== undefined
    ) {
      return;
    }

    const expectsCSS = true; // this.css !== false;
    const userWantsControl = getHookArgumentsLength(this.handleLeave);
    const explicitLeaveDuration = toNumber(
      isObject(this.duration) ? this.duration.leave : this.duration
    );

    const cb: TransitionCallback = (this[LEAVE_CB_KEY] = once(() => {
      if (expectsCSS) {
        this.removeTransitionClass(this.leaveToClass);
        this.removeTransitionClass(this.leaveActiveClass);
      }

      if (cb.cancelled) {
        if (expectsCSS) {
          this.removeTransitionClass(this.leaveClass);
        }

        if (this.handleLeaveCancelled) {
          this.handleLeaveCancelled();
        }
      } else {
        rm();
        if (this.handleAfterLeave) {
          this.handleAfterLeave();
        }
      }

      this[LEAVE_CB_KEY] = undefined;
    }));

    if (cb.cancelled) {
      return;
    }

    if (this.handleBeforeLeave) {
      this.handleBeforeLeave();
    }

    if (expectsCSS) {
      this.addTransitionClass(this.leaveClass);
      this.addTransitionClass(this.leaveActiveClass);

      nextFrame(() => {
        this.removeTransitionClass(this.leaveClass);
        if (!cb.cancelled) {
          this.addTransitionClass(this.leaveToClass);

          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              // eslint-disable-next-line @lwc/lwc/no-async-operation
              setTimeout(cb, explicitLeaveDuration);
            } else if (this._type) {
              this.whenTransitionEnds(this._type, cb);
            }
          }
        }
      });
    }

    if (this.handleLeave) {
      this.handleLeave(cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }

    if (DEBUG) console.debug(CLASS_NAME, "< leave");
  }

  // @ts-ignore
  @track 
  _displayStyle?: string;

  setDisplayStyle(value?: string) {
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> setDisplayStyle",
        this._displayStyle,
        "->",
        value
      );

    this.hostElement.style.display = value || "none";
    this._displayStyle = value || "none";

    if (DEBUG) console.debug(CLASS_NAME, "< setDisplayStyle");
  }

  getDisplayStyle(): string {
    return this._displayStyle || this.hostElement.style.display;
  }
}
