import { getComputedStyle } from "./floating-ui-utils-dom";

export function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
