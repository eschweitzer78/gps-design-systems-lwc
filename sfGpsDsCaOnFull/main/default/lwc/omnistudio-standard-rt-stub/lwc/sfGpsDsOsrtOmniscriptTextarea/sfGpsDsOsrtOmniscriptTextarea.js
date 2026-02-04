/**
 * @module ns/OmniscriptTextarea
 * @description This component is used to render a Textarea Element, OmniscriptTextarea is extended from `OmniscriptAtomicElement`.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptTextarea.html";

/**
 * Default exported class OmniscriptTextarea.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptTextarea
 */
export default class OmniscriptTextarea extends OmniscriptAtomicElement {
  /**
   * @type {Boolean}
   * @scope private
   */
  _commitOnChange;

  /**
   * Event handler function on blur event.
   * Sets the element value and triggers aggregation
   * @returns {void}
   * @scope private
   */
  handleBlur(evt) {
    // update elementValue, then aggregate
    this.applyCallResp(evt.target.value);
  }

  /**
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._commitOnChange =
      this.scriptHeaderDef.propSetMap.commitOnChange === true;
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
