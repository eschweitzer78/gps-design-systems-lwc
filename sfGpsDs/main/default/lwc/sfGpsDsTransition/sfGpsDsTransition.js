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
  normaliseBoolean
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  isValidDuration,
  normaliseDuration,
  getHookArgumentsLength,
  once,
  nextFrame,
  getTimeout
} from "./transition-util";

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

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  _isMounted = false;

  constructor() {
    super();

    super.handleMounted(() => {
      this._isMounted = true;
    });
  }

  /* api: name */

  _name;

  @api
  get name() {
    return this._name;
  }

  set name(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set name value=", value);

    this._name = value;
    this.updateTransition();

    if (DEBUG) console.log(CLASS_NAME, "< set name", this._name);
  }

  /* api: type */

  _typeOriginal;
  _type;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set type value=", value);

    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
    if (DEBUG) console.log(CLASS_NAME, "< set type", this._type);
  }

  /* api: mode */

  _modeOriginal;
  _mode;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set mode value=", value);

    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });

    if (DEBUG) console.log(CLASS_NAME, "< set mode", this._mode);
  }

  /* api: v-show */

  _show;
  _hasShow;

  @api
  get show() {
    return this._show;
  }

  set show(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set show value=", value);

    if (!value !== !this._show) {
      this._show = value;
      this.updateTransition();
    }

    if (DEBUG) console.log(CLASS_NAME, "< set show", this._show);
  }

  /* api: appear */

  _appear;

  @api
  get appear() {
    return this._appear;
  }

  set appear(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set appear", JSON.stringify(value));

    if (value != null) {
      this._appear = value !== false && value !== "false";
    }

    if (DEBUG)
      console.log(CLASS_NAME, "< set appear", JSON.stringify(this._appear));
  }

  /* api: duration */

  _durationOriginal;
  _duration;

  @api
  get duration() {
    return this._durationOriginal;
  }

  set duration(value) {
    this._durationOriginal = value;
    this._durations = normaliseDuration(value);
  }

  /* api: disabled, Boolean */

  _disabled = DISABLED_DEFAULT;
  _disabledOriginal = DISABLED_DEFAULT;

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

  updateTransition() {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> updateTransition",
        this._name,
        this._show,
        this.getDisplayStyle()
      );

    if (!this._name || this._show === undefined || this._disabled) {
      if (DEBUG) console.log(CLASS_NAME, "< updateTransition not bound");
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

    if (DEBUG) console.log(CLASS_NAME, "< updateTransition");
  }

  /* classes */
  /* ------- */

  _enterClass;

  @api
  get enterClass() {
    return this._enterClass || this._name + "-enter";
  }

  set enterClass(value) {
    this._enterClass = value;
  }

  _leaveClass;

  @api
  get leaveClass() {
    return this._leaveClass || this._name + "-leave";
  }

  set leaveClass(value) {
    this._leaveClass = value;
  }

  _enterToClass;

  @api
  get enterToClass() {
    return this._enterToClass || this._name + "-enter-to";
  }

  set enterToClass(value) {
    this._enterToClass = value;
  }

  _leaveToClass;

  @api
  get leaveToClass() {
    return this._leaveToClass || this._name + "-leave-to";
  }

  set leaveToClass(value) {
    this._leaveToClass = value;
  }

  _enterActiveClass;

  @api
  get enterActiveClass() {
    return this._enterActiveClass || this._name + "-enter-active";
  }

  set enterActiveClass(value) {
    this._enterActiveClass = value;
  }

  _leaveActiveClass;

  @api
  get leaveActiveClass() {
    return this._leaveActiveClass || this._name + "-leave-active";
  }

  set leaveActiveClass(value) {
    this._leaveActiveClass = value;
  }

  @api appearClass;
  @api appearActiveClass;
  @api appearToClass;

  /* hooks */
  /* ----- */

  @api handleBeforeEnter;
  @api handleEnter;
  @api handleAfterEnter;
  @api handleEnterCancelled;

  @api handleBeforeLeave;
  @api handleLeave;
  @api handleAfterLeave;
  @api handleLeaveCancelled;

  @api handleBeforeAppear;
  @api handleAppear;
  @api handleAfterAppear;
  @api hanndleAppearCancelled;

  /* methods */

  whenTransitionEnds(expectedType, cb) {
    const { type, timeout, propCount } = this.getTransitionInfo(expectedType);

    if (!type) {
      cb();
      return;
    }

    const event =
      type === TYPE_TRANSITION ? TRANSITION_ENDEVENT : ANIMATION_ENDEVENT;

    let ended = 0;

    const end = () => {
      // eslint-disable-next-line no-use-before-define
      this.removeEventListener(event, onEnd);
      cb();
    };
    const onEnd = (e) => {
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

    this.addEventListener(event, onEnd);
  }

  getTransitionInfo(expectedType) {
    const styles = window.getComputedStyle(this.hostElement);

    // JSDOM may return undefined for transition properties
    const transitionDelays = (styles[TRANSITION_PROP + "Delay"] || "").split(
      ", "
    );
    const transitionDurations = (
      styles[TRANSITION_PROP + "Duration"] || ""
    ).split(", ");
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);

    const animationDelays = (styles[ANIMATION_PROP + "Delay"] || "").split(
      ", "
    );
    const animationDurations = (
      styles[ANIMATION_PROP + "Duration"] || ""
    ).split(", ");
    const animationTimeout = getTimeout(animationDelays, animationDurations);

    let type;
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
          : null;
      propCount = type
        ? type === TYPE_TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }

    const hasTransform =
      type === TYPE_TRANSITION &&
      TRANSFORM_RE.test(styles[TRANSITION_PROP + "Property"]);
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }

  addTransitionClass(cls) {
    if (DEBUG)
      console.log(CLASS_NAME, "> addTransitionClass", cls, this.classList);
    this.classList.add(cls);
    if (DEBUG) console.log(CLASS_NAME, "< addTransitionClass", this.classList);
  }

  removeTransitionClass(cls) {
    if (DEBUG)
      console.log(CLASS_NAME, "> removeTransitionClass", cls, this.classList);
    this.classList.remove(cls);
    if (DEBUG)
      console.log(CLASS_NAME, "< removeTransitionClass", this.classList);
  }

  _enter() {
    if (this._hasShow !== true) {
      this.enter();
    }
  }

  _hasCancelCb = false;

  // eslint-disable-next-line no-unused-vars
  _cancelCb = (event) => {
    this.hostElement.removeEventListener("transitionend", this._cancelCb);
    this._hasCancelCb = false;
  };

  enter(toggleDisplay) {
    if (this._hasCancelCb === false) {
      this._hasCancelCb = true;
      this.hostElement.addEventListener("transitionend", this._cancelCb);
    }

    if (this[LEAVE_CB_KEY]) {
      this[LEAVE_CB_KEY].cancelled = true;
      this[LEAVE_CB_KEY]();
    }

    const isAppear = !this._isMounted;

    if (isAppear && !this._appear && this._appear !== "") {
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

    const cb = (this[ENTER_CB_KEY] = once(() => {
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

      this[ENTER_CB_KEY] = null;
    }));

    /* dropping the bit about leave element */

    if (beforeEnterHook) {
      beforeEnterHook();
    }

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
            } else {
              this.whenTransitionEnds(this._type, cb);
            }
          }
        }
      });
    }

    if (this._hasShow) {
      if (toggleDisplay) {
        toggleDisplay();
      }

      if (enterHook) {
        enterHook(cb);
      }
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  leave(rm) {
    if (DEBUG) console.log(CLASS_NAME, "> leave");

    if (this[ENTER_CB_KEY]) {
      this[ENTER_CB_KEY].cancelled = true;
      this[ENTER_CB_KEY]();
    }

    if (this._show === undefined) {
      rm();
      return;
    }

    if (this[LEAVE_CB_KEY] !== null && this[LEAVE_CB_KEY] !== undefined) {
      return;
    }

    const expectsCSS = true; // this.css !== false;
    const userWantsControl = getHookArgumentsLength(this.handleLeave);
    const explicitLeaveDuration = toNumber(
      isObject(this.duration) ? this.duration.leave : this.duration
    );

    const cb = (this[LEAVE_CB_KEY] = once(() => {
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

      this[LEAVE_CB_KEY] = null;
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
            } else {
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

    if (DEBUG) console.log(CLASS_NAME, "< leave");
  }

  @track _displayStyle;

  setDisplayStyle(value) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> setDisplayStyle",
        this._displayStyle,
        "->",
        value
      );

    this.hostElement.style.display = value;

    if (DEBUG) console.log(CLASS_NAME, "< setDisplayStyle");
  }

  getDisplayStyle() {
    return this._displayStyle || this.hostElement.style.display;
  }
}
