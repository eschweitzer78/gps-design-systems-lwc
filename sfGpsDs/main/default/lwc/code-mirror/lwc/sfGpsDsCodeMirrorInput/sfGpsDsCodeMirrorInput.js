// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import ContentEditableInput from "./ContentEditableInput";

import { indentLine } from "./indent";

import {
  lastCopied,
  setLastCopied,
  applyTextInput,
  handlePaste,
  triggerElectric,
  copyableRanges,
  disableBrowserMagic,
  hiddenTextarea
} from "./input";

import {
  keyMap,
  normalizeKeyMap,
  lookupKey,
  isModifierKey,
  addModifierNames,
  keyName,
  getKeyMap
} from "./keymap";

import { keyNames } from "./keynames";

import { moveLogically, endOfLine, moveVisually } from "./movement";

import TextareaInput from "./TextareaInput";

export {
  ContentEditableInput,
  indentLine,
  lastCopied,
  setLastCopied,
  applyTextInput,
  handlePaste,
  triggerElectric,
  copyableRanges,
  disableBrowserMagic,
  hiddenTextarea,
  keyMap,
  normalizeKeyMap,
  lookupKey,
  isModifierKey,
  addModifierNames,
  keyName,
  getKeyMap,
  keyNames,
  moveLogically,
  endOfLine,
  moveVisually,
  TextareaInput
};
