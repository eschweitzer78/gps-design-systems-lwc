import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import {
  timeFormatCompatability,
  parseChronoAttributes
} from "c/sfGpsDsOsrtOmniscriptUtils";
import tmpl from "./sfGpsDsOsrtOmniscriptTime.html";

/**
 * Omniscript Time Element
 */
export default class OmniscriptTime extends OmniscriptAtomicElement {
  _setValueStrict = false;

  handleBlur(evt) {
    this.applyCallResp(evt.target.value);
  }

  handleChange(evt) {
    this.applyCallResp(evt.target.value);
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
        this._propSetMap.timeType &&
        this._propSetMap.timeType.toUpperCase() === "STRING"
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
        if (this._propSetMap.timeFormat) {
          this._timeFormat = timeFormatCompatability(
            this._propSetMap.timeFormat
          );
        }
        if (this._propSetMap.modelTimeFormat) {
          this._modelTimeFormat = timeFormatCompatability(
            this._propSetMap.modelTimeFormat
          );
        }
      }
      if (this._propSetMap.minTime) {
        this._min = parseChronoAttributes(this._propSetMap.minTime);
      }
      if (this._propSetMap.maxTime) {
        this._max = parseChronoAttributes(this._propSetMap.maxTime);
      }

      this._timeInterval = this._propSetMap.timeInterval || 30;
      this._messageWhenRangeOverflow =
        String(this.allCustomLabelsUtil.OmniTimeMinMax) +
        " %startTime% - %endTime%";
      this._messageWhenRangeUnderflow = this._messageWhenRangeOverflow;
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
}
