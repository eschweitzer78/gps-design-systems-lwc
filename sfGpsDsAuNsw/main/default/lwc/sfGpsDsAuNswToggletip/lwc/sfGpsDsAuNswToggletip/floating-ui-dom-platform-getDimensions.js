import { getCssDimensions } from "./floating-ui-dom-utils-getCssDimensions";

export function getDimensions(element) {
  const { width, height } = getCssDimensions(element);
  return { width, height };
}
