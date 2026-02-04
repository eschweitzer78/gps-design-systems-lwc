/**
 * @module ns/omniscriptRange
 * @description This component is used to render Range
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import tmpl from "./sfGpsDsOsrtOmniscriptRange.html";

/**
 * @class OmniscriptRange
 * @extends OmniscriptAtomicElement
 * @typicalname OmniscriptRange
 */
export default class OmniscriptRange extends OmniscriptAtomicElement {
  get defaultValue() {
    const dfltValue = super.defaultValue;
    const propSetDefault = dfltValue != null ? dfltValue : undefined;
    if (propSetDefault != null && this.shouldNullify(propSetDefault)) {
      return this.nullVal;
    }
    return propSetDefault != null ? propSetDefault : this.nullVal;
  }

  get nullVal() {
    return typeof this._propSetMap.rangeLow === "string"
      ? this.safeParseStyleToNumber(this._propSetMap.rangeLow)
      : this._propSetMap.rangeLow;
  }

  handleChange() {
    this.applyCallResp(this.childInput.value);
  }

  handleTouchMove(event) {
    event.stopPropagation();
  }

  shouldNullify(val) {
    return (
      val == null ||
      val < this._propSetMap.rangeLow ||
      val > this._propSetMap.rangeHigh
    );
  }

  validateData(data) {
    // default - Number
    return {
      valid:
        (typeof data === "number" &&
          data >= this._propSetMap.rangeLow &&
          data <= this._propSetMap.rangeHigh) ||
        data === null,
      dataToApply: data
    };
  }

  /**
   * Overrides hasValidation.handleKeydown.
   * @param {KeyboardEvent} evt
   */
  handleKeydown(evt) {
    if (this._readOnly) {
      if (evt.key !== "Tab") {
        evt.preventDefault();
      }
    }
  }

  /**
   * Overwrites the inherited initCompVariables from OmniscriptAtomicElement. Initializes any masks that are present.
   * @returns {void}
   */
  initCompVariables() {
    super.initCompVariables();
    this._imaskAttributes = this.getImaskNumberAttributes();
  }

  connectedCallback() {
    super.connectedCallback();
    super.initCompVariables();
    this.addEventListener("mousedown", this._preventUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this._preventUpdate);
  }

  applyRepeatableStyles() {
    const prefix = this._theme;
    this._styleClasses.container = prefix + "-grid";

    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      this._styleClasses.repeatRemove = `${prefix}-button_reset `;
      this._styleClasses.repeatAdd = `${this._styleClasses.repeatRemove} ${prefix}-m-right_x-small `;
      this._styleClasses.repeatIcons = `${prefix}-button__icon ${prefix}-button__icon_small `;
      this._styleClasses.repeatContainer = "omni-repeat-button-group ";

      if (this.layout === "newport") {
        this._styleClasses.repeatContainer += "nds-m-left_x-small";
      } else {
        this._styleClasses.repeatContainer +=
          "slds-button-group slds-p-right_x-small";
        this._styleClasses.repeatIcons += `${prefix}-m-bottom_xxx-small `;
      }
    }
  }

  render() {
    return tmpl;
  }
}
