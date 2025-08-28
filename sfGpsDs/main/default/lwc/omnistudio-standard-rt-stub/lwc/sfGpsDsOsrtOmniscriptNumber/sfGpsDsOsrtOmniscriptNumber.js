/**
 * @module ns/omniscriptNumber
 * @description This component is used to render a Number Element, OmniscriptNumber is extended from `OmniscriptAtomicElement`. Supported masking format example ##,##.##
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptNumber.html";

/**
 * Default exported class OmniscriptNumber.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptNumber
 */
export default class OmniscriptNumber extends OmniscriptAtomicElement {
  /**
   * @type {Object} - Hold an object from Helper method for mask handling
   * @scope private
   */
  _imaskNumberAttributes;

  /**
   * @type {Boolean} - Checks whether value is committed or not
   * @scope private
   */
  _commitOnChange;

  /**
   * @description Overwrites inherited initCompVariables.(this method executes once during connectedCallback.)
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._imaskNumberAttributes = this.getImaskNumberAttributes();
    this._commitOnChange =
      this.scriptHeaderDef.propSetMap.commitOnChange === true;
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
    return {
      valid: typeof data === "number" || data === null,
      dataToApply: data
    };
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
