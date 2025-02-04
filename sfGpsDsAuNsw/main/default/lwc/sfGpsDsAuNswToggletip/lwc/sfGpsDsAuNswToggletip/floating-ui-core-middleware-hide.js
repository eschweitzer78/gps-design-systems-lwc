import { evaluate, sides } from "./floating-ui-utils";
import { detectOverflow } from "./floating-ui-core-detectOverflow";

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}

function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide = (options = {}) => ({
  name: "hide",
  options,
  async fn(state) {
    const { rects } = state;

    const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(
      options,
      state
    );

    switch (strategy) {
      case "referenceHidden": {
        const overflow = await detectOverflow(state, {
          ...detectOverflowOptions,
          elementContext: "reference"
        });
        const offsets = getSideOffsets(overflow, rects.reference);
        return {
          data: {
            referenceHiddenOffsets: offsets,
            referenceHidden: isAnySideFullyClipped(offsets)
          }
        };
      }
      case "escaped": {
        const overflow = await detectOverflow(state, {
          ...detectOverflowOptions,
          altBoundary: true
        });
        const offsets = getSideOffsets(overflow, rects.floating);
        return {
          data: {
            escapedOffsets: offsets,
            escaped: isAnySideFullyClipped(offsets)
          }
        };
      }
      default: {
        return {};
      }
    }
  }
});
