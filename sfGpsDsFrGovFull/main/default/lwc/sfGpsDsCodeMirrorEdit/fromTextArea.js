// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { CodeMirror } from "./CodeMirror.js";
import { activeElt, rootNode, off, on, copyObj } from "c/sfGpsDsCodeMirrorUtil";

/* eslint-disable no-empty */
/* eslint-disable no-shadow */

export function fromTextArea(textarea, options) {
  textarea.style.display = "none";
  let cm = CodeMirror(
    (node) => textarea.parentNode.insertBefore(node, textarea.nextSibling),
    options
  );

  options = options ? copyObj(options) : {};
  options.value = textarea.value;
  if (!options.tabindex && textarea.tabIndex)
    options.tabindex = textarea.tabIndex;
  if (!options.placeholder && textarea.placeholder)
    options.placeholder = textarea.placeholder;
  // Set autofocus to true if this textarea is focused, or if it has
  // autofocus and no other element is focused.
  if (options.autofocus == null) {
    let hasFocus = activeElt(rootNode(textarea));
    options.autofocus =
      hasFocus === textarea ||
      (textarea.getAttribute("autofocus") != null &&
        hasFocus === document.body);
  }

  function save() {
    textarea.value = cm.getValue();
  }

  let realSubmit;
  if (textarea.form) {
    on(textarea.form, "submit", save);
    // Deplorable hack to make the submit method do the right thing.
    if (!options.leaveSubmitMethodAlone) {
      let form = textarea.form;
      realSubmit = form.submit;
      try {
        let wrappedSubmit = (form.submit = () => {
          save();
          form.submit = realSubmit;
          form.submit();
          form.submit = wrappedSubmit;
        });
      } catch (e) {}
    }
  }

  options.finishInit = (cm) => {
    cm.save = save;
    cm.getTextArea = () => textarea;
    cm.toTextArea = () => {
      cm.toTextArea = isNaN; // Prevent this from being ran twice
      save();
      textarea.parentNode.removeChild(cm.getWrapperElement());
      textarea.style.display = "";
      if (textarea.form) {
        off(textarea.form, "submit", save);
        if (
          !options.leaveSubmitMethodAlone &&
          typeof textarea.form.submit == "function"
        )
          textarea.form.submit = realSubmit;
      }
    };
  };

  return cm;
}
