declare module "c/sfGpsDsTransition" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  
  export type TransitionType = 
    "animation" | 
    "transition";

  export type TransitionMode = 
    "in-out" |
    "out-in";

  export interface Transition {
    type?: TransitionType,
    timeout: number,
    propCount: number,
    hasTransform: boolean
  }

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

    get type(): TransitionType | undefined;
    set type(value: TransitionType);

    get mode(): TransitionMode | undefined;
    set mode(value: TransitionMode);

    get show(): boolean;
    set show(value: boolean);

    get appear(): boolean;
    set appear(value: boolean);

    get duration(): any;
    set duration(value: any);

    get disabled(): boolean;
    set disabled(value: boolean);

    get enterClass(): string;
    set enterClass(value: string);

    get leaveClass(): string;
    set leaveClass(value: string);

    get enterToClass(): string;
    set enterToClass(value: string);

    get leaveToClass(): string;
    set leaveToClass(value: string);

    get enterActiveClass(): string;
    set enterActiveClass(value: string);

    get leaveActiveClass(): string;
    set leaveActiveClass(value: string);

    appearClass: string;
    appearActiveClass: string;
    appearToClass: string;

    handleBeforeEnter: TransitionHook;
    handleEnter: TransitionHook;
    handleAfterEnter: TransitionHook;
    handleAfterCancelled: TransitionHook;

    handleBeforeLeave: TransitionHook;
    handleAfterLeave: TransitionHook;
    handleLeaveCancelled: TransitionHook;

    handleBeforeAppear: TransitionHook;
    handleAfterAppear: TransitionHook;

    // private

    _isMounted: boolean;

    _name: string;

    _typeOriginal?: TransitionType;
    _type?: TransitionType;

    _modeOriginal: any;
    _mode: TransitionMode;

    _show?: boolean;
    _hasShow?: boolean;

    _appear: boolean;

    _duration?: Duration;
    _durationOriginal: any;

    _disabled: boolean;
    _disabledOriginal: boolean;

    _bound: boolean;

    updatedTransition(): void;

    _enterClass?: string;
    _leaveClass?: string;
    _enterToClass?: string;
    _leaveToClass?: string;
    _enterActiveClass?: string;
    _leaveActiveClass?: string;

    whenTransitionEnds(
      expectedType: TransitionType, 
      cb: Function
    ): void;

    getTransitionInfo(
      expectedType?: TransitionType
    ): Transition;

    addTransitionClass(
      cls: string
    ): void;

    removeTransitionClass(
      cls: string
    ): void;

    _enter(): void;

    _hasCancelCb: boolean;
    _cancelCb: (event: TransitionEvent) => void;

    enter(toggleDisplay?: () => void): void;
    leave(rm: () => void): void;

    _displayStyle?: string;
    setDisplayStyle(value?: string): void;
    getDisplayStyle(): string;

  }
}