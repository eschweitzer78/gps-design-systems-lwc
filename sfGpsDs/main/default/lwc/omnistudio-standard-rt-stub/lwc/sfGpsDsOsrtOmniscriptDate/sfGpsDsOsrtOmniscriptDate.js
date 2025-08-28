import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import {
  dateFormatCompatability,
  parseChronoAttributes
} from "c/sfGpsDsOsrtOmniscriptUtils";
import tmpl from "./sfGpsDsOsrtOmniscriptDate.html";

/**
 * Omniscript Date Element
 */
export default class OmniscriptDate extends OmniscriptAtomicElement {
  _setValueStrict = false;

  handleChange(evt) {
    if (evt && evt.target) {
      this.applyCallResp(evt.target.value);
    }
  }

  get defaultValue() {
    let dfltValue = super.defaultValue;
    return parseChronoAttributes(dfltValue);
  }

  validateData(data) {
    var valid = data == null || data === "";
    var asDate, useAsDate;
    if (!valid) {
      if (
        this.jsonDef &&
        this._propSetMap &&
        this._propSetMap.dateType &&
        this._propSetMap.dateType.toUpperCase() === "STRING"
      ) {
        valid = typeof data === "string";
      }
      if (!valid) {
        valid =
          data.constructor === Date ||
          ((asDate = new Date(data)),
          (useAsDate = asDate.toString() !== "Invalid Date"),
          useAsDate);
      }
      if (!valid) {
        asDate = parseChronoAttributes(data);
        if (asDate != null) {
          useAsDate = true;
          valid = true;
        }
      }
    }
    return { valid: valid, dataToApply: useAsDate ? asDate : data };
  }

  initCompVariables() {
    super.initCompVariables();
    this._messageWhenBadInput =
      this.allCustomLabelsUtil.OmniValidationBadInputDate;
    if (this.jsonDef && this._propSetMap) {
      if (!this._propSetMap.strictDateFormatting) {
        if (this._propSetMap.dateFormat) {
          this._dateFormat = dateFormatCompatability(
            this._propSetMap.dateFormat
          );
        }
        if (this._propSetMap.modelDateFormat) {
          this._modelDateFormat = dateFormatCompatability(
            this._propSetMap.modelDateFormat
          );
        }
      }
      if (this._propSetMap.minDate) {
        this._min = parseChronoAttributes(this._propSetMap.minDate, "minDate");
      }
      if (this._propSetMap.maxDate) {
        this._max = parseChronoAttributes(this._propSetMap.maxDate, "maxDate");
      }

      this._messageWhenRangeOverflow =
        String(
          this.allCustomLabelsUtil.OmniDateDisabledDay +
            " " +
            this.allCustomLabelsUtil.OmniDateMax
        ) + " %max%";
      this._messageWhenRangeUnderflow =
        String(
          this.allCustomLabelsUtil.OmniDateDisabledDay +
            " " +
            this.allCustomLabelsUtil.OmniDateMin
        ) + " %min%";
    }
  }

  setElementFormattedValue() {
    if (this.childInput) {
      const dispVal = this.childInput.displayValue;
      // odd structure to only call getter once;
      if (dispVal != null) {
        this._elementFormattedValue = dispVal;
      }
    }
    super.setElementFormattedValue();
  }

  render() {
    return tmpl;
  }

  handleOnBlur() {
    this.reportValidity();
  }
}
