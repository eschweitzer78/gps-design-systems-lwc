/**
 * @module ns/omniscriptText
 * @description This component is used to render a Text Element.
 * Text element support masking, Supported masking formats are "(999) 999-9999" and "(AAA) AAA-AAAA". "9" stands Number and "A" stands for Character.
 * Text element also support regex pattern.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { inputTypeMap } from "c/sfGpsDsOsrtOmniscriptUtils";
import tmpl from "./sfGpsDsOsrtOmniscriptText.html";

/**
 * Default exported class OmniscriptText.
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptText
 */
export default class OmniscriptText extends OmniscriptAtomicElement {
  /**
   * @type {string} - Use to show placeholder in Text element.
   * @scope private
   */
  _placeholder;
  /**
   * @type {string} - Use to set type of the input.
   * @scope private
   */
  _inputType;
  /**
   * @type {Boolean}
   * @scope private
   */
  _commitOnChange;
  /**
   * @type {string} - Use to set alternative-text for repeat button
   * @scope private
   */
  _repeatAlternativeText;
  /**
   * @type {string} - Use to set alternative-text for remove button
   * @scope private
   */
  _removeAlternativeText;
  /**
   * @type {string} - Use to set autocomplete attribute
   * @scope private
   */
  _autocomplete;

  /**
   * This function will determine if we need to set masking on element that comes from Omniscript script.
   * @returns {Object}
   * @scope private
   */
  getImaskTextAttributes() {
    let imaskAttributes = null;
    let mask = this._propSetMap.mask;
    if (mask) {
      imaskAttributes = {
        mask: mask,
        // these custom definitions are to support
        // legacy ng-mask options.
        definitions: {
          A: /^[A-Za-z]/,
          9: /^[0-9]/,
          X: {
            mask: "0",
            displayChar: "X",
            placeholderChar: "#",
            lazy: false,
            overwrite: "shift"
          }
        }
      };
      this._isMasked = true;
    }

    return imaskAttributes;
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
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._imaskTextAttributes = this.getImaskTextAttributes();
    this._placeholder = this._propSetMap.mask
      ? undefined
      : this._propSetMap.placeholder;
    this._maxLength = this._propSetMap.mask ? null : this._propSetMap.maxLength;
    this._minLength = this._propSetMap.mask ? null : this._propSetMap.minLength;
    this._inputType = inputTypeMap[this.jsonDef.type];
    this._commitOnChange =
      this.scriptHeaderDef.propSetMap.commitOnChange === true;
    this._repeatAlternativeText =
      this.allCustomLabelsUtil.OmniTextRepeatAltText.replace(
        /\{0\}/gi,
        this._propSetMap.label
      );
    this._removeAlternativeText =
      this.allCustomLabelsUtil.OmniTextRemoveAltText.replace(
        /\{0\}/gi,
        this._propSetMap.label
      );
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
