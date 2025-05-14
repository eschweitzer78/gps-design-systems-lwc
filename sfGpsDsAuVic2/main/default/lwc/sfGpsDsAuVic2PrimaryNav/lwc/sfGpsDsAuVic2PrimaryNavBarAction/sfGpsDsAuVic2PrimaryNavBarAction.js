// Based on RplPrimaryNavBarAction v2.6.2

import { LightningElement, api } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2PrimaryNavBarAction";

export default class extends FocusMixin(LightningElement, "action") {
  @api type = "link";
  @api itemId;
  @api href;
  @api active = false;
  @api className = "";

  /* getters */

  get isToggle() {
    return this.type === "toggle";
  }

  get computedClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedClassName");

    const rv = computeClass({
      "rpl-primary-nav__nav-bar-action": true,
      "rpl-primary-nav__nav-bar-action--toggle": this.type === "toggle",
      "rpl-primary-nav__nav-bar-action--link": this.type === "link",
      "rpl-primary-nav__nav-bar-action--active": this.active,
      "rpl-type-label-small": true,
      "rpl-type-weight-bold": true,
      "rpl-u-focusable-block": true,
      [this.className]: this.className
    });

    if (DEBUG) console.debug(CLASS_NAME, "< computedClassName", rv);

    return rv;
  }

  /* event management */

  handleFocus(event) {
    if (!this.active) return;

    if (
      !event.code !== "Tab" ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;

    event.preventDefault();

    if (this.hasQuickExit) {
      this.setFocus("links:exit");
      return;
    } else if (this.focusTarget.hasUserActions) {
      this.setFocus("user-actions");
      return;
    }

    this.setFocus(
      this.focusKey === "menu:toggle" ? "list:home" : `list:2:${this.itemId}`
    );
  }

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: this.itemId
      })
    );
  }

  handleNavigate(event) {
    event.preventDefault(); // Don't let nav happen and report to parent
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click:navbar",
          itemId: this.itemId
        },
        composed: true,
        bubbles: true
      })
    );
  }
}
