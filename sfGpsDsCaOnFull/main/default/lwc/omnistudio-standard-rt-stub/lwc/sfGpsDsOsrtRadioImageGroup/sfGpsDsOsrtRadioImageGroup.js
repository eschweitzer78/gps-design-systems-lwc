import { api, track } from "lwc";
import VlocityRadioGroup from "c/sfGpsDsOsrtRadioGroup";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";

import sldsTemplate from "./radioImageGroup_slds.html";
import ndsTemplate from "./radioImageGroup_nds.html";

let radioIdGen = 0;
export default class VlocityRadioImageGroup extends VlocityRadioGroup {
  @api label;
  @api type = "radio";
  @api theme = "slds";
  @api enabledCaption;
  @api imgId;
  @api controlWidth;
  @api controlHeight;
  @api imageCountInRow;
  @api displayWide;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api tabIndex = "0";

  /* api: helpText */

  @api
  get helpText() {
    return this.fieldLevelHelp;
  }

  set helpText(helpText) {
    //this.fieldLevelHelp = helpText;
    console.warn(
      "helpText is a deprecated property. Please use fieldLevelHelp instead."
    );
  }

  @api horizontalMode;
  @api isImageDisplay;
  static delegatesFocus = true;
  @track _isDisplayWide;
  @track _isImage;
  @track _isDisplayRadio;

  /* api: isImage */

  @api
  get isImage() {
    return this._isImage;
  }

  set isImage(isImage) {
    this._isImage = isImage;
    if (this.isImage) {
      this._isDisplayRadio = false;
      this._isDisplayWide = false;
    }
  }

  /* api: isDisplayRadio */

  @api
  get isDisplayRadio() {
    return this._isDisplayRadio;
  }

  set isDisplayRadio(isDisplayRadio) {
    this._isDisplayRadio = isDisplayRadio;
    if (this.isDisplayRadio) {
      this._isImage = false;
      this._isDisplayWide = false;
    }
  }

  /* api: isDisplayWide */

  @api
  get isDisplayWide() {
    return this._isDisplayWide;
  }

  set isDisplayWide(val) {
    this._isDisplayWide = val;
    if (this.isDisplayWide) {
      this._isImage = false;
      this._isDisplayRadio = false;
    }
  }

  /* api: styles */

  @track styleProperties = {
    label: {},
    value: {}
  };

  @api get styles() {
    return this._styles;
  }

  set styles(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    val = val.styles ? val.styles : val;
    this._styles = val;
    if (this.styles) {
      for (let key in this.styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.styleProperties.label.styles = "";
            this.updateStyles(this.styles[key], key);
          } else if (key === "value") {
            this.updateStyles(this.styles[key], key);
          }
        }
      }
    }
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (!this.styleProperties[styleKey].styles) {
        this.styleProperties[styleKey].styles = "";
      }
      this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
        key
      )}:${styleObj[key]};`;
    });
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    if (this.radioId == null) this.radioId = "vlocity-radio-" + radioIdGen++;
  }

  renderedCallback() {
    if (this.isImage) {
      this.setControlWidth();
    }
  }

  get wrapperClass() {
    let classes = `${this.theme}-radio ${this.theme}-radio_custom-group ${
      this.theme
    }-float_left ${
      this.imageCountInRow
        ? "vlc-img-wrapper " + this.theme + "-img-wrapper_cont"
        : this.theme + "-static-wrapper"
    }`;
    return classes;
  }

  get imageClass() {
    let classes = `${this.theme}-radio__label vlc-img_select-container ${
      this.theme
    }-img_select-container ${
      this.imageCountInRow
        ? this.theme + "-img_no-width-height"
        : this.theme + "-img_option-width-height"
    } ${this.enabledCaption ? "" : this.theme + "-custom_m-bottom-small"}`;
    return classes;
  }

  /**
   * Used for setting width and height dynamically for Radio/MultiSelct(checkbox)
   */
  setControlWidth() {
    const children = this.template.children[0].children;
    if (this.isImage && children.length) {
      if (this.imageCountInRow) {
        const imageWrapper = children[0].querySelectorAll(".vlc-img-wrapper");
        imageWrapper.forEach((image) => {
          image.classList.add(
            this.theme + "-size_1-of-" + this.imageCountInRow
          );
          image.style.paddingTop = this.controlHeight
            ? this.controlHeight + "px"
            : 100 / this.imageCountInRow + "%";
        });
      } else if (this.controlWidth) {
        const imageContainer = children[0].querySelectorAll(
          ".vlc-img_select-container"
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

  get horizonDisplayMode() {
    let classes = `${this.theme}-form-element__control ${this.theme}-grid ${
      this.horizontalMode ? this.theme + "-radio-block" : ""
    }`;
    return classes;
  }
  get isDisabled() {
    return "" + this.disabled === "true" || this.disabled === "disabled"
      ? "disabled"
      : null;
  }

  handleKeyDownEvent(evt) {
    switch (evt.key) {
      case "Tab":
        this.reportValidity();
        break;
      default:
    }
  }
}
