// Based on v2.6.2

import { LightningElement, api } from "lwc";

export default class sfGpsDsAuVic2Link extends LightningElement {
  @api url;

  // These four are added to the original spec
  @api target;
  @api index;
  @api preventDefault;
  @api className;

  @api focus() {
    this.refs.a.focus();
  }

  handleClick(event) {
    if (this.preventDefault) {
      /* if preventDefault is set, we block the default url navigation and 
        dispatch a custom, non-bubbling click event */

      event.preventDefault();
      this.dispatchEvent(new CustomEvent("click"));
    }
  }
}
