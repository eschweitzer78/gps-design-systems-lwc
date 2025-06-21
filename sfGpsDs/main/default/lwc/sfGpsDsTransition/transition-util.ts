import { isArray, isObject, toNumber } from "c/sfGpsDsHelpers";
import type { 
  CSSDelays, 
  CSSDurations,
  DurationObject, 
  Duration,
  TransitionHook
} from "c/sfGpsDsTransition";

export function isValidDuration(
  value: any
): boolean {
  return typeof value === "number" && !Number.isNaN(value);
}

export function getHookArgumentsLength(fn: TransitionHook) {
  if (fn === undefined || fn === null) {
    return false;
  }

  const invokerFns = fn.fns;
  if (invokerFns !== undefined && invokerFns !== null) {
    // invoker
    return getHookArgumentsLength(
      isArray(invokerFns) 
        ? (invokerFns as TransitionHook[])[0] 
        : invokerFns as TransitionHook
    );
  }
  return (fn._length || fn.length) > 1;
}

export function normaliseDuration(duration: any): Duration | undefined {
  if (duration == null) {
    return undefined;
  }

  if (isObject(duration)) {
    return [
      toNumber((duration as DurationObject).enter), 
      toNumber((duration as DurationObject).leave)
    ];
  }

  const n = toNumber(duration);
  return [n, n];
}

export function nextFrame(cb: FrameRequestCallback) {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  requestAnimationFrame(() => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(cb);
  });
}

export function toMs(s: string): number {
  return Number(s.slice(0, -1).replace(",", ".")) * 1000;
}

export function getTimeout(
  delays: CSSDelays, 
  durations: CSSDurations
): number {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(
    null,
    durations.map((d, i) => {
      return toMs(d) + toMs(delays[i]);
    })
  );
}
