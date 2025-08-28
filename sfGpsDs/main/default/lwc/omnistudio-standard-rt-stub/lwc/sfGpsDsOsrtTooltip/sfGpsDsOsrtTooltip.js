import { LightningElement, api, track } from "lwc";
import { isRtl } from "c/sfGpsDsOsrtUtility";

export default class Tooltip extends LightningElement {
  @api theme = "slds";
  @api iconUrl;
  @api get arrowposition() {
    return this._arrowposition || "bottom-left";
  }
  set arrowposition(val) {
    this._arrowposition = val;
  }
  @api iconName = "utility:info";
  @api iconFill;
  @api content;
  @api associatedComponentLabel;
  @api variant;
  @api extraclass;
  @api iconSize = "xx-small";
  @api iconVariant;
  @api extrabuttonclass = "";
  direction;
  @api disableTab;
  // tabIndex has been deprecated since the inner button is focusable by default
  @api tabIndex;
  _initialRender = true;
  _buttonIcon = true;
  _ele;

  get ariaLabel() {
    if (this.associatedComponentLabel) {
      return `${this.associatedComponentLabel}, ${this.content}`;
    }
    return this.content;
  }

  @api get buttonIcon() {
    return this._buttonIcon;
  }
  set buttonIcon(val) {
    this._buttonIcon = val === true || val === "true";
  }

  @track hidePopover = false;
  @track _arrowposition = "bottom-left";
  @track isBaseVersion = false;

  connectedCallback() {
    this.direction = isRtl();
    this._arrowposition =
      this.direction === "rtl" ? "top-right" : this.arrowposition;
  }

  renderedCallback() {
    if (this._initialRender) {
      const elem = this.querySelectorAll("*")[0];
      this.isBaseVersion = elem ? false : true;
      this._initialRender = false;
    }
    this.hidePopover = this.isBaseVersion && !this.content;
    this._ele = this.template.querySelector('[role="tooltip"]');
  }

  get tooltipClass() {
    let tooltipCls = `${this.theme}-popover`;
    tooltipCls += ` ${this.theme}-nubbin_${this.arrowposition} ${this.theme}-popover_tooltip ${this.theme}-fall-into-ground`;
    tooltipCls += ` ${this.arrowposition} tooltipSection`;
    if (this.extraclass) {
      tooltipCls += " " + this.extraclass;
    }
    return tooltipCls;
  }

  get buttonClass() {
    let classes = `${this.theme}-button  ${
      this.buttonIcon
        ? this.theme +
          "-button_icon " +
          (this.variant ? this.theme + "-button_icon-" + this.variant : "")
        : ""
    }`;

    if (this.extrabuttonclass) {
      classes += " " + this.extrabuttonclass;
    }

    return classes;
  }

  get bodyClass() {
    return `${this.theme}-popover__body`;
  }

  _cancelToken;

  @api
  closeTooltip() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this._cancelToken = setTimeout(() => {
      this.doCloseTooltip();
    }, 100);
  }

  doCloseTooltip() {
    if (this._ele) {
      this._ele.classList.add(`${this.theme}-fall-into-ground`);
      this._ele.classList.remove(`${this.theme}-rise-from-ground`);
    }
  }

  immediateCloseTooltip(event) {
    if (event.key === "Escape" || event.key === "Esc") {
      this.doCloseTooltip();
    }
  }

  @api
  openTooltip() {
    if (this._cancelToken) {
      window.clearTimeout(this._cancelToken);
    }
    this._ele.classList.remove(`${this.theme}-fall-into-ground`);
    this._ele.classList.add(`${this.theme}-rise-from-ground`);
  }
}
