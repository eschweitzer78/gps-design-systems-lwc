import { rectToClientRect } from "./floating-ui-core";
import { createCoords, max, min } from "./floating-ui-utils";
import {
  getComputedStyle,
  getDocumentElement,
  getNodeName,
  getOverflowAncestors,
  getParentNode,
  isContainingBlock,
  isHTMLElement,
  isLastTraversableNode,
  isOverflowElement,
  isTopLayer
} from "./floating-ui-utils-dom";
import { getBoundingClientRect } from "./floating-ui-dom-utils-getBoundingClientRect";
import { getDocumentRect } from "./floating-ui-dom-utils-getDocumentRect";
import { getViewportRect } from "./floating-ui-dom-utils-getViewportRect";
import { getVisualOffsets } from "./floating-ui-dom-utils-getVisualOffsets";
import { getScale } from "./floating-ui-dom-platform-getScale";
import { isElement } from "./floating-ui-dom-platform-isElement";

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;

  return {
    width,
    height,
    x,
    y
  };
}

function getClientRectFromClippingAncestor(
  element,
  clippingAncestor,
  strategy
) {
  let rect;

  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }

  return rectToClientRect(rect);
}

function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (
    parentNode === stopNode ||
    !isElement(parentNode) ||
    isLastTraversableNode(parentNode)
  ) {
    return false;
  }

  return (
    getComputedStyle(parentNode).position === "fixed" ||
    hasFixedPositionAncestor(parentNode, stopNode)
  );
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);

  if (cachedResult) {
    return cachedResult;
  }

  let result = getOverflowAncestors(element, [], false).filter(
    (el) => isElement(el) && getNodeName(el) !== "body"
  );
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);

    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }

    const shouldDropCurrentNode = elementIsFixed
      ? !currentNodeIsContaining && !currentContainingBlockComputedStyle
      : (!currentNodeIsContaining &&
          computedStyle.position === "static" &&
          !!currentContainingBlockComputedStyle &&
          ["absolute", "fixed"].includes(
            currentContainingBlockComputedStyle.position
          )) ||
        (isOverflowElement(currentNode) &&
          !currentNodeIsContaining &&
          hasFixedPositionAncestor(element, currentNode));

    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      // eslint-disable-next-line no-loop-func
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }

    currentNode = getParentNode(currentNode);
  }

  cache.set(element, result);

  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
export function getClippingRect(
  //this2,
  { element, boundary, rootBoundary, strategy }
) {
  const elementClippingAncestors =
    boundary === "clippingAncestors"
      ? isTopLayer(element)
        ? []
        : getClippingElementAncestors(element, this._c)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];

  const clippingRect = clippingAncestors.reduce(
    (accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(
        element,
        clippingAncestor,
        strategy
      );

      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);

      return accRect;
    },
    getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy)
  );

  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
