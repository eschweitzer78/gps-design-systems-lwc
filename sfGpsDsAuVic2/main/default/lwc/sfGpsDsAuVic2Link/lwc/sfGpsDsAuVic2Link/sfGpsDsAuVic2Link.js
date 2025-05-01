// Based on v2.6.2

import { LightningElement, api } from "lwc";

export default class sfGpsDsAuVic2Link extends LightningElement {
  static renderMode = "light";

  @api url;

  // These four are added to the original spec
  @api target;
  @api index;
  @api preventDefault;
  @api tabIndex;
  @api className;

  @api focus() {
    this.refs.a.focus();
  }

  handleClick(event) {
    if (this.preventDefault) {
      /* if preventDefault is set, we block the default url navigation and 
        but the click will carry on propagating to the parent */

      event.preventDefault();
    }
  }
}
