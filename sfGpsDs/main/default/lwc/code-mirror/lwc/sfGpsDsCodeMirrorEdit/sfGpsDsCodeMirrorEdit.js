// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { commands } from "./commands";

import { deleteNearSelection } from "./deleteNearSelection";

import {
  onDrop,
  onDragStart,
  onDragOver,
  clearDragCursor
} from "./drop_events";

import { fromTextArea } from "./fromTextArea";

import { ensureGlobalHandlers } from "./global_events";

import { dispatchKey, onKeyDown, onKeyUp, onKeyPress } from "./key_events";

import { addLegacyProps } from "./legacy";

import { CodeMirror } from "./main";

import methods from "./methods";

import { onMouseDown, clickInGutter, onContextMenu } from "./mouse_events";

import { Init, defaults, optionHandlers } from "./options";

import { themeChanged } from "./utils";

export {
  CodeMirror,
  commands,
  deleteNearSelection,
  onDrop,
  onDragStart,
  onDragOver,
  clearDragCursor,
  fromTextArea,
  ensureGlobalHandlers,
  dispatchKey,
  onKeyDown,
  onKeyUp,
  onKeyPress,
  addLegacyProps,
  methods,
  onMouseDown,
  clickInGutter,
  onContextMenu,
  Init,
  defaults,
  optionHandlers,
  themeChanged
};
