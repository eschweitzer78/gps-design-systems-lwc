import type { 
  Dimensions 
} from "./floating-ui-core";

import { 
  getCssDimensions 
} from "./floating-ui-dom-utils-getCssDimensions";


export function getDimensions(element: Element): Dimensions {
  const { width, height } = getCssDimensions(element);
  return { width, height };
}
