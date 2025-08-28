import { api, track } from "lwc";
import CheckboxGroup from "c/sfGpsDsOsrtCheckboxGroup";
import { get } from "c/sfGpsDsOsrtLodash";
import {
  lwcPropertyNameConversion,
  interpolateWithRegex
} from "c/sfGpsDsOsrtUtility";

import sldsTemplate from "./toggle_slds.html";
import ndsTemplate from "./toggle_nds.html";

let checkboxIdGen = 0;
export default class VlocityCheckboxGroup extends CheckboxGroup {
  //Api Variables
  @api variant;
  @api get labelOnFocus() {
    return this._labelOnFocus;
  }
  set labelOnFocus(val) {
    this._rawFieldValues.labelOnFocus = val;
    this._labelOnFocus = this.interpolateValue(val);
  }
  @api get checkedLabel() {
    return this._checkedLabel;
  }
  set checkedLabel(val) {
    this._rawFieldValues.checkedLabel = val;
    this._checkedLabel = this.interpolateValue(val);
  }
  @api get uncheckedLabel() {
    return this._uncheckedLabel;
  }
  set uncheckedLabel(val) {
    this._rawFieldValues.uncheckedLabel = val;
    this._uncheckedLabel = this.interpolateValue(val);
  }
  @api get alternativeText() {
    return this._alternativeText;
  }
  set alternativeText(val) {
    this._rawFieldValues.alternativeText = val;
    this._alternativeText = this.interpolateValue(val);
  }
  @api iconName = "utility:check";
  @api iconOnFocus = "utility:check";
  @api get toggleEnabledLabel() {
    return this._toggleEnabledLabel;
  }
  set toggleEnabledLabel(val) {
    this._rawFieldValues.toggleEnabledLabel = val;
    this._toggleEnabledLabel = this.interpolateValue(val);
  }
  @api get toggleDisabledLabel() {
    return this._toggleDisabledLabel;
  }
  set toggleDisabledLabel(val) {
    this._rawFieldValues.toggleDisabledLabel = val;
    this._toggleDisabledLabel = this.interpolateValue(val);
  }
  @api checkedIconName = "utility:check";
  @api uncheckedIconName = "utility:add";

  @api get label() {
    return this._label;
  }
  set label(val) {
    this._rawFieldValues = this._rawFieldValues ? this._rawFieldValues : {};
    this._rawFieldValues.label = val;
    this._label = this.interpolateValue(val);
  }
  //Track Variables
  @track labelStyle;
  @track textAlign;
  @track _labelOnFocus;
  @track _checkedLabel;
  @track _uncheckedLabel;
  @track _alternativeText = "";
  @track _toggleEnabledLabel = "Enabled";
  @track _toggleDisabledLabel = "Disabled";
  @track _label;

  @track checkedLabelStyle;
  @track uncheckedLabelStye;

  //Getter and Setter Methods

  @api
  get value() {
    if (Array.isArray(this._val)) return this._val.join(";");
    return this._val;
  }
  set value(val) {
    this._rawFieldValues.value = val;
    this.updateValue(val, "value");
  }

  @api get type() {
    return this._type || "checkbox";
  }
  set type(val) {
    this._type = val;
    this.isButton = val === "button" ? true : false;
    this.isIcon = val === "icon" ? true : false;
    this.isCheckbox = val !== "checkbox" ? false : true;
  }

  @api get checked() {
    return this.isChecked;
  }
  set checked(val) {
    this._rawFieldValues.checked = val;
    this.updateValue(val, "checked");
  }

  @api get required() {
    //required - api variable
    return this._required;
  }
  set required(val) {
    this._rawFieldValues.required = val;
    this._requiredValue = this.interpolateValue(val);
    this._required =
      this._requiredValue === "true" || this._requiredValue === true;
  }

  @api get disabled() {
    //disabled - api variable
    return this._disabled;
  }
  set disabled(val) {
    this._rawFieldValues.disabled = val;
    this._disabledValue = this.interpolateValue(val);
    this._disabled =
      this._disabledValue === "true" || this._disabledValue === true;
  }

