// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { clearCaches } from "c/sfGpsDsCodeMirrorMeasurement";

export function themeChanged(cm) {
  cm.display.wrapper.className =
    cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
    cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
  clearCaches(cm);
}
