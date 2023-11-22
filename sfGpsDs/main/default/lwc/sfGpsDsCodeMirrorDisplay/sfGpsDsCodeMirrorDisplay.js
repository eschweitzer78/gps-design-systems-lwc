// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { Display } from "./Display";

import { ensureFocus, delayBlurEvent, onFocus, onBlur } from "./focus";

import { getGutters, renderGutters, updateGutters } from "./gutters";

import { startWorker } from "./highlight_worker";

import { alignHorizontally, maybeUpdateLineNumberWidth } from "./line_numbers";

import { loadMode, resetModeState } from "./mode_state";

import {
  startOperation,
  endOperation,
  runInOp,
  operation,
  methodOp,
  docMethodOp
} from "./operations";

import { wheelEventPixels, onScrollWheel } from "./scroll_events";

import {
  measureForScrollbars,
  updateScrollbars,
  scrollbarModel,
  initScrollbars
} from "./scrollbars";

import {
  maybeScrollWindow,
  scrollPosIntoView,
  scrollIntoView,
  addToScrollTop,
  ensureCursorVisible,
  scrollToCoords,
  scrollToRange,
  scrollToCoordsRange,
  updateScrollTop,
  setScrollTop,
  setScrollLeft
} from "./scrolling";

import {
  updateSelection,
  prepareSelection,
  drawSelectionCursor,
  restartBlink
} from "./selection";

import {
  DisplayUpdate,
  maybeClipScrollbars,
  updateDisplayIfNeeded,
  postUpdateDisplay,
  updateDisplaySimple,
  updateGutterSpace,
  setDocumentHeight
} from "./update_display";

import { updateLineForChanges, buildLineElement } from "./update_line";

import { updateHeightsInViewport, visibleLines } from "./update_lines";

import {
  regChange,
  regLineChange,
  resetView,
  adjustView,
  countDirtyView
} from "./view_tracking";

export {
  Display,
  ensureFocus,
  delayBlurEvent,
  onFocus,
  onBlur,
  getGutters,
  renderGutters,
  updateGutters,
  startWorker,
  alignHorizontally,
  maybeUpdateLineNumberWidth,
  loadMode,
  resetModeState,
  startOperation,
  endOperation,
  runInOp,
  operation,
  methodOp,
  docMethodOp,
  wheelEventPixels,
  onScrollWheel,
  measureForScrollbars,
  updateScrollbars,
  scrollbarModel,
  initScrollbars,
  maybeScrollWindow,
  scrollPosIntoView,
  scrollIntoView,
  addToScrollTop,
  ensureCursorVisible,
  scrollToCoords,
  scrollToRange,
  scrollToCoordsRange,
  updateScrollTop,
  setScrollTop,
  setScrollLeft,
  updateSelection,
  prepareSelection,
  drawSelectionCursor,
  restartBlink,
  DisplayUpdate,
  maybeClipScrollbars,
  updateDisplayIfNeeded,
  postUpdateDisplay,
  updateDisplaySimple,
  updateGutterSpace,
  setDocumentHeight,
  updateLineForChanges,
  buildLineElement,
  updateHeightsInViewport,
  visibleLines,
  regChange,
  regLineChange,
  resetView,
  adjustView,
  countDirtyView
};
