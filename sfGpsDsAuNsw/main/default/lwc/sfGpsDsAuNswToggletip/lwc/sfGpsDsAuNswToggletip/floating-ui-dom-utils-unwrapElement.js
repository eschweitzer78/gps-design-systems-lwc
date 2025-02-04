import { isElement } from "./floating-ui-dom-platform-isElement";

export function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
