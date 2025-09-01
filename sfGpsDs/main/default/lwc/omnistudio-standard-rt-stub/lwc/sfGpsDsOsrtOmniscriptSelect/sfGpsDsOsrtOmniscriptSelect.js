/**
 * @module ns/omniscriptSelect
 * @description This component is used to render a Select element, This is extends from mixins class `OmniscriptOptionsMixin`, `OmniscriptAtomicElement`.
 * `OmniscriptOptionsMixin` mixin class is used for validating prefill data for select.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { autoAdvance } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptOptionsMixin } from "c/sfGpsDsOsrtOmniscriptOptionsMixin";
import tmpl from "./sfGpsDsOsrtOmniscriptSelect.html";

/**
 * Default exported class OmniscriptSelect.
 * @extends OmniscriptOptionsMixin(OmniscriptAtomicElement)
 * @typicalname OmniscriptSelect
 */
export default class OmniscriptSelect extends OmniscriptOptionsMixin(
  OmniscriptAtomicElement
) {
  /**
   * @type {Array} - overwritten private variable.
   * @scope private
   */
  _initialOptions = []; // overwritten private variable

  get searchable() {
    return !this._readOnly;
  }

  /**
   * OnChange Event Handler. Applies the changed value directly to the response
   * @returns {void}
   * @scope private
   */
  handleChange(evt) {
    this.applyCallResp(evt.target.value);
    autoAdvance(
      this._propSetMap.options,
      this._optionValueToIndex[evt.target.value],
      this
    );
  }

  /**
   * @description Gets the classes to be passed into the combobox's <label>
   * @returns {String}
   */
  get labelClasses() {
    return this._propSetMap.repeat &&
      this._handleHelpText &&
      this._theme === "nds" &&
      this.canRemove
      ? "nds-form_repeatable"
      : "";
  }

  initCompVariables() {
    this._initialOptions = [
      { name: "", value: this.allCustomLabelsUtil.OmniClear }
    ];
    super.initCompVariables();
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
