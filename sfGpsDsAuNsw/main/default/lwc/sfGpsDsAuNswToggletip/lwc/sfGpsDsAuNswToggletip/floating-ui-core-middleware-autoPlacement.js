import {
  evaluate,
  getAlignment,
  getAlignmentSides,
  getOppositeAlignmentPlacement,
  getSide,
  placements as ALL_PLACEMENTS
} from "./floating-ui-utils";
import { detectOverflow } from "./floating-ui-core-detectOverflow";

export function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment
    ? [
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) === alignment
        ),
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) !== alignment
        )
      ]
    : allowedPlacements.filter((placement) => getSide(placement) === placement);

  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return (
        getAlignment(placement) === alignment ||
        (autoAlignment
          ? getOppositeAlignmentPlacement(placement) !== placement
          : false)
      );
    }

    return true;
  });
}

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
export const autoPlacement = (options = {}) => ({
  name: "autoPlacement",
  options,
  async fn(state) {
    const { rects, middlewareData, placement, platform, elements } = state;

    const {
      crossAxis = false,
      alignment,
      allowedPlacements = ALL_PLACEMENTS,
      autoAlignment = true,
      ...detectOverflowOptions
    } = evaluate(options, state);

    const placements =
      alignment !== undefined || allowedPlacements === ALL_PLACEMENTS
        ? getPlacementList(alignment || null, autoAlignment, allowedPlacements)
        : allowedPlacements;

    const overflow = await detectOverflow(state, detectOverflowOptions);

    const currentIndex = middlewareData.autoPlacement?.index || 0;
    const currentPlacement = placements[currentIndex];

    if (currentPlacement == null) {
      return {};
    }

    const alignmentSides = getAlignmentSides(
      currentPlacement,
      rects,
      await platform.isRTL?.(elements.floating)
    );

    // Make `computeCoords` start from the right place.
    if (placement !== currentPlacement) {
      return {
        reset: {
          placement: placements[0]
        }
      };
    }

    const currentOverflows = [
      overflow[getSide(currentPlacement)],
      overflow[alignmentSides[0]],
      overflow[alignmentSides[1]]
    ];

    const allOverflows = [
      ...(middlewareData.autoPlacement?.overflows || []),
      { placement: currentPlacement, overflows: currentOverflows }
    ];

    const nextPlacement = placements[currentIndex + 1];

    // There are more placements to check.
    if (nextPlacement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows
        },
        reset: {
          placement: nextPlacement
        }
      };
    }

    const placementsSortedByMostSpace = allOverflows
      .map((d) => {
        // eslint-disable-next-line no-shadow
        const alignment = getAlignment(d.placement);
        return [
          d.placement,
          alignment && crossAxis
            ? // Check along the mainAxis and main crossAxis side.
              d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0)
            : // Check only the mainAxis.
              d.overflows[0],
          d.overflows
        ];
      })
      .sort((a, b) => a[1] - b[1]);

    const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(
      (d) =>
        d[2]
          .slice(
            0,
            // Aligned placements should not check their opposite crossAxis
            // side.
            getAlignment(d[0]) ? 2 : 3
          )
          .every((v) => v <= 0)
    );

    const resetPlacement =
      placementsThatFitOnEachSide[0]?.[0] || placementsSortedByMostSpace[0][0];

    if (resetPlacement !== placement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows
        },
        reset: {
          placement: resetPlacement
        }
      };
    }

    return {};
  }
});
