// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { scrollbarModel, wheelEventPixels } from "c/sfGpsDsCodeMirrorDisplay";
import {
  keyMap,
  keyName,
  isModifierKey,
  lookupKey,
  normalizeKeyMap,
  keyNames
} from "c/sfGpsDsCodeMirrorInput";
import { Line, cmp, Pos } from "c/sfGpsDsCodeMirrorLine";
import {
  changeEnd,
  Doc,
  LineWidget,
  SharedTextMarker,
  TextMarker
} from "c/sfGpsDsCodeMirrorModel";
import {
  copyState,
  extendMode,
  getMode,
  innerMode,
  mimeModes,
  modeExtensions,
  modes,
  resolveMode,
  startState
} from "c/sfGpsDsCodeMirrorModes";
import {
  addClass,
  contains,
  rmClass,
  e_preventDefault,
  e_stop,
  e_stopPropagation,
  off,
  on,
  signal,
  splitLinesAuto,
  countColumn,
  findColumn,
  isWordCharBasic,
  Pass,
  StringStream
} from "c/sfGpsDsCodeMirrorUtil";

import { commands } from "./commands.js";

export function addLegacyProps(CodeMirror) {
  CodeMirror.off = off;
  CodeMirror.on = on;
  CodeMirror.wheelEventPixels = wheelEventPixels;
  CodeMirror.Doc = Doc;
  CodeMirror.splitLines = splitLinesAuto;
  CodeMirror.countColumn = countColumn;
  CodeMirror.findColumn = findColumn;
  CodeMirror.isWordChar = isWordCharBasic;
  CodeMirror.Pass = Pass;
  CodeMirror.signal = signal;
  CodeMirror.Line = Line;
  CodeMirror.changeEnd = changeEnd;
  CodeMirror.scrollbarModel = scrollbarModel;
  CodeMirror.Pos = Pos;
  CodeMirror.cmpPos = cmp;
  CodeMirror.modes = modes;
  CodeMirror.mimeModes = mimeModes;
  CodeMirror.resolveMode = resolveMode;
  CodeMirror.getMode = getMode;
  CodeMirror.modeExtensions = modeExtensions;
  CodeMirror.extendMode = extendMode;
  CodeMirror.copyState = copyState;
  CodeMirror.startState = startState;
  CodeMirror.innerMode = innerMode;
  CodeMirror.commands = commands;
  CodeMirror.keyMap = keyMap;
  CodeMirror.keyName = keyName;
  CodeMirror.isModifierKey = isModifierKey;
  CodeMirror.lookupKey = lookupKey;
  CodeMirror.normalizeKeyMap = normalizeKeyMap;
  CodeMirror.StringStream = StringStream;
  CodeMirror.SharedTextMarker = SharedTextMarker;
  CodeMirror.TextMarker = TextMarker;
  CodeMirror.LineWidget = LineWidget;
  CodeMirror.e_preventDefault = e_preventDefault;
  CodeMirror.e_stopPropagation = e_stopPropagation;
  CodeMirror.e_stop = e_stop;
  CodeMirror.addClass = addClass;
  CodeMirror.contains = contains;
  CodeMirror.rmClass = rmClass;
  CodeMirror.keyNames = keyNames;
}
