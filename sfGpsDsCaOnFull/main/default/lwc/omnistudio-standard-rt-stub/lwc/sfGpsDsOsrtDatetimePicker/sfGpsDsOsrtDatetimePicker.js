import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./datetimePicker_slds.html";
import ndsTemplate from "./datetimePicker_nds.html";
import pubsub from "c/sfGpsDsOsrtPubsub";
import dayjs from "c/sfGpsDsOsrtDayjs";
import {
  isDate,
  isMobile,
  mobileDateFormat,
  lwcPropertyNameConversion
} from "c/sfGpsDsOsrtUtility";
import {
  datetimePickerLabels as translatedLabels,
  datetimeFormat,
  shortDateFormat
} from "c/sfGpsDsOsrtSalesforceUtils";

const dateTimeFormatLocale = datetimeFormat
  .replace(/y/g, "Y")
  .replace(/d/g, "D");
const defaultProps = {
  dateLabel: translatedLabels.cmpDate,
  timeLabel: translatedLabels.cmpTime,
  datePlaceholder: translatedLabels.cmpSelectDate,
  timePlaceholder: translatedLabels.cmpSelectTime,
  dateName: "date",
  timeName: "time",
  theme: "slds",
  messageWhenValueMissing: translatedLabels.cmpFieldValueMissing,
  messageWhenBadInput: translatedLabels.cmpDateFieldNotValid,
  outputFormat: dateTimeFormatLocale || "MM/DD/YYYY hh:mm a",
  dateFormat:
    (shortDateFormat && shortDateFormat.toUpperCase()) || "YYYY-MM-DD",
  timeFormat: "HH:mm",
  hideIcon: "false"
};

function mergeDateTime(date, time, timezone) {
  if ((date && !isDate(date)) || (time && !isDate(time))) {
    throw new Error(
      "mergeDateTime requires JavaScript Date Objects, please parse before using mergeDateTime"
    );
  }
  if (!timezone) {
    timezone = dayjs.tz.guess();
  }
  let datePortion = dayjs(date || new Date()).format("YYYY-MM-DD");
  let timePortion = dayjs(time || new Date()).format("HH:mm:ss");
  if (isNaN(timezone)) {
    return dayjs.tz(`${datePortion}T${timePortion}`, timezone).toDate();
  }
  return dayjs(`${datePortion}T${timePortion}`)
    .utcOffset(-1 * timezone, true)
    .toDate();
}

let idGenerator = 0;

export default class VlocityDateTimePicker extends LightningElement {
  @api dateLabel;
  @api timeLabel;
  @api get label() {
    return this._label;
  }
  set label(val) {
    this._label = val;
    this.dateAriaLabel = val + ": " + (this.date_label || "Date");
    this.timeAriaLabel = val + ": " + (this.time_label || "Time");
  }
  @api name;
  @api datePlaceholder;
  @api timePlaceholder;
  @api dateName;
  @api timeName;
  @api iconUrl;
  @api theme;
  @api disabled;
  @api required;
  @api readOnly;
  @api interval;
  @api selectDateLabel;
  @api prevMonthLabel;
  @api nextMonthLabel;
  @api pickYearLabel;
  @api todayLabel;
  @api tabIndex = "0";
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api dateFormat;
  @api timeFormat;
  @api hideIcon;
  @api localeFormat;
  @track _localeFormatInvalidError;
  @track _messageWhenValueMissing;
  @track _messageWhenBadInput;
  @track _messageWhenRangeUnderflow;
  @track _messageWhenRangeOverflow;
  @api get messageWhenRangeUnderflow() {
    return this._messageWhenRangeUnderflow;
  }
  _isMobile = isMobile();
  @track dateAriaLabel;
  @track timeAriaLabel;
  _requiredLabel = translatedLabels.cmpRequired;

  set messageWhenRangeUnderflow(val) {
    if (val) {
      this._messageWhenRangeUnderflow = val;
    } else {
      this._messageWhenRangeUnderflow = translatedLabels.cmpValueBelowMinValue;
    }
  }

  @api get messageWhenRangeOverflow() {
    return this._messageWhenRangeOverflow;
  }

  set messageWhenRangeOverflow(val) {
    if (val) {
      this._messageWhenRangeOverflow = val;
    } else {
      this._messageWhenRangeOverflow = translatedLabels.cmpValueAboveMaxValue;
    }
  }
  @api get localeFormatInvalidError() {
    return this._localeFormatInvalidError;
  }
  set localeFormatInvalidError(val) {
    if (val) {
      this._localeFormatInvalidError = val;
    } else {
      this._localeFormatInvalidError = translatedLabels.cmpLocaleFormatsInvalid;
    }
  }

