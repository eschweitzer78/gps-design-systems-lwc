import { getWindow, isWebKit } from "./floating-ui-utils-dom";
import { getDocumentElement } from "./floating-ui-dom-platform-getDocumentElement";

export function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    const visualViewportBased = isWebKit();

    if (!visualViewportBased || (visualViewportBased && strategy === "fixed")) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width,
    height,
    x,
    y
  };
}
