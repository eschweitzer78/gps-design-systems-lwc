import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";

import sldsTemplate from "./tab_slds.html";
import ndsTemplate from "./tab_nds.html";

export default class Tab extends LightningElement {
  @api set label(val) {
    if (val) {
      this._label = val;
      this.updatevalue("label", val);
    }
  }
  get label() {
    return this._label;
  }

  @api set title(val) {
    if (val) {
      this._title = val;
      this.updatevalue("title", val);
    }
  }
  get title() {
    return this._title;
  }

  @api set iconName(val) {
    if (val) {
      this._iconName = val;
      this.updatevalue("iconName", val);
    }
  }
  get iconName() {
    return this._iconName;
  }

  @api set iconAssistiveText(val) {
    if (val) {
      this._iconAssistiveText = val;
      this.updatevalue("iconText", val);
    }
  }
  get iconAssistiveText() {
    return this._iconAssistiveText;
  }

  @api iconUrl;
  @api tabId;

  @api set showTab(val) {
    this._showTab = val === "true" || val === true ? true : false;
  }
  get showTab() {
    return this._showTab;
  }

  @api set displayTab(val) {
    this._displayTab = val;
  }
  get displayTab() {
    return this._displayTab;
  }
  @track _displayTab;
  @track _showTab = false;
  displayTabCopy;
  @track _label;
  @track _title;
  @track _iconAssistiveText;
  @track _iconName;

  @api theme = "slds";
  @api variant;

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    this.classList.add("vlocity-base-tab");
    this._displayTab =
      this._displayTab === "false" ||
      (typeof this._displayTab === "boolean" && !this._displayTab)
        ? false
        : true;
    this.displayTabCopy = this._displayTab;
    this.setAttribute("displayTab", this._displayTab);
  }

  renderedCallback() {
    if (this.displayTabCopy !== this._displayTab) {
      pubsub.fire(this.label, "showtab", {
        label: this.label,
        displayTab: this._displayTab
      });
      this.showTab = this._displayTab;
      this.displayTabCopy = this._displayTab;
    }
  }

  get getTabClass() {
    return this.variant === "vertical"
      ? `${this.theme}-vertical-tabs__content`
      : `${this.theme}-tabs-default__content`;
  }

  @api setShowTab(val) {
    this._showTab = val;
  }

  updatevalue(key, value) {
    this.dispatchEvent(
      new CustomEvent("updatevalue", {
        bubbles: true,
        composed: true,
        detail: {
          tabId: this.tabId,
          obj: {
            key: key,
            value: value
          }
        }
      })
    );
  }
}
