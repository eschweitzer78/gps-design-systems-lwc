import { getWindowScrollBarX } from "./floating-ui-dom-utils-getWindowScrollBarX";

export function getHTMLOffset(
  documentElement,
  scroll,
  ignoreScrollbarX = false
) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x =
    htmlRect.left +
    scroll.scrollLeft -
    (ignoreScrollbarX
      ? 0
      : // RTL <body> scrollbar.
        getWindowScrollBarX(documentElement, htmlRect));
  const y = htmlRect.top + scroll.scrollTop;

  return {
    x,
    y
  };
}
