/**
 * @module ns/omniscriptRadioGroup
 * @description This component is used to render RadioGroup
 */
import { track, api } from "lwc";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { preprocessElementInput } from "c/sfGpsDsOsrtOmniscriptInternalUtils";

import tmpl from "./omniscriptRadioGroup_slds.html";
import tmpl_nds from "./omniscriptRadioGroup_nds.html";

/**
 * Default exported class OmniscriptRadioGroup.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptRadioGroup
 */
export default class OmniscriptRadioGroup extends OmniscriptAtomicElement {
  @track _selectedValues = {};
  @track hasError = false;
  _radioGroup;
  _addWidth = false;
  _optionClass = "roptions";
  _labelClass = "rlabels";

  stateRefresh() {
    if (this._radioGroup) {
      let newRadioName = this.generateUniquePrefix();
      // when a block clones a radio group, update the radio group's radio button's ids
      if (this.radioName !== newRadioName) {
        this.generateUniqueIds(this._radioGroup);
        if (this.elementValue) {
          // prefilling values because new radio group has taken radio button id's
          // and the button values are cleared out
          this.prefill(this.elementValue);
        }
      }
    }
  }

  /**
   *
   * @param {Object} evt
   * Triggers during changes to input by the user
   * 1. Update internal radioGroup state
   * 2. Trigger UI updates
   * 3. Update json data
   */
  handleChange(evt) {
    // update values here based on input clicked
    // need to know which row was selected
    let rowIndex = evt.target.getAttribute("data-row");
    let colIndex = evt.target.getAttribute("data-col");
    if (rowIndex) {
      let rowKey = this._propSetMap.radioLabels[rowIndex].name;
      if (
        !this._selectedValues[rowKey] ||
        this._selectedValues[rowKey] !== evt.target.value
      ) {
        this.selectRadio(rowIndex, colIndex);
        this._selectedValues = Object.assign({}, this._selectedValues);
        this.applyCallResp(this._selectedValues);
      }
    }
  }

  /**
   *
   * @param {Object} evt
   * Selects all radio inputs in the corresponding column
   *
   */

  setAll(evt) {
    if (!this._propSetMap.readOnly) {
      let updated = false;
      let optionIndex = parseInt(evt.target.getAttribute("data-col"), 10);
      let labels = this._propSetMap.radioLabels;

      for (let labelIndex = 0; labelIndex < labels.length; labelIndex++) {
        updated = this.selectRadio(labelIndex, optionIndex) || updated;
      }

      // updating bptree is expensive, only update if something changed
      if (updated) {
        this._selectedValues = Object.assign({}, this._selectedValues);
        this.applyCallResp(this._selectedValues);
      }
    }
  }

  /**
   * Divides width equally to each option label and setall label
   */
  setWidths() {
    // options widths
    if (this._propSetMap.options.length > 0) {
      let options = this.template.querySelectorAll(".vlc-radiogroup__button");
      let setall = this.template.querySelectorAll(".vlc-setall__label");
      let width = 100 / this._propSetMap.options.length + "%";
      for (let i = 0; i < options.length; i++) {
        if (options[i]) options[i].style.width = width;
        if (setall[i]) setall[i].style.width = width;
      }
    }
  }

  /**
   *
   * @param {Integer} labelIndex
   * @param {Integer} optionIndex
   * Based on the indices above, uncheck all options, then check the specified option
   */

  selectRadio(labelIndex, optionIndex) {
    // prefill could have set selectedValues to null
    if (!this._selectedValues) {
      this._selectedValues = {};
    }

    let labels = this._propSetMap.radioLabels;
    let newValue = this._propSetMap.options[optionIndex].name;
    let oldValue = this._selectedValues[labels[labelIndex].name];

    if (
      oldValue === null ||
      oldValue !== newValue ||
      !this._radioGroup[labelIndex].options[optionIndex].checked
    ) {
      this._radioGroup[labelIndex].options.forEach((option) => {
        option.checked = false;
      });
      this._radioGroup[labelIndex].options[optionIndex].checked = true;
      this._selectedValues[labels[labelIndex].name] = newValue;
      return true;
    }
    return false;
  }

  /**
   *
   * @param {Object} json
   * @param {Boolean} bValidation
   *
   */
  setElementValue(json, bApi, bValidation) {
    // prevents elementValue from keeping a reference to json and allows json data to get updated
    // otherwise, leave as null
    const newJson = json ? Object.assign({}, json) : json;
    if (!bApi || bValidation) {
      super.setElementValue(newJson, bApi, bValidation);
    } else {
      if (newJson) {
        this.prefill(newJson);
      }
      this.elementValue = newJson;
    }
  }

  /**
   *
   * @param {Object} json
   * Updates internal radioGroup state with any valid radioGroupLabel-option pairs
   * Non-valid pairs are ignored
   */
  prefill(json) {
    let rlabels = this._propSetMap.radioLabels;
    let roptions = this._propSetMap.options;
    let prefilled = false;
    for (let rlabelIndex = 0; rlabelIndex < rlabels.length; rlabelIndex++) {
      let jsonValue = json[rlabels[rlabelIndex].name];
      if (jsonValue) {
        for (let optIndex = 0; optIndex < roptions.length; optIndex++) {
          // add valid value
          if (roptions[optIndex].name === jsonValue) {
            prefilled = true;
            this.selectRadio(rlabelIndex, optIndex);
            break;
          }
        }
      }
    }
    if (prefilled) {
      this._selectedValues = Object.assign({}, this._selectedValues);
    }
  }