  @api get messageWhenValueMissing() {
    return this._messageWhenValueMissing;
  }
  set messageWhenValueMissing(val) {
    if (val) {
      this._messageWhenValueMissing = val;
    } else {
      this._messageWhenValueMissing = translatedLabels.cmpFieldValueMissing;
    }
  }

  @api get messageWhenBadInput() {
    return this._messageWhenBadInput;
  }
  set messageWhenBadInput(val) {
    if (val) {
      this._messageWhenBadInput = val;
    } else {
      this._messageWhenBadInput = translatedLabels.cmpDateFieldNotValid;
    }
  }

  @api get outputFormat() {
    return this._outputFormat || defaultProps.defaultProps;
  }
  set outputFormat(val) {
    this._outputFormat = val;
  }

  @api get requiredLabel() {
    return this._requiredLabel;
  }
  set requiredLabel(val) {
    if (val) {
      this._requiredLabel = val;
    } else {
      this._requiredLabel = translatedLabels.cmpRequired;
    }
  }

  @api outputType;
  @api get timezone() {
    return this._timezone;
  }
  set timezone(tz) {
    this._timezone = tz;
    this.setTimePickerDateObject();
  }

  @api get displayValue() {
    let dayVal = this.dateEl.displayValue;
    if (
      dayVal &&
      this._isMobile &&
      !dayjs(dayVal, mobileDateFormat).isValid()
    ) {
      dayVal = dayjs(this.dateEl.valueAsDate)
        .format(mobileDateFormat)
        .toString();
    }

    const timeValObject = this.getDisplayDateCompatibleObject(this._value);
    const timeVal = timeValObject
      ? timeValObject.format(this.timeFormat)
      : null;
    let displayVal = dayVal != null ? dayVal : "";
    displayVal = displayVal === "" ? "" : displayVal + " ";
    displayVal += timeVal != null ? timeVal : "";

    return displayVal;
  }

  constructor() {
    super();
    Object.keys(defaultProps).forEach(function (propName) {
      if (!this.hasOwnProperty(propName) || this[propName] === undefined) {
        this[propName] = defaultProps[propName];
      }
    }, this);
  }

  @api get value() {
    let out = this._value;

    if (new Date(out).toString() === "Invalid Date") {
      return "";
    }

    if (out instanceof Date && this.outputType !== "date") {
      out = dayjs(out).format(this.outputFormat);
    }

    return out;
  }

  @track _timeDateObj;

  set value(val) {
    this.setValue(val);
  }

  @api setValue(val) {
    let value = val;

    // Converts date string to Date value
    if (value && typeof value === "string") {
      value = dayjs(this.parseDatetime(val)).toDate();
    }

    // Set the value to the private _value
    this._value = value;
    this.setTimePickerDateObject();

    if (!this.firstRender) this.showHelpMessageIfInvalid();
  }

  setTimePickerDateObject() {
    if (!this._value) {
      this._timeDateObj = null;
      return;
    }
    if (this.timezone) {
      // create an adjusted value for the timepicker that's wrong
      // essentially the time will be copied from the user timezone
      // and set on a date that's in the current timezone.
      this._timeDateObj = new Date(
        this.getDisplayDateCompatibleObject(this._value).format(
          "YYYY-MM-DDTHH:mm:ss"
        )
      );
    } else {
      this._timeDateObj = new Date(this._value);
    }
  }

