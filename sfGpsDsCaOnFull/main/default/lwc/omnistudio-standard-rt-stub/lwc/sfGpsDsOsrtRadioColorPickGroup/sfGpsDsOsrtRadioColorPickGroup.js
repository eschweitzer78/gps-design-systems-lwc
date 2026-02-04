import { api, track } from "lwc";
import sldsTemplate from "./radioColorPickGroup_slds.html";
import ndsTemplate from "./radioColorPickGroup_nds.html";
import VlocityRadioImageGroup from "c/sfGpsDsOsrtRadioImageGroup";

let radioIdGen = 0;

export default class VlocityRadioColorGroup extends VlocityRadioImageGroup {
  @track _isColorDisplay;

  @api
  get isColorDisplay() {
    return this._isColorDisplay;
  }
  set isColorDisplay(isColorDisplay) {
    this._isColorDisplay = isColorDisplay;
    if (isColorDisplay) {
      this.setOptions();
    }
  }

  // holds the height and width of color circle, in px
  _colorRadius;

  @api get colorRadius() {
    return this._colorRadius;
  }

  set colorRadius(val) {
    if (val) {
      this._colorRadius = val;
      this.setOptions();
    }
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  renderedCallback() {
    if (this.isColorDisplay) {
      if (this.internalOpts.length && !this.isBgStyleSet()) {
        this.setOptions();
      }
      this.isImage = true;
      this.setControlWidth();
    }
  }

  connectedCallback() {
    if (this.radioId == null) this.radioId = "vlocity-radio-" + radioIdGen++;
  }

  //Check if the options have bgstyle property
  isBgStyleSet() {
    return !this._options.some((option) => !option.bgstyle);
  }

  setOptions() {
    this.internalOpts = this.internalOpts.map((option) => {
      return {
        ...option,
        bgstyle: `background-color: ${option.value}; ${
          this._colorRadius
            ? `width: ${this._colorRadius}px; height: ${this._colorRadius}px;`
            : ""
        }`
      };
    });
    this._options = this.internalOpts;
  }
}
