/**
 * @module ns/omniscriptRadio
 * @description This component is used to render a Radio element, This is extends from mixins class `OmniscriptOptionsMixin` and `OmniscriptAtomicElement`.
 * `OmniscriptOptionsMixin` mixin class is used for validating prefill data for select.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { autoAdvance } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptOptionsMixin } from "c/sfGpsDsOsrtOmniscriptOptionsMixin";
import tmpl from "./sfGpsDsOsrtOmniscriptRadio.html";

/**
 * Default exported class OmniscriptRadio.
 * @extends OmniscriptOptionsMixin(OmniscriptAtomicElement)
 * @typicalname OmniscriptRadio
 */
export default class OmniscriptRadio extends OmniscriptOptionsMixin(
  OmniscriptAtomicElement
) {
  /**
   * @type {Boolean} - Checks whether horizontalMode is image or not
   * @scope private
   */
  _isImageMode;

  /**
   * @type {Boolean} - Checks whether horizontalMode is vertical or not
   * @scope private
   */
  _isVerticalMode;

  /**
   * @type {Boolean} - Checks whether mode is Display Wide or not
   * @scope private
   */
  _isDisplayWide;

  /**
   * @type {String} - holds mode as 'horizontal'/'vertical'
   * @scope private
   */
  _horizontalMode;

  /**
   * @type {Boolean} - Checks whether image will display or not
   * @scope private
   */
  _isImageDisplay;

  /**
   * OnChange Event Handler. Applies the changed value directly to the response
   * @returns {void}
   * @scope private
   */
  handleChange(evt) {
    if (evt && evt.target) {
      this.applyCallResp(evt.target.value);

      // Handles autoadvancing when there is a value change in the input
      autoAdvance(
        this._propSetMap.options,
        this._optionValueToIndex[evt.target.value],
        this
      );
    }
  }

  handleFocus(evt) {
    // Handles autoadvancing when the focused value is the same (i.e. when the user selects the same radio)
    if (evt && evt.detail && evt.detail === this.elementValue) {
      autoAdvance(
        this._propSetMap.options,
        this._optionValueToIndex[evt.detail],
        this
      );
    }
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
   * @description Overwrites inherited initCompVariables.(this method executes once during connectedCallback.)
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._isImageDisplay =
      this._propSetMap.optionSource.type === "image" ? true : false;
    this._isImageMode = this._propSetMap.horizontalMode === "image";
    this._isDisplayWide = this._propSetMap.horizontalMode === "displayWide";
    this._isVerticalMode = !this._isImageMode && !this._isDisplayWide;
    this._horizontalMode =
      this._propSetMap.horizontalMode === true ? "horizontal" : "vertical";
  }

  /**
   * @scope private
   * @description Overwrites inherited applyRepeatableStyles from Omniscript Atomic Element.
   * @return {void}
   */
  applyRepeatableStyles() {
    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      this._styleClasses.repeatAdd = `${this._theme}-button_reset ${this._theme}-m-right_x-small `;
      this._styleClasses.repeatIcons = `${this._theme}-button__icon ${this._theme}-button__icon_small `;
      this._styleClasses.repeatRemove = `${this._styleClasses.repeatAdd} `;
      this._styleClasses.repeatContainer = "omni-repeat-button-group ";

      if (this.layout !== "newport") {
        this._styleClasses.repeatContainer +=
          "slds-button-group slds-p-right_x-small";
        this._styleClasses.repeatIcons += "slds-m-bottom_xxx-small ";
      } else {
        this._styleClasses.repeatContainer += "nds-m-bottom_xx-small";
      }
    }
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