  @api get min() {
    return this._min;
  }
  set min(val) {
    this._min = val;
    let dateMin;
    if (val && typeof val === "string") {
      dateMin = this.parseDatetime(val);
    } else if (isDate(val)) {
      dateMin = val;
    }
    if (isDate(dateMin)) {
      if (dateMin.toString() !== "Invalid Date") {
        this.dateMin = dayjs(dateMin).format(this.dateFormat);
      } else {
        // async because this is a non-breaking issue. runtime should continue
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          throw Error(
            'Minimum Date: "' +
              val +
              '" cannot be parsed using ISO format or Date Format ' +
              this.dateFormat
          );
        }, 0);
      }
    }
  }

  @api get max() {
    return this._max;
  }
  set max(val) {
    this._max = val;
    let dateMax;
    if (val && typeof val === "string") {
      dateMax = this.parseDatetime(val);
    } else if (isDate(val)) {
      dateMax = val;
    }
    if (isDate(dateMax)) {
      if (dateMax.toString() !== "Invalid Date") {
        this.dateMax = dayjs(dateMax).format(this.dateFormat);
      } else {
        // async because this is a non-breaking issue. runtime should continue
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          throw Error(
            'Maximum Date: "' +
              val +
              '" cannot be parsed using ISO format or Date Format ' +
              this.dateFormat
          );
        }, 0);
      }
    }
  }

  @track styleProperties = {
    label: {},
    value: {},
    dateTimeLabel: {}
  };

  @api get styles() {
    return this._styles;
  }
  set styles(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    val = val.styles ? val.styles : val;
    this._styles = val;
    if (val) {
      for (let key in this._styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.updateStyles(this._styles[key], key);
          } else if (key === "value") {
            //this.styleProperties[key] = {};
            this.updateStyles(this._styles[key], key);
          } else if (key === "dateTimeLabel") {
            //this.styleProperties[key] = {};
            this.updateStyles(this._styles[key], key);
          }
        }
      }
    }
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (key !== "textAlign" || styleKey === "value") {
        if (!this.styleProperties[styleKey].styles) {
          this.styleProperties[styleKey].styles = "";
        }
        this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
          key
        )}:${styleObj[key]};`;
      } else {
        let labelEles = this.template.querySelectorAll('[data-label="true"]');
        if (labelEles && labelEles.length) {
          labelEles[0].style.textAlign = styleObj[key];
          labelEles[0].style.display = "block";
        }
      }
    });
  }

  get timeEl() {
    if (!this._timeEl) {
      this._timeEl = this.template.querySelector(
        "c-sf-gps-ds-osrt-time-picker"
      );
    }
    return this._timeEl;
  }
  get dateEl() {
    if (!this._dateEl) {
      this._dateEl = this.template.querySelector(
        "c-sf-gps-ds-osrt-date-picker"
      );
    }
    return this._dateEl;
  }

  @api focus() {
    this.dateEl.focus();
  }

  @api get validity() {
    let tmpValidity = {};
    let dateValidity = this.dateEl.validity;
    let timeValidity = this.timeEl.validity;
    Object.entries(dateValidity)
      .concat(Object.entries(timeValidity))
      .forEach(function (key, value) {
        tmpValidity[key] = value ? value : tmpValidity[key] || false;
      });
    tmpValidity.valid = dateValidity.valid && timeValidity.valid;
    return tmpValidity;
  }

  @api checkValidity() {
    return this.dateEl.checkValidity() && this.timeEl.checkValidity();
  }

  @api reportValidity() {
    var valid =
      this._connected &&
      this.dateEl.reportValidity() &&
      this.timeEl.reportValidity();
    this.isError = !valid;
    return valid;
  }

  @api setCustomValidity(e) {
    this.template
      .querySelector("c-sf-gps-ds-osrt-date-picker")
      .setCustomValidity(e);
    this.template
      .querySelector("c-sf-gps-ds-osrt-time-picker")
      .setCustomValidity(e);
  }

  @api showHelpMessageIfInvalid() {
    var valid = this._connected && this.validity.valid;
    this.isError = !valid;
    return valid;
  }

  @track _value;
  @track dateMin;
  @track dateMax;
  @track timeMin;
  @track timeMax;
  @track _min;
  @track _max;
  @track firstRender = true;
  @track _outputFormat;
  @track isError;

  parseDatetime(dt) {
    let date;
    if (dt === "" && dt === null) {
      date = "";
    } else if (isDate(dt)) {
      date = dt;
    } else if (new Date(dt).toString() !== "Invalid Date") {
      date = new Date(dt);
    } else {
      try {
        date = dayjs(dt, this.outputFormat).toDate();
      } catch (e) {
        console.error(e);
      }
    }
    return date;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  triggerEvent(event) {
    if (event.type === "change") {
      if (
        this.dateEl &&
        this.dateEl.value &&
        this.timeEl &&
        this.timeEl.value
      ) {
        this._value = mergeDateTime(
          this.dateEl.value,
          this.timeEl.value,
          this.timezone
        );
      } else if (this.dateEl && this.dateEl.value && this._value) {
        this._value = mergeDateTime(
          this.dateEl.value,
          this._value,
          this.timezone
        );
      } else if (this.timeEl && this.timeEl.value && this._value) {
        if (!this.dateEl.value)
          this._value = mergeDateTime(new Date(), this.timeEl.value);
        this._value = mergeDateTime(
          this._value,
          this.timeEl.value,
          this.timezone
        );
      } else if (this.dateEl && this.dateEl.valueAsDate) {
        this._value = this.dateEl.valueAsDate;
      } else if (this.timeEl && this.timeEl.valueAsDate) {
        this._value = this.timeEl.valueAsDate;
        //it is necessary to pass the value to dateEl programatically to ensure that both element's values are ready in time for validation. this is already handled for change on dateEl by this.setTime
        this.dateEl.setValue(this._value);
      } else if (this.dateEl && !this.dateEl.value) {
        this._value = "";
      }
      this.setTimePickerDateObject();

      if (this.name) {
        pubsub.fire(this.name, "valuechange", {
          name: this.name,
          value: this._value
        });
      }
      // changed to dispatch event from self, instead of children. This is to prevent timing issues
      this.dispatchEvent(
        new CustomEvent(event.name, {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  connectedCallback() {
    this._connected = true;

    let localeFormat;
    if (this.localeFormat) {
      localeFormat = this.localeFormat;
    } else if (translatedLabels.cmpDayJsLocaleFormats) {
      localeFormat = translatedLabels.cmpDayJsLocaleFormats;
    }
    if (localeFormat) {
      try {
        let localeObj = JSON.parse(localeFormat);
        // add locale object
        dayjs.locale(localeObj, null, true);
        // switch to locale
        dayjs.locale(localeObj.name);
      } catch (e) {
        throw new Error(
          translatedLabels.cmpLocaleFormatsInvalid
            .replace("${1}", "dateTimePicker")
            .replace("${2}", localeFormat)
        );
      }
    }
  }

  disconnectedCallback() {
    this._connected = false;
  }

  get errorClass() {
    let errorclass = `${this.theme}-form-element ${this.theme}-size_1-of-1 ${
      this.theme
    }-dropdown-trigger ${this.theme}-dropdown-trigger_click ${
      this.isError ? this.theme + "-has-error" : ""
    }`;
    return errorclass;
  }

  renderedCallback() {
    if (this.dateEl && this.firstRender) {
      this.setAttribute(
        "name",
        this.name ? this.name : "datetime-" + idGenerator
      );
      idGenerator++;
      ["change", "invalid"].forEach((event) => {
        this.dateEl.addEventListener(event, this.triggerEvent.bind(this));
        this.timeEl.addEventListener(event, this.triggerEvent.bind(this));
      });
      this.firstRender = false;
    }
  }

  setTime() {
    let timeVal;
    if (this.dateEl.value) {
      // stores time data from dateEl
      const dateHours = this.dateEl.value.getHours(),
        dateMinutes = this.dateEl.value.getMinutes(),
        dateSeconds = this.dateEl.value.getSeconds();

      // stores previously set time value
      timeVal = this.timeEl.value;

      // when time data from dateEl ≠ 0, this means that the user selected Today on the date picker
      if (dateHours !== 0 && dateMinutes !== 0 && dateSeconds !== 0) {
        // apply the time value for the current time
        timeVal = this.timeEl.min
          ? this.timeEl.min
          : this.dateEl.value.toISOString();
      }
      // typical date selection on date picker
      else {
        // update time value to default time of 12:00PM
        if (!timeVal) {
          const defaultTime = new Date();
          defaultTime.setHours(12, 0, 0);
          timeVal = this.timeEl.min
            ? this.timeEl.min
            : defaultTime.toISOString();
        }
      }
    } else {
      timeVal = null;
    }

    // sets time value
    this.timeEl.setValue(timeVal);
  }

  timezoneOffsetAdjust(date) {
    if (!date) {
      return null;
    }

    // Return unadjusted Date value since Date does not have timezone passed in to do the adjustment
    return this.getDisplayDateCompatibleObject(date).toDate();
  }

  getDisplayDateCompatibleObject(date) {
    if (!date) {
      return null;
    }
    if (this.timezone) {
      // Adjusts timezone if timezone is passed in as an alphametric timezone
      if (isNaN(this.timezone)) {
        return dayjs.tz(date, this.timezone);
      }

      // Adjusts timezone if timezone is passed in as a numeric offset value
      return dayjs(date).utcOffset(-1 * this.timezone);
    }
    return dayjs(date);
  }
}
