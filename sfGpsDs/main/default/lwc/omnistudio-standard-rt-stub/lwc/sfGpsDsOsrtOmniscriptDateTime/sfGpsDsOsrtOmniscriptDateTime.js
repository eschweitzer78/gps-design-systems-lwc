import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import {
  dateFormatCompatability,
  timeFormatCompatability,
  parseChronoAttributes,
  isTimeZoneValid
} from "c/sfGpsDsOsrtOmniscriptUtils";
import dayjs from "c/sfGpsDsOsrtDayjs";
import tmpl from "./sfGpsDsOsrtOmniscriptDateTime.html";

/**
 * Omniscript Date Time Element
 */
export default class OmniscriptDateTime extends OmniscriptAtomicElement {
  handleBlur() {}

  handleChange() {
    this.applyCallResp(this.childInput.value);
  }

  get defaultValue() {
    let dfltValue = super.defaultValue;
    const result = parseChronoAttributes(dfltValue);
    if (dfltValue && result === dfltValue && this._timezone) {
      const parsedDate = dayjs(
        dfltValue,
        `${this._dateFormat} ${this._timeFormat}`
      ).utc(true);
      if (parsedDate.isValid()) {
        return dayjs
          .tz(parsedDate.format(), this._timezone)
          .utc()
          .toDate()
          .toISOString();
      }
    }
    return result;
  }

  validateData(data) {
    var valid = data == null || data === "";
    var asDate, useAsDate;
    if (!valid && data) {
      valid =
        data.constructor === Date ||
        ((asDate = dayjs(data).utc().toDate()),
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
    return { valid: valid, dataToApply: useAsDate ? asDate : data };
  }

  initCompVariables() {
    super.initCompVariables();
    this._messageWhenBadInput =
      this.allCustomLabelsUtil.OmniValidationBadInputDate;
    if (this.jsonDef && this._propSetMap) {
      if (this._propSetMap.timezone) {
        switch (this._propSetMap.timezone) {
          case "User":
            this._timezone = this.jsonData?.userTimeZoneName; // undefined is ok.
            break;
          case "Local":
          default:
            this._timezone = dayjs.tz.guess();
        }

        if (!isTimeZoneValid(this._timezone)) {
          // Let's check to make sure _timezone is valid, if not default to UTC.
          this._timezone = "UTC";
        }
      }

      if (!this._propSetMap.strictDateFormatting) {
        if (this._propSetMap.dateFormat) {
          this._dateFormat = dateFormatCompatability(
            this._propSetMap.dateFormat
          );
        }
        if (this._propSetMap.timeFormat) {
          this._timeFormat = timeFormatCompatability(
            this._propSetMap.timeFormat
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

      this._timeInterval = this._propSetMap.timeInterval || 30;
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
