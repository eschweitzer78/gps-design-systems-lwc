import {
  clamp,
  evaluate,
  getOppositeAxis,
  getSide,
  getSideAxis
} from "./floating-ui-utils";

import { detectOverflow } from "./floating-ui-core-detectOverflow";

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
export const shift = (options = {}) => ({
  name: "shift",
  options,
  async fn(state) {
    const { x, y, placement } = state;

    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = false,
      limiter = {
        // eslint-disable-next-line no-shadow
        fn: ({ x, y }) => ({ x, y })
      },
      ...detectOverflowOptions
    } = evaluate(options, state);

    const coords = { x, y };
    const overflow = await detectOverflow(state, detectOverflowOptions);
    const crossAxis = getSideAxis(getSide(placement));
    const mainAxis = getOppositeAxis(crossAxis);

    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];

    if (checkMainAxis) {
      const minSide = mainAxis === "y" ? "top" : "left";
      const maxSide = mainAxis === "y" ? "bottom" : "right";
      const min = mainAxisCoord + overflow[minSide];
      const max = mainAxisCoord - overflow[maxSide];

      mainAxisCoord = clamp(min, mainAxisCoord, max);
    }

    if (checkCrossAxis) {
      const minSide = crossAxis === "y" ? "top" : "left";
      const maxSide = crossAxis === "y" ? "bottom" : "right";
      const min = crossAxisCoord + overflow[minSide];
      const max = crossAxisCoord - overflow[maxSide];

      crossAxisCoord = clamp(min, crossAxisCoord, max);
    }

    const limitedCoords = limiter.fn({
      ...state,
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord
    });

    return {
      ...limitedCoords,
      data: {
        x: limitedCoords.x - x,
        y: limitedCoords.y - y,
        enabled: {
          [mainAxis]: checkMainAxis,
          [crossAxis]: checkCrossAxis
        }
      }
    };
  }
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
export const limitShift = (options) => ({
  options,
  fn(state) {
    const { x, y, placement, rects, middlewareData } = state;

    const {
      offset = 0,
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true
    } = evaluate(options, state);

    const coords = { x, y };
    const crossAxis = getSideAxis(placement);
    const mainAxis = getOppositeAxis(crossAxis);

    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];

    const rawOffset = evaluate(offset, state);
    const computedOffset =
      typeof rawOffset === "number"
        ? { mainAxis: rawOffset, crossAxis: 0 }
        : { mainAxis: 0, crossAxis: 0, ...rawOffset };

    if (checkMainAxis) {
      const len = mainAxis === "y" ? "height" : "width";
      const limitMin =
        rects.reference[mainAxis] -
        rects.floating[len] +
        computedOffset.mainAxis;
      const limitMax =
        rects.reference[mainAxis] +
        rects.reference[len] -
        computedOffset.mainAxis;

      if (mainAxisCoord < limitMin) {
        mainAxisCoord = limitMin;
      } else if (mainAxisCoord > limitMax) {
        mainAxisCoord = limitMax;
      }
    }

    if (checkCrossAxis) {
      const len = mainAxis === "y" ? "width" : "height";
      const isOriginSide = ["top", "left"].includes(getSide(placement));
      const limitMin =
        rects.reference[crossAxis] -
        rects.floating[len] +
        (isOriginSide ? middlewareData.offset?.[crossAxis] || 0 : 0) +
        (isOriginSide ? 0 : computedOffset.crossAxis);
      const limitMax =
        rects.reference[crossAxis] +
        rects.reference[len] +
        (isOriginSide ? 0 : middlewareData.offset?.[crossAxis] || 0) -
        (isOriginSide ? computedOffset.crossAxis : 0);

      if (crossAxisCoord < limitMin) {
        crossAxisCoord = limitMin;
      } else if (crossAxisCoord > limitMax) {
        crossAxisCoord = limitMax;
      }
    }

    return {
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord
    };
  }
});
