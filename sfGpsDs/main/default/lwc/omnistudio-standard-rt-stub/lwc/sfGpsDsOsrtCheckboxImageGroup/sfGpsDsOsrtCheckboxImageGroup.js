import { api, track } from "lwc";
import sldsTemplate from "./checkboxImageGroup_slds.html";
import ndsTemplate from "./checkboxImageGroup_nds.html";
import VlocityCheckboxGroup from "c/sfGpsDsOsrtCheckboxGroup";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";

let checkboxIdGen = 0;
export default class VlocityCheckboxImageGroup extends VlocityCheckboxGroup {
  // Custom
  @api theme = "slds";
  @api label;
  @track _val = [];
  @track internalOpts;
  _options = [];
  @api enabledCaption;
  @api controlWidth;
  @api controlHeight;
  @api imageCountInRow;
  @track
  _isImage;
  @track
  _isDisplayCheckbox;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api isImageDisplay;

  /* isImage */

  @api
  get isImage() {
    return this._isImage;
  }

  set isImage(isImage) {
    this._isImage = isImage;
    if (this.isImage) {
      this._isDisplayCheckbox = false;
    }
  }

  /* api: isDisplayCheckbox */

  @api
  get isDisplayCheckbox() {
    return this._isDisplayCheckbox;
  }

  set isDisplayCheckbox(isDisplayCheckbox) {
    this._isDisplayCheckbox = isDisplayCheckbox;
    if (this.isDisplayCheckbox) {
      this._isImage = false;
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

  /* lifecycle */

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    this.classList.add(`${this.theme}-size_1-of-1`);

    if (this.checkboxId == null) {
      this.checkboxId = "vlocity-checkbox-" + checkboxIdGen++;
    }
  }

  renderedCallback() {
    this.setControlWidth();
  }

  get wrapperClass() {
    let classes = `${this.theme}-checkbox ${this.theme}-checkbox_custom-group ${
      this.theme
    }-float_left ${
      this.imageCountInRow
        ? "vlc-img-wrapper " + this.theme + "-img-wrapper_cont"
        : this.theme + "-static-wrapper"
    }`;
    return classes;
  }

  get imageClass() {
    let classes = `${this.theme}-checkbox__label vlc-img_select-container ${
      this.theme
    }-img_select-cont  ${
      this.imageCountInRow
        ? `${this.theme}-img_no-width-height ${this.theme}-m-bottom_none`
        : this.theme + "-img_option-width-height"
    }`;
    return classes;
  }

  /**
   * Used for setting width and height dynamically for Radio/MultiSelect(checkbox)
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
