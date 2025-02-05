import { createCoords, round } from "./floating-ui-utils";
import { isHTMLElement } from "./floating-ui-utils-dom";
import { getCssDimensions } from "./floating-ui-dom-utils-getCssDimensions";
import { unwrapElement } from "./floating-ui-dom-utils-unwrapElement";

export function getScale(element) {
  const domElement = unwrapElement(element);

  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }

  const rect = domElement.getBoundingClientRect();
  const { width, height, $ } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }

  if (!y || !Number.isFinite(y)) {
    y = 1;
  }

  return {
    x,
    y
  };
}
