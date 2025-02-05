// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Optimize some code when these features are not used.
export let sawReadOnlySpans = false,
  sawCollapsedSpans = false;

export function seeReadOnlySpans() {
  sawReadOnlySpans = true;
}

export function seeCollapsedSpans() {
  sawCollapsedSpans = true;
}
