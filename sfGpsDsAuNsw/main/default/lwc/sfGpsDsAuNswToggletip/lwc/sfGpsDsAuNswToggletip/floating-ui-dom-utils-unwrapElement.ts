import { 
  isElement 
} from "./floating-ui-dom-platform-isElement";
import type { 
  VirtualElement 
} from "./floating-ui-dom-types";

export function unwrapElement(
  element: Element | VirtualElement
) {
  return !isElement(element) ? (element as VirtualElement).contextElement : element;
}