  /**
   *
   * @param {String} labels
   * Add unique ids to the rlabels for the input radio buttons
   */
  generateUniqueIds(labels) {
    this.radioName = this.generateUniquePrefix();
    for (let i = 0; i < labels.length; i++) {
      labels[i].id = `${this.radioName}-${i}`;
    }
  }

  /**
   * Creates a unique prefix for radio group to prevent id conflicts for radio buttons
   * Handles scenarios such as repeating a radio group inside of a block and radio group named
   * similarly outside of a block
   */
  generateUniquePrefix() {
    const pathArray = preprocessElementInput(this.jsonDef.JSONPath);
    let radioName = this.jsonDef.name;
    if (pathArray && Array.isArray(pathArray)) {
      for (let i = 0; i < pathArray.length; i++) {
        if (
          pathArray[i] &&
          Array.isArray(pathArray[i]) &&
          pathArray[i].length === 2
        ) {
          radioName += "-" + pathArray[i][1];
        }
      }
    }
    return radioName;
  }

  /**
   *
   * @param {object} json
   * Removes all invalid radioGroupLabel-option from json object
   *
   * Returns valid json object
   */
  removeInvalid(json) {
    const validJson = {};
    if (Object.keys(json).length > 0) {
      const roptions = {};
      this._propSetMap.options.forEach((opt) => {
        roptions[opt.name] = true;
      });
      const rlabels = this._propSetMap.radioLabels;
      for (let i = 0; i < rlabels.length; i++) {
        // add valid rlabels:roption pairs
        if (rlabels[i].name in json && json[rlabels[i].name] in roptions) {
          validJson[rlabels[i].name] = json[rlabels[i].name];
        }
      }
    }
    return validJson;
  }

  /**
   * Checks if any radiogroup keys are missing,
   * Displays error message if called by reportValidity
   */
  validateRadioGroup(showError) {
    let isValid = true;
    this.hasError = false;

    const roptions = {};
    this._propSetMap.options.forEach((opt) => {
      roptions[opt.name] = true;
    });
    const rlabels = this._propSetMap.radioLabels;
    if (this._propSetMap.required) {
      // check to see if any rlabel is missing
      for (let i = 0; i < rlabels.length; i++) {
        if (
          !this._selectedValues ||
          !(rlabels[i].name in this._selectedValues)
        ) {
          isValid = false;
          // start displaying error message on second render
          this.hasError = showError;
          break;
        }
      }
    }
    return isValid;
  }

  /**
   *
   * @param {Object} data
   * Checks the type of data (from prefill or setValue)
   * Accepts null, non-empty object
   */
  validateData(data) {
    if (data && typeof data === "object") {
      const validData = this.removeInvalid(data);

      if (Object.keys(validData).length > 0) {
        return { valid: true, dataToApply: validData };
      }
    }
    return { valid: data === null, dataToApply: data };
  }

  @api checkValidity() {
    this.isValid = this.validateRadioGroup(false);
    return this.isValid;
  }

  @api reportValidity() {
    this.isValid = this.validateRadioGroup(true);
    return this.isValid;
  }

  /**
   * Set value before validation
   */
  setChildInputValue(input) {
    this._selectedValues = input;
  }

  initCompVariables() {
    super.initCompVariables();
    // force validation to allow json data to be updated
    this._forceJsonToApply = true;

    // custom labels
    this.radioGroupSetAll = this.allCustomLabelsUtil.OmniRadioGroupSetAll;
    // error message
    if (this._propSetMap.label) {
      this.errorMessage =
        this.allCustomLabelsUtil.OmniErrorPrefix +
        this.allCustomLabelsUtil.OmniRequiredWithLabel?.replace(
          /\{0\}/gi,
          this._propSetMap.label
        );
    } else {
      this.errorMessage =
        this.allCustomLabelsUtil.OmniErrorPrefix +
        this.allCustomLabelsUtil.OmniRequired;
    }

    this._needMoreValidation = false;

    // sets classes for width of labels and options
    let lwidth = this._propSetMap.radioLabelsWidth;
    this._optionClass +=
      " " +
      this._theme +
      "-grid " +
      this._theme +
      "-size_" +
      (12 - lwidth) +
      "-of-12";
    this._labelClass +=
      " " +
      this._theme +
      "-p-right_small " +
      this._theme +
      "-size_" +
      lwidth +
      "-of-12";
  }

  connectedCallback() {
    super.connectedCallback();

    // create an internal copy of radioLabels with individual options to control radio inputs
    if (!this._radioGroup) {
      this._radioGroup = JSON.parse(
        JSON.stringify(this._propSetMap.radioLabels)
      );
      this._radioGroup.forEach((label) => {
        // deep clone
        label.options = JSON.parse(JSON.stringify(this._propSetMap.options));
      });
      this.generateUniqueIds(this._radioGroup);
    }
    if (this.elementValue) {
      // prefilling values when returning from another step
      this.prefill(this.elementValue);
    }
  }

  renderedCallback() {
    super.renderedCallback();
    if (!this._addWidth) {
      this.setWidths();
      this._addWidth = true;
    }
  }

  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
}
