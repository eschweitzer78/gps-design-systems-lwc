import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./toast_slds.html";
import ndsTemplate from "./toast_nds.html";

export default class VlocityToast extends LightningElement {
  @api theme = "slds";
  @api title;
  @api message;
  @api extraclass;
  @track icon;
  @track isHidden = true;
  @api duration;
  @api iconUrl;
  @api fixedWidth;

  isToastDisplayed;
  _styletype = "info";

  @api
  get styletype() {
    return this._styletype;
  }

  set styletype(type) {
    this._styletype = type;
    this.icon = type ? "utility:" + type : "utility:info";
  }

  render() {
    if (this.duration) {
      if (this.isToastDisplayed) clearTimeout(this.isToastDisplayed);
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this.isToastDisplayed = setTimeout(() => {
        this.close();
      }, this.duration);
    }

    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  renderedCallback() {
    if (!this.icon) {
      this.icon = this.styletype ? "utility:" + this.styletype : "utility:info";
    }
    if (
      this.template.querySelector(`.${this.theme}-notify`) &&
      this.fixedWidth
    ) {
      let width =
        this.fixedWidth && /^[0-9]+$/.test(this.fixedWidth)
          ? this.fixedWidth + "px"
          : this.fixedWidth
            ? this.fixedWidth
            : "";
      if (width) {
        this.template.querySelector(`.${this.theme}-notify`).style.width =
          width;
        this.template.querySelector(`.${this.theme}-notify`).style.minWidth = 0;
      }
    }
  }

  @api
  show() {
    this.isHidden = false;
  }

  close() {
    this.isHidden = true;
  }

  get extraclassSelection() {
    return (
      `${this.theme}-notify_container ${this.theme}-is-relative ` +
      this.extraclass
    );
  }

  get stateClassSelection() {
    if (/^(success|warning|error)$/.test(this.styletype)) {
      return (
        `${this.theme}-notify ${this.theme}-notify_toast ${this.theme}-theme_` +
        this.styletype
      );
    }
    return `${this.theme}-notify ${this.theme}-notify_toast ${this.theme}-theme_info`;
  }
}
