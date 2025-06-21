import { 
  getComputedStyle 
} from "./floating-ui-utils-dom";

export function isRTL(
  element: Element
): boolean {
  return getComputedStyle(element).direction === "rtl";
}
