import { getComputedStyle } from "./floating-ui-utils-dom";

export function isStaticPositioned(element) {
  return getComputedStyle(element).position === "static";
}
