/**
 * @module ns/omniscriptEmail
 * @description This component is used to render an Email element, This is extends from class `OmniscriptAtomicElement`.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptEmail.html";

/**
 * Default exported class OmniscriptEmail.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptEmail
 */
export default class OmniscriptEmail extends OmniscriptAtomicElement {
  /**
   * @type {String} - regex pattern for email
   * @scope private
   */
  _emailPattern;

  /**
   * @type {String} - Custom pattern missmatch error text
   * @scope private
   */
  _messageWhenPatternMismatch;

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
    this._emailPattern = this._propSetMap.pattern
      ? this._propSetMap.pattern
      : ".+\\..+";
    this._messageWhenPatternMismatch =
      this._propSetMap.ptrnErrText ||
      this.allCustomLabelsUtil.OmniInvalidEmailError;
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
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return tmpl;
  }
}
