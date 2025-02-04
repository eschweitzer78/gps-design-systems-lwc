import {
  evaluate,
  getAlignmentSides,
  getExpandedPlacements,
  getOppositeAxisPlacements,
  getOppositePlacement,
  getSide,
  getSideAxis
} from "./floating-ui-utils";

import { detectOverflow } from "./floating-ui-core-detectOverflow";

export const flip = (options = {}) => ({
  name: "flip",
  options,
  async fn(state) {
    const {
      placement,
      middlewareData,
      rects,
      initialPlacement,
      platform,
      elements
    } = state;

    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
      fallbackPlacements: specifiedFallbackPlacements,
      fallbackStrategy = "bestFit",
      fallbackAxisSideDirection = "none",
      flipAlignment = true,
      ...detectOverflowOptions
    } = evaluate(options, state);

    // If a reset by the arrow was caused due to an alignment offset being
    // added, we should skip any logic now since `flip()` has already done its
    // work.
    // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
    if (middlewareData.arrow?.alignmentOffset) {
      return {};
    }

    const side = getSide(placement);
    const initialSideAxis = getSideAxis(initialPlacement);
    const isBasePlacement = getSide(initialPlacement) === initialPlacement;
    const rtl = await platform.isRTL?.(elements.floating);

    const fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !flipAlignment
        ? [getOppositePlacement(initialPlacement)]
        : getExpandedPlacements(initialPlacement));

    const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";

    if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
      fallbackPlacements.push(
        ...getOppositeAxisPlacements(
          initialPlacement,
          flipAlignment,
          fallbackAxisSideDirection,
          rtl
        )
      );
    }

    const placements = [initialPlacement, ...fallbackPlacements];

    const overflow = await detectOverflow(state, detectOverflowOptions);

    const overflows = [];
    let overflowsData = middlewareData.flip?.overflows || [];

    if (checkMainAxis) {
      overflows.push(overflow[side]);
    }

    if (checkCrossAxis) {
      const sides = getAlignmentSides(placement, rects, rtl);
      overflows.push(overflow[sides[0]], overflow[sides[1]]);
    }

    overflowsData = [...overflowsData, { placement, overflows }];

    // One or more sides is overflowing.
    // eslint-disable-next-line no-shadow
    if (!overflows.every((side) => side <= 0)) {
      const nextIndex = (middlewareData.flip?.index || 0) + 1;
      const nextPlacement = placements[nextIndex];

      if (nextPlacement) {
        // Try next placement and re-run the lifecycle.
        return {
          data: {
            index: nextIndex,
            overflows: overflowsData
          },
          reset: {
            placement: nextPlacement
          }
        };
      }

      // First, find the candidates that fit on the mainAxis side of overflow,
      // then find the placement that fits the best on the main crossAxis side.
      let resetPlacement = overflowsData
        .filter((d) => d.overflows[0] <= 0)
        .sort((a, b) => a.overflows[1] - b.overflows[1])[0]?.placement;

      // Otherwise fallback.
      if (!resetPlacement) {
        switch (fallbackStrategy) {
          case "bestFit": {
            // eslint-disable-next-line no-shadow
            const placement = overflowsData
              .filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return (
                    currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y"
                  );
                }
                return true;
              })
              .map((d) => [
                d.placement,
                d.overflows
                  // eslint-disable-next-line no-shadow
                  .filter((overflow) => overflow > 0)
                  // eslint-disable-next-line no-shadow
                  .reduce((acc, overflow) => acc + overflow, 0)
              ])
              .sort((a, b) => a[1] - b[1])[0]?.[0];
            if (placement) {
              resetPlacement = placement;
            }
            break;
          }
          case "initialPlacement":
            resetPlacement = initialPlacement;
            break;
          default:
        }
      }

      if (placement !== resetPlacement) {
        return {
          reset: {
            placement: resetPlacement
          }
        };
      }
    }
    return {};
  }
});
