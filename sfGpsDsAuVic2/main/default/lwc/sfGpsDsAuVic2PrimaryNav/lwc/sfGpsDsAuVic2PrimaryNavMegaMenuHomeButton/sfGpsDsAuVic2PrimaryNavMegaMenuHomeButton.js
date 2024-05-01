// Based on v2.6.2

import { LightningElement } from "lwc";
import FocusMixin from "c/sfGpsDsAuVic2PrimaryNavFocusMixin";

export default class extends FocusMixin(LightningElement, "home") {
  handleKeydown(event) {
    if (
      event.code === "Tab" &&
      event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      //shift+tab pressed
      event.preventDefault();
      this.setFocus("menu:toggle");
    }
  }
}
