// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// EDITOR CONSTRUCTOR

/* eslint-disable no-prototype-builtins */

import { CodeMirror } from "./CodeMirror.js";
export { CodeMirror } from "./CodeMirror.js";

import { eventMixin, indexOf } from "c/sfGpsDsCodeMirrorUtil";

import { defineOptions } from "./options.js";

defineOptions(CodeMirror);

import addEditorMethods from "./methods.js";

addEditorMethods(CodeMirror);

import { Doc } from "c/sfGpsDsCodeMirrorModel";

// Set up methods on CodeMirror's prototype to redirect to the editor's document.
let dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
for (let prop in Doc.prototype)
  if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function (method) {
      return function () {
        return method.apply(this.doc, arguments);
      };
    })(Doc.prototype[prop]);

eventMixin(Doc);

// INPUT HANDLING

import { ContentEditableInput, TextareaInput } from "c/sfGpsDsCodeMirrorInput";
CodeMirror.inputStyles = {
  textarea: TextareaInput,
  contenteditable: ContentEditableInput
};

// MODE DEFINITION AND QUERYING

import { defineMIME, defineMode } from "c/sfGpsDsCodeMirrorModes";

// Extra arguments are stored as the mode's dependencies, which is
// used by (legacy) mechanisms like loadmode.js to automatically
// load a mode. (Preferred mechanism is the require/define calls.)
CodeMirror.defineMode = function (name /*, mode, …*/) {
  if (!CodeMirror.defaults.mode && name !== "null")
    CodeMirror.defaults.mode = name;
  defineMode.apply(this, arguments);
};

CodeMirror.defineMIME = defineMIME;

// Minimal default mode.
CodeMirror.defineMode("null", () => ({
  token: (stream) => stream.skipToEnd()
}));
CodeMirror.defineMIME("text/plain", "null");

// EXTENSIONS

CodeMirror.defineExtension = (name, func) => {
  CodeMirror.prototype[name] = func;
};
CodeMirror.defineDocExtension = (name, func) => {
  Doc.prototype[name] = func;
};

import { fromTextArea } from "./fromTextArea.js";

CodeMirror.fromTextArea = fromTextArea;

import { addLegacyProps } from "./legacy.js";

addLegacyProps(CodeMirror);

CodeMirror.version = "5.65.15";
