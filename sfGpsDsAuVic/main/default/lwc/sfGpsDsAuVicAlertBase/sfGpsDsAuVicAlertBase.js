import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicAlert extends LightningElement {
  static renderMode = "light";

  @api backgroundColor = "dark_neutral";
  @api textColor = "white";
  @api iconColor = "white";
  @api iconSymbol = "alert_information";
  @api closeText = "Close";
  @api closeIconColor = "white";

  @track visible = true;

  handleClick(event) {
    event.stopPropagation();
    this.visible = false;
    this.dispatchEvent(new CustomEvent("close"));
  }

  get computedBaseClassName() {
    return computeClass({
      "rpl-alert-base": true,
      [`rpl-alert-base--color-${this.backgroundColor?.replace(/\s/g, "")}`]:
        this.backgroundColor
    });
  }

  get computedContentClassName() {
    return computeClass({
      "rpl-alert-base__content": true,
      [`rpl-alert-base__content--color-${this.textColor?.replace(/\s/g, "")}`]:
        this.textColor
    });
  }
}
