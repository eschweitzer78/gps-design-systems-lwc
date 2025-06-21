import { 
  convertOffsetParentRelativeRectToViewportRelativeRect 
} from "./floating-ui-dom-platform-convertOffsetParentRelativeRectToViewportRelativeRect";
import { 
  getClientRects 
} from "./floating-ui-dom-platform-getClientRects";
import { 
  getClippingRect 
} from "./floating-ui-dom-platform-getClippingRect";
import { 
  getDimensions 
} from "./floating-ui-dom-platform-getDimensions";
import { 
  getDocumentElement 
} from "./floating-ui-dom-platform-getDocumentElement";
import { 
  getElementRects 
} from "./floating-ui-dom-platform-getElementRects";
import { 
  getOffsetParent 
} from "./floating-ui-dom-platform-getOffsetParent";
import { 
  getScale 
} from "./floating-ui-dom-platform-getScale";
import { 
  isElement 
} from "./floating-ui-dom-platform-isElement";
import { 
  isRTL 
} from "./floating-ui-dom-platform-isRTL";
import type { 
  Platform 
} from "./floating-ui-dom-types";

export const platform: Platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
