/**
 * @module ns/omniscriptCurrency
 * @description This component is used to render a currency Element, This is extends from class `OmniscriptAtomicElement`.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptCurrency.html";

/**
 * Default exported class OmniscriptCurrency.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptCurrency
 */
export default class OmniscriptCurrency extends OmniscriptAtomicElement {
  /**
   * @type {Object} - Hold an object from Helper method for mask handling
   * @scope private
   */
  _imaskCurrencyAttributes;

  /**
   * @type {Boolean} - Checks whether value is committed or not
   * @scope private
   */
  _commitOnChange;

  /**
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._imaskCurrencyAttributes = this.getImaskCurrencyAttributes();
    this._commitOnChange =
      this.scriptHeaderDef.propSetMap.commitOnChange === true;
    this._repeatCurrencyAlternativeText =
      this.allCustomLabelsUtil.OmniCurrencyRepeatAltText.replace(
        /\{0\}/gi,
        this._propSetMap.label
      );
    this._removeCurrencyAlternativeText =
      this.allCustomLabelsUtil.OmniCurrencyRemoveAltText.replace(
        /\{0\}/gi,
        this._propSetMap.label
      );
  }

  /**
   * Event handler function on blur event.
   * Sets the element value and triggers aggregation
   * @returns {void}
   * @scope private
   */
  handleBlur(evt) {
    this.applyCallResp(evt.target.value);
  }

  /**
   * @description Evaluates if currency is valid.
   * @param {Number} data
   * @returns {Object}
   * @scope private
   */
  validateData(data) {
    // default - Number
    let valid = typeof data === "number" || data === null ? true : false;
    if (valid && data < 0 && !this._propSetMap.allowNegative) {
      valid = false;
      data = null;
    }
    return { valid: valid, dataToApply: data };
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
