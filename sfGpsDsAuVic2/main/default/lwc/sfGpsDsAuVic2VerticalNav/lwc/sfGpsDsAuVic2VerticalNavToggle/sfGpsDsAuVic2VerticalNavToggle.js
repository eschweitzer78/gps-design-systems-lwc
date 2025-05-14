import { LightningElement, api } from "lwc";
import { formatTemplate } from "c/sfGpsDsHelpers";

const I18N = {
  ariaLabelTemplate: "Toggle {0} menu"
};

export default class extends LightningElement {
  @api text;

  get computedAriaLabel() {
    return formatTemplate(I18N.ariaLabelTemplate, { 0: this.text });
  }
}
