import { getRectRelativeToOffsetParent } from "./floating-ui-dom-utils-getRectRelativeToOffsetParent";
import { getOffsetParent } from "./floating-ui-dom-platform-getOffsetParent";

export const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);

  const rv = {
    reference: getRectRelativeToOffsetParent(
      data.reference,
      await getOffsetParentFn(data.floating),
      data.strategy
    ),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };

  return rv;
};