  @api
  get options() {
    //options - api variable
    return this._options;
  }
  set options(options) {
    this._rawFieldValues.options = options;
    this._val = this.value ? this.value.split(";") : [];
    options = options
      ? typeof options === "string"
        ? this.validObj(options)
        : options
      : [];
    let _regexPattern = /\{([a-zA-Z.0-9_]*)\}/g;
    if (this.record) {
      options = interpolateWithRegex(options, this.record, _regexPattern);
    }
    if (this._allMergeFields) {
      options = interpolateWithRegex(
        options,
        this._allMergeFields,
        _regexPattern
      );
    }
    this._options = options;
    this.updateSelection();
  }

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
    this._styles = val;
    this.labelStyle = "";
    this.checkedLabelStyle = "";
    this.uncheckedLabelStyle = "";
    this.labelOnHoverStyle = "";
    this.textAlign = "";
    this.textAlignVal = "";
    if (val && val.label) {
      let labelStyleObj = this.getLabelStyle({ ...val.label });
      this.labelStyle = labelStyleObj && labelStyleObj.labelStyleStr;
      this.textAlignVal = labelStyleObj && labelStyleObj.textAlignValue;
      this.textAlign = labelStyleObj && labelStyleObj.textAlignClass;
    }
    if (val && val.checkedLabel) {
      let labelStyleObj = this.getLabelStyle({ ...val.checkedLabel });
      this.checkedLabelStyle = labelStyleObj && labelStyleObj.labelStyleStr;
    }
    if (val && val.uncheckedLabel) {
      let labelStyleObj = this.getLabelStyle({ ...val.uncheckedLabel });
      this.uncheckedLabelStyle = labelStyleObj && labelStyleObj.labelStyleStr;
    }
    if (val && val.labelOnHover) {
      let labelStyleObj = this.getLabelStyle({ ...val.labelOnHover });
      this.labelOnHoverStyle = labelStyleObj && labelStyleObj.labelStyleStr;
    }
  }

  get toggleContClass() {
    return this.errorClass + (this.textAlign ? this.textAlign : "");
  }

  get labelClass() {
    let clasess = `${
      this.textAlign ? "" : this.theme + "-form-element__legend"
    } ${this.theme}-form-element__label ${
      this.Type.isButton ? this.theme + "-p-top_none" : ""
    }`;
    return clasess;
  }

  get toggleTypeStyle() {
    let position = "";
    switch (this.textAlignVal) {
      case "right":
        position = "flex-end";
        break;
      case "left":
        position = "flex-start";
        break;
      case "center":
        position = "center";
        break;
      default:
        break;
    }
    let style = position ? `justify-content: ${position}` : "";
    return style;
  }

  _ariaLabel;

  @api get ariaLabel() {
    return this._ariaLabel;
  }
  set ariaLabel(val) {
    if (val) {
      this._rawFieldValues.ariaLabel = val;
      this._ariaLabel = this.interpolateValue(val);
    }
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    if (this.checkboxId == null) {
      this.checkboxId = "vlocity-checkbox-" + checkboxIdGen++;
    }
    if (this.record && !this._isRecordSet) {
      this._isRecordSet = true;
      Object.keys(this._rawFieldValues).forEach((key) => {
        this[key] = this._rawFieldValues[key];
      });
    }
  }

  renderedCallback() {
    let elementName = this.isToggle ? "input" : "button";
    this._element = this.template.querySelector(elementName);
    if (this._element && !this.isRendered) {
      this.isRendered = true;
      ["focus", "click", "blur"].forEach((event) => {
        this._element.addEventListener(event, () => {
          this.dispatchEvent(
            new CustomEvent(event, {
              bubbles: true,
              composed: true
            })
          );
        });
      });
    }
    super.renderedCallback();
    if (this.Type.isToggle) {
      this.setStyles();
    }
  }

  @track _isRecordSet;
  @track _value;
  @track _checked;
  @track _disabledValue;
  @track _requiredValue;
  _rawFieldValues = {};

  updateValue(val, type) {
    if (type === "checked") {
      this._checked = this.interpolateValue(val);
      this.isChecked = this._checked === "true" || this._checked === true;
      Promise.resolve().then(() => {
        this.setValue("init");
      });
    } else if (type === "value") {
      this._value = this.interpolateValue(val);
      Promise.resolve().then(() => {
        val = this.handleSelect(this._value);
        this._val = val ? val.split(";") : [];
        this.updateSelection();
      });
    }
  }

  setValue(type) {
    if (
      this._element &&
      (this.Type.isStatefulBtn ||
        this.Type.isDualStatefulBtn ||
        this.Type.isStatefulIcon)
    ) {
      if (this.Type.isStatefulBtn) {
        if (this._element.classList.contains(`${this.theme}-is-selected`)) {
          this._element.classList.remove(`${this.theme}-is-selected`);
        }
        if (type === "init") {
          if (
            !this._element.classList.contains(
              `${this.theme}-is-selected-clicked`
            )
          ) {
            this._element.classList.toggle(
              `${this.theme}-is-selected`,
              this.isChecked
            );
          }
        } else {
          this._element.classList.toggle(
            `${this.theme}-is-selected-clicked`,
            this.isChecked
          );
        }
        this._element.classList.toggle(
          `${this.theme}-not-selected`,
          !this.isChecked
        );
      } else {
        let className = this.Type.isDualStatefulBtn
          ? `${this.theme}-is-pressed`
          : `${this.theme}-is-selected`;
        this._element.classList.toggle(className, this.isChecked);
      }
    }
  }

  //Method to parse a stringified object.
  validObj = (str) => {
    try {
      if (str.charAt(0) === "\\") {
        str = str.substring(1);
      }
      return JSON.parse(str);
    } catch (e) {
      return [];
    }
  };

  //Method to set toggle Element Type
  get Type() {
    return {
      isButton: this.type === "button",
      isIcon: this.type === "icon",
      isToggle: this.type === "toggle",
      isStatefulBtn: this.type === "statefulButton",
      isStatefulIcon: this.type === "statefulIcon",
      isDualStatefulBtn: this.type === "dualStatefulButton",
      isCheckbox: this.type === "checkbox"
    };
  }

  //To interpolated label value
  interpolateValue(value) {
    value =
      value && typeof value === "string" && value.charAt(0) === "\\"
        ? value.substring(1)
        : value;
    if (
      value &&
      typeof value === "string" &&
      value.indexOf("{") !== -1 &&
      (this.record || this._allMergeFields)
    ) {
      let stringToInterpolate = value;
      return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
        let fieldValue;
        if (this.record) {
          fieldValue = get(this.record, expr);
        }
        if (this._allMergeFields && typeof fieldValue === "undefined") {
          fieldValue = get(this._allMergeFields, expr);
        }
        return typeof fieldValue !== "undefined" ? fieldValue : "";
      });
    }
    return value;
  }

  //Method to update classList of Stateful Button on focus
  handleFocus(event) {
    let element = event.target;
    if (!this.Type.isStatefulBtn) {
      this.isChecked = element.checked;
    }
  }

  //Method to update classList of Stateful Button on blur
  removeFocus(event) {
    if (this.Type.isStatefulBtn && this.isChecked) {
      let element = event.target;
      if (element) {
        element.classList.remove(`${this.theme}-is-selected-clicked`);
        element.classList.add(`${this.theme}-is-selected`);
      }
      this.labelOnFocus = this.labelOnFocus
        ? this.labelOnFocus
        : this.checkedLabel;
      this.iconOnFocus = this.iconOnFocus
        ? this.iconOnFocus
        : this.checkedIconName;
    }
  }

  //Method to update classList of Stateful/DualStateful Button and Stateful Icon on click
  changeStatus() {
    this.isChecked = !this.isChecked;
    this.setValue();
    this.dispatchEvent(
      new CustomEvent("change", {
        composed: true,
        bubbles: true
      })
    );
  }

  get buttonIconClass() {
    let classes = `${this.theme}-button ${this.theme}-button_${
      this.variant ? this.variant : "neutral"
    } ${this.theme}-button_stateful`;
    if (this.Type.isStatefulBtn && !this.isChecked) {
      classes += ` ${this.theme}-not-selected`;
    }
    return classes;
  }

  // Function: Get styles for labels.
  getLabelStyle(labelstyleObj) {
    if (!labelstyleObj) return null;
    let labelStyleStr = "";
    let textAlignValue;
    let textAlignClass;
    let keys = Object.keys(labelstyleObj);
    keys.forEach((key) => {
      if (labelstyleObj[key]) {
        if (key !== "textAlign") {
          labelStyleStr += `${lwcPropertyNameConversion(key)}:${
            labelstyleObj[key]
          };`;
        } else if (key === "textAlign") {
          textAlignValue = labelstyleObj[key];
          textAlignClass = ` ${this.theme}-text-align--${textAlignValue} `;
        }
      }
    });
    return {
      labelStyleStr: labelStyleStr,
      textAlignValue: textAlignValue,
      textAlignClass: textAlignClass
    };
  }
}
