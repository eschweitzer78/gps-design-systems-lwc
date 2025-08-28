import { LightningElement, api, track } from "lwc";

export default class VlocityPrompt extends LightningElement {
  @api message;
  @api title;
  @api theme;

  connectedCallback() {
    if (this.theme !== "nds" && this.theme !== "slds") this.theme = "slds";
  }

  @api openPrompt() {
    this.template.querySelector("c-sf-gps-ds-osrt-modal").openModal();
  }
  @api closePrompt() {
    this.template.querySelector("c-sf-gps-ds-osrt-modal").closeModal();
  }

  get headerClass() {
    let classes =
      this.theme +
      "-modal__header " +
      this.theme +
      "-theme_error " +
      this.theme +
      "-theme_alert-texture";
    return classes;
  }

  get footerClass() {
    let classes = this.theme + "-theme_default";
    return classes;
  }

  get headerTxtClass() {
    let classes = this.theme + "-text-heading_medium";
    return classes;
  }

  get promptClass() {
    let classes = this.theme + "-modal_prompt";
    return classes;
  }

  get themeClass() {
    let classes = "via-" + this.theme;
    return classes;
  }
}
