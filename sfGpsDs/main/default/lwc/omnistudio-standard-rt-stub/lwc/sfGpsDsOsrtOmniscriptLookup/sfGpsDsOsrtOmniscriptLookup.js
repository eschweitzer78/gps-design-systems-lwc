/**
 * @module ns/OmniscriptLookup
 * @description This component is used to render a Lookup
 */
import { wire, track, api } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { OmniscriptActionCommonUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

import { configureRemoteParams } from "./omniscriptLookupUtils";

import tmpl from "./omniscriptLookup_slds.html";
import tmpl_nds from "./omniscriptLookup_nds.html";

/**
 * Default exported class OmniscriptLookup
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptLookup
 */
export default class OmniscriptLookup extends OmniscriptAtomicElement {
  @track isPageLoading = false;
  @track options = [];
  @track lookupDisplay = "";
  @track hasError = false;

  show = false;
  lookupValue = "";
  lookupUpdated = true;
  selectedIndex = -1;
  highlightIndex = -1;
  recordTypeId = null;
  fieldApiName = {
    objectApiName: "",
    fieldApiName: ""
  };
  errorClass = "";
  inputClass = "";
  objectApiName = null;
  _needMoreValidation = false;
  _actionUtilClass;
  _labelClass = "";
  _inputRef = null;
  _sflDisplayValue = "";

  /**
   * getObjectInfo, getPickListValues are salesforce functions
   *
   * updateOptions is a callback function which will populate the list of options
   * with picklist values
   */
  @wire(getObjectInfo, { objectApiName: "$objectApiName" })
  objectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$recordTypeId",
    fieldApiName: "$fieldApiName"
  })
  updateOptions({ error, ...data }) {
    if (error) {
      window.console.log(JSON.stringify(error));
    } else if (data && data.data) {
      const picklistOptions = data.data.values;
      this.options = picklistOptions.map((item) => {
        return {
          value: item.label,
          name: item.value
        };
      });
      this.options.unshift({
        value: "--",
        name: ""
      });
      this.generateUniqueAttributes(this.options);
      this.showOptions();
    }
  }

  getRecordTypeId(recordType) {
    // Returns a map of record type Ids
    if (this.objectInfo) {
      const rtis = this.objectInfo.data.recordTypeInfos;
      return Object.keys(rtis).find((rti) => rtis[rti].name === recordType);
    }
    return null;
  }

  showLookup() {
    // disabled lookup
    if (!this._propSetMap.readOnly) {
      // clear value on click
      if (!this.show) {
        if (this._propSetMap.clearValue !== false) {
          // clear value
          this.getOptions();
          this.setSelected(-1).then(() => {});
        } else {
          this.getOptions();
        }
      } else {
        this.hideOptions();
      }
    }
  }

  /**
   * Remote call to retrieve list of options
   */
  getOptions() {
    this.isPageLoading = true;

    const configObj = configureRemoteParams(this);

    // using LWC picklist api (faster)
    if (this._propSetMap.dataSource.type === "PicklistFilteredbyRecordType") {
      const options = JSON.parse(configObj.options);
      // need to handle mergefield for recordType
      const recordType = options.picklistRecordType;
      const recordTypeId = this.getRecordTypeId(recordType);
      //if this fails, default back to apex call
      if (recordTypeId) {
        this.fieldApiName = {
          objectApiName: options.picklistObject,
          fieldApiName: options.picklistField
        };
        // triggers wire service for picklistValues
        this.recordTypeId = recordTypeId;
        return false; //arbitrary, eslint complains if no return value,
      }
    }

    if (!configObj) {
      // handles no data sources
      this.isPageLoading = false;
      return false;
    }

    return (
      this._actionUtilClass
        .executeAction(configObj, null, this)
        .then((resp) => {
          this.isPageLoading = false;

          const remoteResp = resp.result;

          if (remoteResp && remoteResp.options) {
            if (
              !Array.isArray(remoteResp.options) &&
              remoteResp.options.constructor === Object
            ) {
              remoteResp.options =
                Object.keys(remoteResp.options).length === 0
                  ? []
                  : [remoteResp.options];
            }

            this.options = remoteResp.options;
            this.options.unshift({
              value: "--",
              name: ""
            });
            this.generateUniqueAttributes(this.options);
            this.saveOptions(this.options);
            this.showOptions();
          } else {
            this.isPageLoading = false;
          }
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          this.isPageLoading = false;
        })
    );
  }

  selectOption(event) {
    let attr = event.target.getAttribute("data-option-index");
    const inputIndex = parseInt(attr, 10);

    this.setSelected(inputIndex);
    this.hideOptions();
  }

  /**
   *
   * @param {integer} selectedIndex -1 or a positive integer
   * positive integer : sets lookup display and value based on index in options array
   * -1               : sets lookup display and value to empty string
   */
  setSelected(selectedIndex) {
    if (
      this.options[selectedIndex] &&
      this.options[selectedIndex].value !== "--"
    ) {
      this.options.forEach((item, index) => {
        item.selected = index === selectedIndex;
      });
      this.selectedIndex = selectedIndex;
      this.lookupValue = this.options[selectedIndex].name;
      this.lookupDisplay = this.options[selectedIndex].value;
    } else {
      this.selectedIndex = -1;
      this.lookupValue = null;
      this.lookupDisplay = "";
    }
    this.ndsUpdateLabel();

    // wait for value to be set into c-sf-gps-ds-osrt-input then applyCallResp to trigger validation
    return Promise.resolve().then(() => {
      this.applyCallResp(this.lookupValue);
    });
  }

  /**
   * Adds css class to unhide the options list
   */
  showOptions() {
    this.template
      .querySelector(`.${this._theme}-dropdown-trigger_click`)
      .classList.add(`${this._theme}-is-open`);
    this.show = true;
    this.isPageLoading = false;

    if (this._propSetMap.clearValue === false && this.selectedIndex !== -1) {
      this.highlightIndex = this.selectedIndex;
      this.ariaFocus(this.highlightIndex);
    }
  }
  /**
   * Removes css class to unhide the options list
   */
  hideOptions() {
    // disabled lookup
    if (this._propSetMap.readOnly) {
      return;
    }
    this.template
      .querySelector(`.${this._theme}-dropdown-trigger_click`)
      .classList.remove(`${this._theme}-is-open`);
    this.show = false;

    this.ariaFocus(null);
    this._inputRef.removeAttribute("aria-activedescendant");
    this.reportValidity();
  }

  mouseOverFocus(event) {
    let index = event.target.getAttribute("data-option-index");
    this.ariaFocus(index);
  }

  /**
   *
   * @param {Integer} newIndex : null or a positive integer
   * All options will have the focus class removed
   * Valid newIndex option will have the focus class added
   */
  ariaFocus(newIndex) {
    const options = this.template.querySelectorAll('[role="option"]');
    if (options.length > 0) {
      options.forEach((opt) => {
        opt.classList.remove(`${this._theme}-has-focus`);
      });
    }

    if (options[newIndex]) {
      options[newIndex].classList.add(`${this._theme}-has-focus`);
      // workaround for an issue where this attribute gets an extra suffix if used in the template
      this._inputRef.setAttribute(
        "aria-activedescendant",
        options[newIndex].id
      );
    }
  }

  /**
   * Handles keyboard up events for lookup
   * @param {Object} evt
   */
  handleKeyUp(evt) {
    const key = evt.key;
    if (!this.show) {
      if (key === "ArrowDown" || key === "Enter" || key === " ") {
        if (!this.show) {
          // dropdown displayed
          if (this.selectedIndex === -1 || this._propSetMap.clearValue) {
            // first key press does not highlight, next key press will increment
            this.highlightIndex = -1;
          } else {
            this.highlightIndex = this.selectedIndex;
          }
          // input focused, options not shown
          this.showLookup();
        }
        this.ariaFocus(this.highlightIndex);
        evt.preventDefault();
      }
    } else {
      if (key === "ArrowUp") {
        this.highlightIndex =
          (this.highlightIndex - 1 + this.options.length) % this.options.length;
        this.ariaFocus(this.highlightIndex);
        evt.preventDefault();
      } else if (key === "ArrowDown") {
        this.highlightIndex = (this.highlightIndex + 1) % this.options.length;
        this.ariaFocus(this.highlightIndex);
        evt.preventDefault();
      } else if (key === "Enter") {
        this.setSelected(this.highlightIndex);
        evt.preventDefault();
        this.hideOptions();
      } else if (key === "Escape") {
        evt.preventDefault();
        this.hideOptions();
      }
    }
  }

  /**
   * Handles keyboard down events for lookup
   * @param {Object} evt
   */
  handleKeyDown(evt) {
    if (evt.key !== "Tab") {
      evt.preventDefault();
    }
  }

  /**
   *
   * @param {Object} options
   * Send an event to root node to persistently store the lookup options
   * so that lookup display value can be restored when navigating between steps
   */
  saveOptions(options) {
    this.dispatchOmniEventUtil(
      this,
      {
        path: this._jsonPath,
        elementId: this._elementId,
        value: options,
        node: "options"
      },
      "omniupdatejsondef"
    );
  }

  setElementValue(json, bApi, bValidation) {
    if (!bApi || bValidation) {
      // user initiated
      super.setElementValue(json, bApi, bValidation);
    } else {
      this.prefill(json);
      this.elementValue = this.lookupValue;
      this.setElementFormattedValue();
    }
  }

  generateUniqueAttributes(options) {
    if (Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].hasOwnProperty("key")) {
          options[i].id = options[i].key;
        } else {
          options[i].key = i;
          options[i].id = `option-${i}`;
        }
      }
    }
  }

  /**
   * Updates the label style depending on if there is a lookupValue
   */
  ndsUpdateLabel() {
    if (this._theme === "nds") {
      if (this.lookupValue !== "" && this.lookupValue !== null) {
        this.inputClass += "nds-not-empty nds-is-dirty";
      } else {
        this.inputClass = this.inputClass
          .replace("nds-not-empty", "")
          .replace("nds-is-dirty", "");
      }
    }
  }

  /**
   *
   * @param {object} lookupValue
   * restores the internal state of lookup and returns the lookupValue
   */
  prefill(lookupValue) {
    // set to jsonDef.options used by resume omniscript
    if (
      this.options.length === 0 &&
      this.jsonDef.options &&
      this.jsonDef.options.length !== 0
    ) {
      this.options = JSON.parse(JSON.stringify(this.jsonDef.options));
    }

    let checkValue = lookupValue; // string assumed, default
    if (lookupValue && typeof lookupValue === "object" && lookupValue.name) {
      checkValue = lookupValue.name;
    }

    if (checkValue !== "") {
      // loop through options to display correct option
      for (let index = 0; index < this.options.length; index++) {
        if (this.options[index].name === checkValue) {
          this.lookupDisplay = this.options[index].value;
          this.lookupValue = checkValue;
          this.generateUniqueAttributes(this.options);
          this.ndsUpdateLabel();
          return;
        }
      }
    }

    if (lookupValue === undefined || lookupValue === null) {
      this.lookupDisplay = "";
      this.lookupValue = null;
    } else if (typeof lookupValue === "string") {
      //save for later - save to jsonDef.options
      let displayValue = lookupValue;
      // use formatted data as the display value
      if (this._sflDisplayValue != null && this._sflDisplayValue !== "") {
        displayValue = this._sflDisplayValue;
      }
      this.options.push({ name: lookupValue, value: displayValue });
      this.saveOptions(this.options);
      this.lookupDisplay = displayValue;
      this.lookupValue = lookupValue;
    } else if (typeof lookupValue === "object") {
      //save for later - save to jsonDef.options
      this.options.push({ name: lookupValue.name, value: lookupValue.value });
      this.saveOptions(this.options);
      this.lookupDisplay = lookupValue.value;
      this.lookupValue = lookupValue.name;
    }

    this.generateUniqueAttributes(this.options);
    this.ndsUpdateLabel();
  }
  connectedCallback() {
    super.connectedCallback();

    // grab the formatted value for lookup
    // this might be used later to restore the display value
    if (
      this.jsonDef?.JSONPath &&
      this.jsonData?.OmniScriptFmtData &&
      this.jsonData?.OmniScriptFmtData[this.jsonDef.JSONPath] != null
    ) {
      this._sflDisplayValue =
        this.jsonData?.OmniScriptFmtData[this.jsonDef.JSONPath];
    }
    if (this.elementValue != null) {
      this.prefill(this.elementValue);
    }
  }
  renderedCallback() {
    if (this._initialRender) {
      this._inputRef = this.template.querySelector("input");
    }
    super.renderedCallback();
  }
  validateLookup(showError) {
    this.hasError = false;
    this.errorClass = this.errorClass.replace(this._theme + "-has-error", "");
    if (!this.show && !this.isPageLoading) {
      if (this._hasCustomError) {
        if (showError) {
          this.hasError = true;
          this.errorClass += " " + this._theme + "-has-error";
        }
        return false;
      } else if (this._propSetMap.required) {
        if (!this.lookupDisplay || this.lookupDisplay === "") {
          if (showError) {
            this.hasError = true;
            this.errorClass += " " + this._theme + "-has-error";
            this.errorMessage = this._messageWhenValueMissing;
          }
          return false;
        }
      }
    }
    return true;
  }
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
  @api checkValidity() {
    this.isValid = this.validateLookup(false);
    return this.isValid;
  }

  @api reportValidity() {
    this.isValid = this.validateLookup(true);
    return this.isValid;
  }

  /**
   * Overriding hasValidation's setCustomValidation function
   */
  @api setCustomValidation(message) {
    this._hasCustomError = Boolean(message);
    this.errorMessage = this.allCustomLabelsUtil.OmniErrorPrefix + message;
    this.reportValidity();
    if (!this.isFocusEventAttached) {
      this.template.addEventListener("focusout", this.onFocusOutErrorElement);
      this.isFocusEventAttached = true;
    }
  }

  onFocusOutErrorElement = () => {
    this._hasCustomError = false;
    this.errorMessage = "";
    this.reportValidity();
    this.template.removeEventListener("focusout", this.onFocusOutErrorElement);
    this.isFocusEventAttached = false;
  };

  /**
   * Override hasValidation's setChildInputValue to allow lookup's internal validation to work properly
   */
  setChildInputValue(input) {
    if (input !== null && typeof input === "object" && input.value) {
      this.lookupDisplay = input.value;
    } else {
      this.lookupDisplay = input;
    }
  }

  validateData(data) {
    // string or object
    return {
      valid:
        typeof data === "string" || typeof data === "object" || data === null,
      dataToApply: data
    };
  }

  initCompVariables() {
    super.initCompVariables();
    if (
      !this._isDesignMode &&
      this.jsonDef.propSetMap.dataSource &&
      this.jsonDef.propSetMap.dataSource.type === "PicklistFilteredbyRecordType"
    ) {
      if (this.jsonDef.propSetMap.dataSource.picklistObjectAndField) {
        this.objectApiName =
          this.jsonDef.propSetMap.dataSource.picklistObjectAndField.split(
            "."
          )[0];
      }
    }
    this.errorMessage =
      this.allCustomLabelsUtil.OmniErrorPrefix + this._messageWhenValueMissing;
    this.errorClass =
      this._theme +
      "-form-element " +
      this._theme +
      "-container_fluid" +
      (this.layout === "newport" ? " nds-form-container" : "");
    this.inputClass =
      "vlocity-input " +
      this._theme +
      "-input " +
      (this.layout === "newport" ? this._theme + "-input_mask " : "");
    this._actionUtilClass = new OmniscriptActionCommonUtil();
  }

  setElementFormattedValue() {
    if (this.lookupDisplay != null) {
      this._elementFormattedValue = this.lookupDisplay;
    } else if (this.elementValue != null) {
      this._elementFormattedValue = this.elementValue;
    }
    super.setElementFormattedValue();
  }

  applyRepeatableStyles() {
    const prefix = this._theme;
    this._styleClasses.container = prefix + "-grid";
    this._styleClasses.input = prefix + "-container_fluid ";

    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      if (this._theme === "nds") {
        this._labelClass = "nds-lookup-form-element__label";
        this._styleClasses.repeatAdd =
          "nds-button_reset nds-button nds-button_icon nds-m-right_x-small";
        this._styleClasses.repeatIcons = `${prefix}-button__icon ${prefix}-button__icon_small `;
        this._styleClasses.repeatContainer =
          "nds-button-group nds-m-right_x-small nds-tooltip__container omni-repeat-button-group";
        this._styleClasses.repeatRemove =
          "nds-button_reset nds-button nds-button_icon ";
      } else {
        super.applyRepeatableStyles();
      }
    }
  }
}
