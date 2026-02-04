import { LightningElement, api } from "lwc";
import sldsTemplate from "./spinner_slds.html";
import ndsTemplate from "./spinner_nds.html";

export default class Spinner extends LightningElement {
  @api size = "small";
  @api variant;
  @api alternativeText;
  @api theme = "slds";
  @api extraclass;
  @api extraouterclass;
  @api message;
  @api messageclass;

  render() {
    return this.theme === "nds" ? ndsTemplate : sldsTemplate;
  }

  get msgClass() {
    return this.theme === "nds"
      ? `nds-grid nds-grid_vertical nds-grid_vertical-align-center nds-grid_align-center nds-is-absolute nds-container-fluid nds-p-horizontal_xx-large nds-m-top_xx-large nds-p-top_medium ${this.messageclass}`
      : `slds-grid slds-grid_vertical slds-grid_vertical-align-center slds-grid_align-center slds-m-top_xx-large ${this.messageclass}`;
  }

  connectedCallback() {
    // apply styles to component root
    if (this.theme === "slds") {
      this.classList.add(this.theme + "-spinner_container");
      this.classList.add(this.theme + "-is-absolute");
    }

    // applies extra classes to the spinner component's outer container
    if (this.extraouterclass) {
      const classes = this.extraouterclass.split(" ");

      for (let i = 0; i < classes.length; i++) {
        this.classList.add(classes[i]);
      }
    }
  }

  get spinnerClass() {
    if (this.theme === "nds") {
      return `nds-spinner_container nds-is-absolute nds-visible nds-transition-show ${
        this.extraclass || ""
      }`;
    }

    return (
      `${this.theme}-spinner ` +
      (this.variant ? ` ${this.theme}-spinner_${this.variant} ` : "") +
      (this.size ? ` ${this.theme}-spinner_${this.size} ` : ``) +
      (this.extraclass || "")
    );
  }
}
