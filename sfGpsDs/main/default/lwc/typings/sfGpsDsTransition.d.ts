declare module "c/sfGpsDsTransition" {
  export type TransitionType = 
    "animation" | 
    "transition";

  export type TransitionMode = 
    "in-out" |
    "out-in";

  export interface Transition {
    type: TransitionType,
    timeout: number,
    propCount: number,
    hasTransform: boolean
  };

  export interface TransitionCallback {
    (): void;
    cancelled?: boolean
  }

  export interface TransitionHook {
    (cb?: TransitionCallback): void,
    fns?: TransitionHook[] | TransitionHook,
    _length?: number
  }

  export type CSSDurations = string[];
  export type CSSDelays = string[];
  export interface DurationObject {
    enter: number,
    leave: number
  }
  export type Duration = [number, number];

  export default 
  class SfGpsDsTransition 
  extends SfGpsDsLwc {
    name: string;
    type: TransitionType;
    mode: TransitionMode;
    show: boolean;
    appear;
    duration;
    disabled: boolean;

    enterClass: string;
    leaveClass: string;
    enterToClass: string;
    leaveToClass: string;
    enterActiveClass: string;
    leaveActiveClass: string;

    appearClass: string;
    appearActiveClass: string;
    appearToClass: string;

    handleBeforeEnter: Function;
    handleEnter: Function;
    handleAfterEnter: Function;
    handleAfterCancelled: Function;

    handleBeforeLeave: Function;
    handleAfterLeave: Function;
    handleLeaveCancelled: Function;

    handleBeforeAppear: Function;
    handleAfterAppear: Function;
    handleAppearCancelled: Function;

    // private

    _isMounted: boolean;

    _name: string;

    _typeOriginal: any;
    _type: TransitionType;

    _modeOriginal: any;
    _mode: TransitionMode;

    _show: boolean;
    _hasShow: boolean;

    _appear;

    _duration;
    _durationOriginal: any;

    _disabled: boolean;
    _disabledOriginal: any;

    updatedTransition(): void;

    _enterClass: string;
    _leaveClass: string;
    _enterToClass: string;
    _leaveToClass: string;
    _enterActiveClass: string;
    _leaveActiveClass: string;

    whenTransitionEnds(
      expectedType: TransitionType, 
      cb: Function
    ): void;
    getTransitionInfo(
      expectedType: TransitionType
    ): Transition;

    addTransitionClass(cls: string): void;
    removeTransitionClass(cls: string): void;

    _enter(): void;

    _hasCancelCb: boolean;
    _cancelCb: (Event) => void;

    enter(toggleDisplay?: () => void): void;
    leave(rm: () => void): void;

  }
}