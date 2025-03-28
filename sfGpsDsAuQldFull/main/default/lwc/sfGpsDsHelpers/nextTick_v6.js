const resolvedPromise = Promise.resolve();

export function nextTick(fn) {
  const p = resolvedPromise;
  return fn ? p.then(fn) : p;
}
