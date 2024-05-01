import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import assets from "@salesforce/resourceUrl/sfGpsDsAuVic2";

export default class SfGpsDsAuVic2Acknowledgement extends LightningElement {
  @api message;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-acknowledgement": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  get aboriginalFlagUrl() {
    return assets + "/assets/flags/flag-aboriginal.svg";
  }

  get tsiFlagUrl() {
    return assets + "/assets/flags/flag-torres-strait-islander.svg";
  }
}
