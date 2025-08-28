export function mergeJSONLogic(a, b) {
  // if one of them is an array, we just overwrite it
  // if one of them is null, just overwrite it
  if (
    (a && Array.isArray(a)) ||
    (b && Array.isArray(b)) ||
    a === null ||
    b === null
  ) {
    return b;
  }
  if (b === undefined) {
    return null;
  }
  return undefined;
}

export function mergeJSONLogicOverwrite(a, b) {
  // overwrite everything
  return b;
}
