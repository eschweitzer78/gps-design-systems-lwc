import { LightningElement, api, track } from "lwc";
import { isRtl } from "c/sfGpsDsOsrtUtility";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { popoverLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./popover_slds.html";
import ndsTemplate from "./popover_nds.html";

export default class Popover extends LightningElement {
  @api theme = "slds";
  @api title = "";
  @api size;
  @api height;
  @api iconUrl;
  @api set nubbinposition(val) {
    this._nubbinposition = val;
  }
  get nubbinposition() {
    return this._nubbinposition || "top-left";
  }
  @api header;
  @api footer;
  @api variant;
  @api showclosebutton;
  @api show;

  direction;

  @track _nubbinposition = "top-left";

  _popoverLabel = translatedLabels.popoverLabel;

  @api get channelName() {
    return this._channelName;
  }
  set channelName(val) {
    this._channelName = val;
    if (this._channelName) {
      this._popOver = this.closePopoverOnEvent.bind(this);
      pubsub.register(this._channelName, {
        close: this._popOver
      });
    }
  }
  connectedCallback() {
    this.direction = isRtl();
    this._nubbinposition =
      this.direction === "rtl" ? "top-right" : this.nubbinposition;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  get popoverClass() {
    let popoverCls = `${this.theme}-popover`;
    popoverCls += ` ${this.theme}-nubbin_${this.nubbinposition}`;
    if (this.variant) {
      popoverCls += ` ${this.theme}-popover_${this.variant}`;
    }
    if (this.size) {
      popoverCls += ` ${this.theme}-popover_${this.size}`;
    }
    if (!(this.show === "true" || this.show === true)) {
      popoverCls += ` ${this.theme}-hide`;
    }
    return popoverCls;
  }

  @api
  closePopover(e) {
    let relatedTarget = e.relatedTarget ? e.relatedTarget.nodeName : "";
    let target = e.target.nodeName;
    if (
      relatedTarget !== "c-sf-gps-ds-osrt-icon" ||
      relatedTarget !== "c-sf-gps-ds-osrt-popover" ||
      target === "c-sf-gps-ds-osrt-button"
    )
      this.template
        .querySelector("section")
        .classList.add(`${this.theme}-hide`);
  }
  @api
  openPopover() {
    this.template
      .querySelector("section")
      .classList.remove(`${this.theme}-hide`);
  }
  disconnectedCallback() {
    if (this.channelName) {
      pubsub.unregister(this.channelName, {
        close: this._popOver
      });
    }
  }
  closePopoverOnEvent() {
    this.template.querySelector("section").classList.add(`${this.theme}-hide`);
    this.fireEvent("close", {});
  }
  fireEvent(eventName, data) {
    const selectedEvent = new CustomEvent(eventName, { detail: data });
    this.dispatchEvent(selectedEvent);
  }
}
