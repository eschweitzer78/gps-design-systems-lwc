import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import { computeClass } from "c/sfGpsDsHelpers";

const CLASS_NAME = "sfGpsDsAuVic2PrimaryNavQuickExit";
const DEBUG = false;

export default class extends FocusMixin(LightningElement, "exit") {
  @api url = "https://www.google.com";
  @api label = "Quick exit";
  @api parent;
  @api variant = "inline"; // inline, fixed

  get computedClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedClassName");

    const rv = computeClass({
      "rpl-primary-nav__quick-exit": true,
      "rpl-primary-nav__quick-exit--inline": this.variant === "inline",
      "rpl-primary-nav__quick-exit--fixed": this.variant === "fixed",
      "rpl-u-screen-only": true
    });

    if (DEBUG) console.debug(CLASS_NAME, "< computedClassName", rv);

    return rv;
  }

  /* lifecycle */

  connectedCallback() {
    if (DEBUG) console.debug(CLASS_NAME, "connectedCallback");
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("quickexit", {
        detail: {
          action: "click",
          text: this.label,
          value: this.url
        }
      })
    );

    const newTab = window.open(this.url, "_blank");

    if (newTab) {
      newTab.focus();
    }
  }

  handleBackFocus(event) {
    if (event.code === "Tab") {
      if (event.shiftKey) {
        //shift+tab pressed
        // Only hijack tabbing if the quick exit is within a menu
        if ((this.parent || this.navCollapsed) && this.variant !== "fixed") {
          event.preventDefault();
          // TODO setFocus
          // this.setFocus(this.navCollapsed ? 'menu:toggle' : `list:1:${this?.parent}`)
        }
      }
    }
  }
}
