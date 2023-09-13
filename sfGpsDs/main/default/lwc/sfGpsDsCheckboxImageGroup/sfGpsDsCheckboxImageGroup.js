import { api, track } from "lwc";
import SfGpsDsCheckboxGroup from "c/sfGpsDsCheckboxGroup";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCheckboxImageGroup.html";

export default class SfGpsDsCheckboxImageGroup extends SfGpsDsCheckboxGroup {
  @api enabledCaption;
  @api controlWidth;
  @api controlHeight;
  @api imageCountInRow;
  @api isImageDisplay;

  /* api: isImage */

  @track _isImage;

  @api get isImage() {
    return this._isImage;
  }

  set isImage(isImage) {
    this._isImage = isImage;
    if (this.isImage) {
      this._isDisplayCheckbox = false;
    }
  }

  /* api isDisplayCheckbox */

  @track _isDisplayCheckbox;

  @api get isDisplayCheckbox() {
    return this._isDisplayCheckbox;
  }

  set isDisplayCheckbox(isDisplayCheckbox) {
    this._isDisplayCheckbox = isDisplayCheckbox;
    if (this.isDisplayCheckbox) {
      this._isImage = false;
    }
  }

  /* methods */

  /**
   * Used for setting width and height dynamically for Radio/MultiSelect(checkbox)
   */

  setControlWidth() {
    const children = this.template.children[0].children;

    if (this.isImage && children.length) {
      if (this.imageCountInRow) {
        const imageWrapper = children[0].querySelectorAll(
          ".sfgpsds-img-wrapper"
        );
        imageWrapper.forEach((image) => {
          image.classList.add("slds-size_1-of-" + this.imageCountInRow);
          image.style.paddingTop = this.controlHeight
            ? this.controlHeight + "px"
            : 100 / this.imageCountInRow + "%";
        });
      } else if (this.controlWidth) {
        const imageContainer = children[0].querySelectorAll(
          ".sfgpsds-img_select-container"
        );
        imageContainer.forEach((image) => {
          image.style.width = this.controlWidth
            ? this.controlWidth + "px"
            : "auto";
          image.style.height = this.controlHeight
            ? this.controlHeight + "px"
            : "auto";
        });
      }
    }
  }

  /* computed */

  get computedDisabled() {
    return "" + this.disabled === "true" || this.disabled === "disabled"
      ? "disabled"
      : null;
  }

  get computedWrapperClassName() {
    return computeClass({
      "slds-checkbox": true,
      "slds-checkbox_custom-group": true,
      "slds-float_left": true,
      "sfgpsds-img-wrapper": this.imageCountInRow,
      "slds-img-wrapper_cont": this.imageCountInRow,
      "slds-static-wrapper": !this.imageCountInRow
    });
  }

  get computedImageClassName() {
    return computeClass({
      "slds-checkbox__label": true,
      "sfgpsds-img_select-container": true,
      "slds-img_select-container": true,
      "slds-img_no-width-height": this.imageCountInRow,
      "slds-m-bottom_none": this.imageCountInRow,
      "slds-img_option-width-height": !this.imageCountInRow
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    this.classList.add("slds-size_1-of-1");
  }

  renderedCallback() {
    this.setControlWidth();
  }
}
