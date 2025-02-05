function hasWindow() {
  return typeof window !== "undefined";
}

export function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won"t occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return "#document";
}

export function getWindow(node) {
  return node?.ownerDocument?.defaultView || window;
}

export function getDocumentElement(node) {
  return (
    (isNode(node) ? node.ownerDocument : node.document) || window.document
  )?.documentElement;
}

export function isNode(value) {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Node || value instanceof getWindow(value).Node;
}

export function isElement(value) {
  if (!hasWindow()) {
    return false;
  }

  return value instanceof Element || value instanceof getWindow(value).Element;
}

export function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }

  return (
    value instanceof HTMLElement ||
    value instanceof getWindow(value).HTMLElement
  );
}

export function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }

  return (
    value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot
  );
}

export function isOverflowElement(element) {
  const { overflow, overflowX, overflowY, display } = getComputedStyle(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !["inline", "contents"].includes(display)
  );
}

export function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}

export function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}

export function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss)
    ? getComputedStyle(elementOrCss)
    : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== "none" ||
    css.perspective !== "none" ||
    (css.containerType ? css.containerType !== "normal" : false) ||
    (!webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false)) ||
    (!webkit && (css.filter ? css.filter !== "none" : false)) ||
    ["transform", "perspective", "filter"].some((value) =>
      (css.willChange || "").includes(value)
    ) ||
    ["paint", "layout", "strict", "content"].some((value) =>
      (css.contain || "").includes(value)
    )
  );
}

export function getContainingBlock(element) {
  let currentNode = getParentNode(element);

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }

    currentNode = getParentNode(currentNode);
  }

  return null;
}

export function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}

export function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}

export function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

export function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}

export function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }

  const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    (isShadowRoot(node) && node.host) ||
    // Fallback.
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}

export function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);

  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }

  return getNearestOverflowAncestor(parentNode);
}

export function getOverflowAncestors(node, list = [], traverseIframes = true) {
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === node.ownerDocument?.body;
  const win = getWindow(scrollableAncestor);

  if (isBody) {
    const frameElement = getFrameElement(win);

    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
      frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []
    );
  }

  return list.concat(
    scrollableAncestor,
    getOverflowAncestors(scrollableAncestor, [], traverseIframes)
  );
}

export function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent)
    ? win.frameElement
    : null;
}
