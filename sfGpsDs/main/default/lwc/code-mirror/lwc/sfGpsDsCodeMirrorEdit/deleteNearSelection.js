// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import { runInOp, ensureCursorVisible } from "c/sfGpsDsCodeMirrorDisplay";
import { cmp } from "c/sfGpsDsCodeMirrorLine";
import { replaceRange } from "c/sfGpsDsCodeMirrorModel";
import { lst } from "c/sfGpsDsCodeMirrorUtil";

// Helper for deleting text near the selection(s), used to implement
// backspace, delete, and similar functionality.
export function deleteNearSelection(cm, compute) {
  let ranges = cm.doc.sel.ranges,
    kill = [];
  // Build up a set of ranges to kill first, merging overlapping
  // ranges.
  for (let i = 0; i < ranges.length; i++) {
    let toKill = compute(ranges[i]);
    while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
      let replaced = kill.pop();
      if (cmp(replaced.from, toKill.from) < 0) {
        toKill.from = replaced.from;
        break;
      }
    }
    kill.push(toKill);
  }
  // Next, remove those actual ranges.
  runInOp(cm, () => {
    for (let i = kill.length - 1; i >= 0; i--)
      replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
    ensureCursorVisible(cm);
  });
}
