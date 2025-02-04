import { getNodeScroll } from "./floating-ui-utils-dom";

import { getDocumentElement } from "./floating-ui-dom-platform-getDocumentElement";
import { getBoundingClientRect } from "./floating-ui-dom-utils-getBoundingClientRect";

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
export function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;

  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }

  return rect.left + leftScroll;
}
