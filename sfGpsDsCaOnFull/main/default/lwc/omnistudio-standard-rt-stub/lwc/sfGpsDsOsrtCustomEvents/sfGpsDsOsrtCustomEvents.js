export function makeEvent(name, detail) {
  return new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: detail
  });
}
