// check whether conditional need to hide or not(for design mode)
// we're exposing this as a global here instead of as an instance
// variable for performance. Since the hide conditional is either
// on or off for the whole OmniScript, we can safely do this.
const IS_HIDE_CONDITIONAL_ELEMENT_MAP = new Map();
export function setDesignerHideElementFlag(omniscriptid, value) {
  if (omniscriptid) {
    IS_HIDE_CONDITIONAL_ELEMENT_MAP.set(omniscriptid.substring(0, 15), value);
  }
}

export function getDesignerHideElementFlag(omniscriptid) {
  if (!omniscriptid) {
    return false;
  }
  return !!IS_HIDE_CONDITIONAL_ELEMENT_MAP.get(omniscriptid.substring(0, 15));
}
