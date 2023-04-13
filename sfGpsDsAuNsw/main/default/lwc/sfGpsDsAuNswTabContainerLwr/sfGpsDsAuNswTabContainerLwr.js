import { api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot tab1
 * @slot tab2
 * @slot tab3
 * @slot tab4
 * @slot tab5
 * @slot tab6
 * @slot tab7
 * @slot tab8
 * @slot tab9
 * @slot tab10
 */

export default class SfGpsDsAuNswTabContainerLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api title;
  @api tab1Label;
  @api tab2Label;
  @api tab3Label;
  @api tab4Label;
  @api tab5Label;
  @api tab6Label;
  @api tab7Label;
  @api tab8Label;
  @api tab9Label;
  @api tab10Label;
  @api tabPaddingStyle = "full";
  @api tabBorderStyle = "border";

  get _tabClassName() {
    return computeClass({
      "nsw-tabs__content": true,
      "nsw-tabs__content--flush": this.tabPaddingStyle === "flush",
      "nsw-tabs__content--side-flush": this.tabPaddingStyle === "side-flush",
      "nsw-tabs__content--no-border": this.tabBorderStyle === "no-border"
    });
  }

  /* lifecycle */

  @track isAura = false;

  connectedCallback() {
    // eslint-disable-next-line dot-notation
    if (window["$A"] !== undefined && window["$A"] !== null) {
      this.isAura = true;
      this.addError("CO-AU", "Not compatible with Aura runtime.");
    }

    this.classList.add("nsw-scope");
  }
}
