// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import {
  changeEnd,
  computeSelAfterChange,
  computeReplacedSel
} from "./change_measurement";

import {
  makeChange,
  makeChangeFromHistory,
  replaceRange,
  changeLine
} from "./changes";

import { LeafChunk, BranchChunk } from "./chunk";

import Doc from "./Doc";

import {
  isWholeLineUpdate,
  updateDoc,
  linkedDocs,
  attachDoc,
  directionChanged
} from "./document_data";

import {
  History,
  historyChangeFromChange,
  addChangeToHistory,
  addSelectionToHistory,
  pushSelectionToHistory,
  mergeOldSpans,
  copyHistoryArray
} from "./history";

import { LineWidget, addLineWidget } from "./line_widget";

import {
  TextMarker,
  markText,
  SharedTextMarker,
  findSharedMarkers,
  copySharedMarkers,
  detachSharedMarkers
} from "./mark_text";

import {
  extendRange,
  extendSelection,
  extendSelections,
  replaceOneSelection,
  setSimpleSelection,
  setSelectionReplaceHistory,
  setSelection,
  setSelectionNoUndo,
  reCheckSelection,
  skipAtomic,
  selectAll
} from "./selection_updates";

import {
  Range,
  Selection,
  normalizeSelection,
  simpleSelection
} from "./selection";

export {
  changeEnd,
  computeSelAfterChange,
  computeReplacedSel,
  makeChange,
  makeChangeFromHistory,
  replaceRange,
  changeLine,
  LeafChunk,
  BranchChunk,
  Doc,
  isWholeLineUpdate,
  updateDoc,
  linkedDocs,
  attachDoc,
  directionChanged,
  History,
  historyChangeFromChange,
  addChangeToHistory,
  addSelectionToHistory,
  pushSelectionToHistory,
  mergeOldSpans,
  copyHistoryArray,
  LineWidget,
  addLineWidget,
  TextMarker,
  markText,
  SharedTextMarker,
  findSharedMarkers,
  copySharedMarkers,
  detachSharedMarkers,
  extendRange,
  extendSelection,
  extendSelections,
  replaceOneSelection,
  setSimpleSelection,
  setSelectionReplaceHistory,
  setSelection,
  setSelectionNoUndo,
  reCheckSelection,
  skipAtomic,
  selectAll,
  Range,
  Selection,
  normalizeSelection,
  simpleSelection
};
