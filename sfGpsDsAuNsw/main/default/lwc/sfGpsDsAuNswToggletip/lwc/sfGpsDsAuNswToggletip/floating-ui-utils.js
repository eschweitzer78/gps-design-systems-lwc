// https://github.com/floating-ui
export const sides = ["top", "right", "bottom", "left"];
export const alignments = ["start", "end"];
export const placements = sides.reduce(
  (acc, side) =>
    acc.concat(side, `${side}-${alignments[0]}`, `${side}-${alignments[1]}`),
  []
);

export const min = Math.min;
export const max = Math.max;
export const round = Math.round;
export const floor = Math.floor;
export const createCoords = (v) => ({ x: v, y: v });

const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};

const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};

export function clamp(start, value, end) {
  return max(start, min(value, end));
}

export function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}

export function getSide(placement) {
  return placement.split("-")[0];
}

export function getAlignment(placement) {
  return placement.split("-")[1];
}

export function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}

export function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}

export function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}

export function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}

export function getAlignmentSides(placement, rects, rtl = false) {
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);

  let mainAlignmentSide =
    alignmentAxis === "x"
      ? alignment === (rtl ? "end" : "start")
        ? "right"
        : "left"
      : alignment === "start"
        ? "bottom"
        : "top";

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }

  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}

export function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement)
  ];
}

export function getOppositeAlignmentPlacement(placement) {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment]
  );
}

function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];

  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}

export function getOppositeAxisPlacements(
  placement,
  flipAlignment,
  direction,
  rtl
) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);

  if (alignment) {
    list = list.map((side) => `${side}-${alignment}`);

    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }

  return list;
}

export function getOppositePlacement(placement) {
  return placement.replace(
    /left|right|bottom|top/g,
    (side) => oppositeSideMap[side]
  );
}

export function expandPaddingObject(padding) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...padding };
}

export function getPaddingObject(padding) {
  return typeof padding !== "number"
    ? expandPaddingObject(padding)
    : { top: padding, right: padding, bottom: padding, left: padding };
}

export function rectToClientRect(rect) {
  const { x, y, width, height } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
