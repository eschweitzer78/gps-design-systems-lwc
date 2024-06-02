import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Tab1
 * @slot Tab2
 * @slot Tab3
 * @slot Tab4
 * @slot Tab5
 * @slot Tab6
 * @slot Tab7
 * @slot Tab8
 * @slot Tab9
 * @slot Tab10
 */
export default class SfGpsDsAuNswTabContainerLwr extends SfGpsDsLwc {
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
  @api firstChild;

  get computedTabClassName() {
    return computeClass({
      "nsw-tabs__content": true,
      "nsw-tabs__content--flush": this.tabPaddingStyle === "flush",
      "nsw-tabs__content--side-flush": this.tabPaddingStyle === "side-flush",
      "nsw-tabs__content--no-border": this.tabBorderStyle === "no-border"
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
