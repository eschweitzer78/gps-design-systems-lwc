import { api, track } from "lwc";
import SfGpsDsCombobox from "c/sfGpsDsCombobox";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";

const INPUT_SELECTOR = "input";
const TRIGGER_CLICK_SELECTOR = ".slds-dropdown-trigger_click";
const SELECTED_SELECTOR = ".slds-is-selected";
const FOOTER_SELECTOR = "[slot='footer']";
const IS_OPEN_CLASSNAME = "slds-is-open";

import tmpl from "./sfGpsDsComboboxSlds.html";

export default class SfGpsDsComboboxSldsComm extends SfGpsDsCombobox {
  /* api: isDisplayFlex */

  _isDisplayFlex;
  _isDisplayFlexOriginal;

  @api
  get isDisplayFlex() {
    return this._isDisplayFlexOriginal;
  }

  set isDisplayFlex(value) {
    this._isDisplayFlexOriginal = value;
    this._isDisplayFlex = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  @track _hideFooter;

  /* getters */
  /* ------- */

  get inputElement() {
    return this.template.querySelector(INPUT_SELECTOR);
  }

  get triggerClickElement() {
    return this.template.querySelector(TRIGGER_CLICK_SELECTOR);
  }

  get selectedElements() {
    return this.template.querySelectorAll(SELECTED_SELECTOR);
  }

  get showDelIcon() {
    return this.deleteMultiple && !this.disabled;
  }

  get dropdownStyle() {
    if (this.maxCount && !isNaN(this.maxCount)) {
      return (
        "overflow-x:auto;max-height:" + parseInt(this.maxCount, 10) * 35 + "px;"
      );
    }
    return "";
  }

  get extraLabelClasses() {
    return `slds-form-element__label slds-show_inline ${
      this.labelClasses || ""
    }`;
  }

  get errorClass() {
    return computeClass({
      "slds-combobox": true,
      "slds-dropdown-trigger": true,
      "slds-dropdown-trigger_click": true,
      "slds-has-error": this._isError
    });
  }

  get isNotInput() {
    return this._readOnly || !this.searchable;
  }

  get footerClass() {
    return `slds-popover__footer slds-popover__footer_form ${this.extraFooterClass}`;
  }

  get pillWrapperClass() {
    return computeClass({
      "slds-listbox__flex": this.isDisplayFlex,
      "slds-listbox": true,
      "slds-listbox_horizontal": true
    });
  }

  /* methods */
  /* ------- */

  lookupElementClose() {
    this.triggerClickElement.classList.remove(IS_OPEN_CLASSNAME);
  }

  lookupElementToggleOpen() {
    this.triggerClickElement.classList.toggle(IS_OPEN_CLASSNAME);
  }

  lookupElementIsOpen() {
    return this.triggerClickElement.classList.contains(IS_OPEN_CLASSNAME);
  }

  optionElementSetSelected(option, selected) {
    if (selected) {
      option.classList.remove("slds-has-focus");
      option.setAttribute("aria-selected", "false");

      if (option.scrollIntoView) {
        option.scrollIntoView({
          block: "nearest"
        });
      }
    } else {
      option.classList.add("slds-has-focus");
      option.classList.add("slds-is-selected");
      option.setAttribute("aria-selected", "true");
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    let firstRender = !this._rendered;

    super.renderedCallback();
    const element = this.inputElement;

    if (element && firstRender) {
      this._hideFooter = this.querySelector(FOOTER_SELECTOR) ? false : true;
    }
  }

  _alwaysShowLookup = false;

  connectedCallback() {
    super.connectedCallback();
    this._alwaysShowLookup = Boolean(this.getAttribute("data-show-lookup"));
  }
}
