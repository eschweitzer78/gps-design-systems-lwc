import {
  getComputedStyle,
  getContainingBlock,
  getDocumentElement,
  getParentNode,
  getWindow,
  isContainingBlock,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isTableElement,
  isTopLayer
} from "./floating-ui-utils-dom";
import { isStaticPositioned } from "./floating-ui-dom-utils-isStaticPositioned";

function getTrueOffsetParent(element, polyfill) {
  if (
    !isHTMLElement(element) ||
    getComputedStyle(element).position === "fixed"
  ) {
    return null;
  }

  if (polyfill) {
    return polyfill(element);
  }

  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it"s non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }

  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
export function getOffsetParent(element, polyfill) {
  const win = getWindow(element);

  if (isTopLayer(element)) {
    return win;
  }

  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }

  let offsetParent = getTrueOffsetParent(element, polyfill);

  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    isStaticPositioned(offsetParent)
  ) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }

  if (
    offsetParent &&
    isLastTraversableNode(offsetParent) &&
    isStaticPositioned(offsetParent) &&
    !isContainingBlock(offsetParent)
  ) {
    return win;
  }

  return offsetParent || getContainingBlock(element) || win;
}
