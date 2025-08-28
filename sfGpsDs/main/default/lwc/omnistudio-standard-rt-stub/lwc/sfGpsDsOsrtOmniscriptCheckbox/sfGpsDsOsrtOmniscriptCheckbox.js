/**
 * @module ns/omniscriptCheckbox
 * @description This component is used to render a checkbox, This is extends from class `OmniscriptAtomicElement`.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptCheckbox.html";

/**
 * Default exported class OmniscriptCheckbox.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptCheckbox
 */
export default class OmniscriptCheckbox extends OmniscriptAtomicElement {
  /**
   * @type {Boolean} - Bypass second validation for checkbox
   * @scope private
   */
  _needMoreValidation = false;

  /**
   * OnChange Event Handler. Applies the changed value directly to the response
   * @returns {void}
   * @scope private
   */
  handleChange(evt) {
    if (evt && evt.target) this.applyCallResp(evt.target.checked);
  }

  /**
   * @scope private
   * @description Overwrites inherited connectedCallback.
   * @returns {Void}
   */
  connectedCallback() {
    if (this.jsonDef && this.jsonDef.response == null) {
      this.elementValue = false;
    }

    super.connectedCallback();

    if (
      this.jsonDef &&
      this.jsonDef.index === 0 &&
      this.jsonDef.response == null
    ) {
      this.dispatchOmniEventUtil(
        this,
        this.createAggregateNode(),
        "omniaggregate"
      );
    }
  }

  applyRepeatableStyles() {
    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      this._styleClasses.repeatAdd = `${this._theme}-button_reset ${this._theme}-m-right_x-small `;
      this._styleClasses.repeatIcons = `${this._theme}-button__icon ${this._theme}-button__icon_small `;
      this._styleClasses.repeatRemove = `${this._styleClasses.repeatAdd} `;
      this._styleClasses.repeatContainer = "omni-repeat-button-group ";

      if (this.layout === "newport") {
        this._styleClasses.repeatContainer +=
          "nds-form-element nds-form-container nds-button-group nds-p-top_none nds-p-bottom_none";
      } else {
        this._styleClasses.repeatContainer +=
          "slds-button-group slds-p-right_x-small slds-p-left_xx-small";
      }
    }
  }

  /**
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();

    // assigns style classes
    if (this._theme !== "nds") {
      this._styleClasses.container += " slds-m-vertical_medium";
    }
  }

  /**
   * @description Evaluates if checkbox data is valid.
   * @param {Boolean} data
   * @returns {Object}
   * @scope private
   */
  validateData(data) {
    // Boolean
    return { valid: typeof data === "boolean", dataToApply: data };
  }

  /**
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return tmpl;
  }
}
