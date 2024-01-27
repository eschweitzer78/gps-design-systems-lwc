// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import {
  highlightLine,
  getLineStyles,
  getContextBefore,
  processLine,
  takeToken,
  retreatFrontier
} from "./highlight";

import {
  Line,
  updateLine,
  cleanUpLine,
  buildLineContent,
  defaultSpecialCharPlaceholder,
  LineView,
  buildViewArray
} from "./line_data";

import {
  Pos,
  cmp,
  equalCursorPos,
  copyPos,
  maxPos,
  minPos,
  clipLine,
  clipPos,
  clipPosArray
} from "./pos";

import {
  MarkedSpan,
  getMarkedSpanFor,
  removeMarkedSpan,
  addMarkedSpan,
  stretchSpansOverChange,
  removeReadOnlyRanges,
  detachMarkedSpans,
  attachMarkedSpans,
  compareCollapsedMarkers,
  collapsedSpanAtStart,
  collapsedSpanAtEnd,
  collapsedSpanAround,
  conflictingCollapsedRange,
  visualLine,
  visualLineEnd,
  visualLineContinued,
  visualLineNo,
  visualLineEndNo,
  lineIsHidden,
  heightAtLine,
  lineLength,
  findMaxLine
} from "./spans";

import {
  getLine,
  getBetween,
  getLines,
  updateLineHeight,
  lineNo,
  lineAtHeight,
  isLine,
  lineNumberFor
} from "./utils_line";

export {
  highlightLine,
  getLineStyles,
  getContextBefore,
  processLine,
  takeToken,
  retreatFrontier,
  Line,
  updateLine,
  cleanUpLine,
  buildLineContent,
  defaultSpecialCharPlaceholder,
  LineView,
  buildViewArray,
  Pos,
  cmp,
  equalCursorPos,
  copyPos,
  maxPos,
  minPos,
  clipLine,
  clipPos,
  clipPosArray,
  MarkedSpan,
  getMarkedSpanFor,
  removeMarkedSpan,
  addMarkedSpan,
  stretchSpansOverChange,
  removeReadOnlyRanges,
  detachMarkedSpans,
  attachMarkedSpans,
  compareCollapsedMarkers,
  collapsedSpanAtStart,
  collapsedSpanAtEnd,
  collapsedSpanAround,
  conflictingCollapsedRange,
  visualLine,
  visualLineEnd,
  visualLineContinued,
  visualLineNo,
  visualLineEndNo,
  lineIsHidden,
  heightAtLine,
  lineLength,
  findMaxLine,
  getLine,
  getBetween,
  getLines,
  updateLineHeight,
  lineNo,
  lineAtHeight,
  isLine,
  lineNumberFor
};
