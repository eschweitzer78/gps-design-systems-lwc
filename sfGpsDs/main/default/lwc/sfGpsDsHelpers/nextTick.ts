const resolvedPromise = Promise.resolve();

export function nextTick(fn: (value: void) => void | PromiseLike<void>) {
  const p = resolvedPromise;
  return fn ? p.then(fn) : p;
}
