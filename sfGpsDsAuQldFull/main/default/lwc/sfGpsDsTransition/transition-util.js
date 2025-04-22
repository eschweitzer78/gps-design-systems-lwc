import { isArray, isObject, toNumber } from "c/sfGpsDsHelpers";

export function isValidDuration(val) {
  return typeof val === "number" && !Number.isNaN(val);
}

export function getHookArgumentsLength(fn) {
  if (fn === undefined || fn === null) {
    return false;
  }

  const invokerFns = fn.fns;
  if (invokerFns !== undefined && invokerFns !== null) {
    // invoker
    return getHookArgumentsLength(
      isArray(invokerFns) ? invokerFns[0] : invokerFns
    );
  }
  return (fn._length || fn.length) > 1;
}

export function once(fn) {
  let called = false;

  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

export function normaliseDuration(duration) {
  if (duration == null) {
    return null;
  }

  if (isObject(duration)) {
    return [toNumber(duration.enter), toNumber(duration.leave)];
  }

  const n = toNumber(duration);
  return [n, n];
}

export function nextFrame(cb) {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  requestAnimationFrame(() => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    requestAnimationFrame(cb);
  });
}

export function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1000;
}

export function getTimeout(delays, durations) {
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
