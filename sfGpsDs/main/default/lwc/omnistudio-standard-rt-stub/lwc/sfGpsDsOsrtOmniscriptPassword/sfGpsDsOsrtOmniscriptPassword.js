import OmniscriptText from "c/sfGpsDsOsrtOmniscriptText";

/**
 * This component is used to render a Password Element.
 * @module ns/omniscriptPassword
 * @extends OmniscriptText
 * @typicalname OmniscriptPassword
 */
export default class OmniscriptPassword extends OmniscriptText {
  /**
   * Sets the formatted value parameter for inter-component communication of the display value. Overrides from OmiscriptAtomicElement
   * @scope private
   * @returns {void}
   */
  setElementFormattedValue() {
    if (this.elementValue != null) {
      this._elementFormattedValue = "";
      for (let i = 0; i < this.elementValue.length; i++) {
        this._elementFormattedValue += "*";
      }
    }
    super.setElementFormattedValue();
  }
}
