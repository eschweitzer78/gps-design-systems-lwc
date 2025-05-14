import { api } from "lwc";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2PrimaryNavFocusMixin";

let PrimaryNavFocusMixin = (Base, el, key = null) =>
  class extends Base {
    focusElement = typeof el === "function" ? el.bind(this) : el;

    @api focusKey = typeof key === "function" ? key.bind(this) : key;
    @api focusTarget; // { navCollapsed, hasQuickExit, hasUserActions }

    setFocus(target) {
      if (DEBUG) console.debug(CLASS_NAME, "setFocus", target);

      this.dispatchEvent(
        new CustomEvent("sfgpsdsauvic2primarynavfocus", {
          detail: target,
          bubbles: true,
          composed: true
        })
      );
    }

    @api notifyFocus(targetFocusKey) {
      const focusKey =
        typeof this.focusKey === "function" ? this.focusKey() : this.focusKey;
      const fe = this.focusElement;

      if (DEBUG)
        console.debug(CLASS_NAME, "> notifyFocus", targetFocusKey, focusKey);

      if (focusKey && targetFocusKey === focusKey) {
        if (fe) {
          switch (typeof fe) {
            case "function":
              fe();
              break;

            case "string":
              this.refs[fe]?.focus();
              break;

            case "object":
              if (fe.focus && typeof fe.focus === "function") {
                fe.focus();
              }
              break;

            default:
          }
        }
      } else {
        const dfks = this.template.querySelectorAll("[data-focus-key]");

        for (let i = 0; i < dfks.length; i++) {
          if (dfks[i].notifyFocus) {
            dfks[i].notifyFocus(targetFocusKey);
          }
        }
      }

      if (DEBUG) console.debug(CLASS_NAME, "< notifyFocus");
    }
  };

export default PrimaryNavFocusMixin;
