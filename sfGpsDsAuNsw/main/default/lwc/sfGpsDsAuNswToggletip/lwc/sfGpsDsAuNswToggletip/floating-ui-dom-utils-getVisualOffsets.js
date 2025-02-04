import { createCoords } from "./floating-ui-utils";
import { getWindow, isWebKit } from "./floating-ui-utils-dom";

const noOffsets = createCoords(0);

export function getVisualOffsets(element) {
  const win = getWindow(element);

  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }

  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}

export function shouldAddVisualOffsets(
  element,
  isFixed = false,
  floatingOffsetParent
) {
  if (
    !floatingOffsetParent ||
    (isFixed && floatingOffsetParent !== getWindow(element))
  ) {
    return false;
  }

  return isFixed;
}
