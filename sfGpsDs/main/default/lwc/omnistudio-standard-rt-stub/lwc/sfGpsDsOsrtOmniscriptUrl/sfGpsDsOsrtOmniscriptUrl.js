/**
 * @module ns/OmniscriptUrl
 * @description This component is used to render a URL element, it extends from `OmniscriptAtomicElement`.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptUrl.html";
// import { setValidity } from 'c/sfGpsDsOsrtOmniscriptUtils';

/**
 * Default exported class OmniscriptUrl.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptUrl
 */
export default class OmniscriptUrl extends OmniscriptAtomicElement {
  /**
   * @type {string} - Use to set the custom error message.
   * @scope private
   */
  _messageWhenPatternMismatch;
  /**
   * @type {Boolean}
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
    this._messageWhenPatternMismatch =
      this._propSetMap.ptrnErrText ||
      this.allCustomLabelsUtil.OmniInvalidURLError;
    this._messageWhenTypeMismatch = this._messageWhenPatternMismatch;
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
    // setValidity(this);
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
