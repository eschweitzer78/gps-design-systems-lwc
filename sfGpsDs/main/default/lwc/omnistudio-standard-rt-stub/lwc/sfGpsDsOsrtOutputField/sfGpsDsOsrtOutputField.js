import { LightningElement, api, track } from "lwc";
import { CURRENCY, LOCALE, TIMEZONE } from "c/sfGpsDsOsrtSalesforceUtils";
import { get } from "c/sfGpsDsOsrtLodash";
import {
  formatCurrency,
  formatDate,
  inputMask,
  getDateTimeLocaleFormat,
  lwcPropertyNameConversion,
  dateValueParser
} from "c/sfGpsDsOsrtUtility";
import { BaseFlexElementMixin } from "c/sfGpsDsOsrtBaseFlexElementMixin";

export default class OutputField extends BaseFlexElementMixin(
  LightningElement
) {
  /* api: fieldName */

  @api
  get fieldName() {
    return this._fieldName;
  }

  set fieldName(val) {
    this._fieldName = val;
    this.updateValue();
  }

  /* api: label */

  @api
  get label() {
    return this.uninterpolatedLabel;
  }

  set label(val) {
    this.uninterpolatedLabel = val;
    this.updateValue();
  }

  @api type = "string";
  @api placeholder;
  @api extraclass = "";
  @api mask;

  /* api: mergeField */

  @api
  get mergeField() {
    return this._mergeField;
  }

  set mergeField(val) {
    if (val) {
      this._mergeField = decodeURI(val);
    }
  }

  @api preventNavigation = false;
  @api labelclass;
  @api valueclass;
  @api format;
  @api theme = "slds";
  @api updatedFieldValue;

  /* api: locale */

  _locale;
  @api get locale() {
    return this._locale
      ? this.interpolateMergeField(this._locale)
      : this._locale;
  }

  set locale(val) {
    this._locale = val;
  }

  /* api: currency */

  _currency;

  @api
  get currency() {
    return this._currency
      ? this.interpolateMergeField(this._currency)
      : this._currency;
  }

  set currency(val) {
    this._currency = val;
  }

  @api fieldLabel;
  @api useAbsoluteDate;
  @api fieldLevelHelp;
  @api isDatatable = false;

  get title() {
    if (this.isDatatable) {
      return this.fieldValue;
    }
    return this.fieldTitle;
  }

  /* api: fieldTitle */

  @api
  get fieldTitle() {
    return this._fieldTitle
      ? this._fieldTitle
      : this.fieldLabel
        ? this.fieldLabel
        : this.fieldValue;
  }

  set fieldTitle(val) {
    this._fieldTitle = val;
  }

  /* api: record */

  @api
  get record() {
    return this._record;
  }

  set record(val) {
    this._record = val;
    this.updateValue();
  }

  /* api: styles */

  @api get styles() {
    return this._styles;
  }

  set styles(val) {
    const fetchStyles = (type) => {
      if (val[type]) {
        let keys = Object.keys(val[type]);
        keys.forEach((key) => {
          if (val[type][key]) {
            if (key !== "textAlign") {
              let styleKeyName = type === "label" ? "labelStyle" : "valueStyle";
              this[styleKeyName] += `${lwcPropertyNameConversion(key)}:${
                val[type][key]
              };`;
            } else {
              let alignKeyName = type === "label" ? "labelAlign" : "valueAlign";
              this[alignKeyName] =
                `${this.theme}-text-align--${val[type][key]}`;
            }
          }
        });
      }
    };
    val = val ? (typeof val === "string" ? this.validObj(val) : val) : {};
    this._styles = val;
    this.labelStyle = "";
    this.labelAlign = "";
    this.valueStyle = "";
    this.valueAlign = "";
    if (val) {
      fetchStyles("label");
      fetchStyles("value");
    }
  }

  @track _fieldTitle;
  @track fieldValue = "";
  @track _label = "";
  @track isTypeUrl = false;
  @track _mergeField;
  @track labelStyle = "";
  @track labelAlign = "";
  @track valueStyle = "";
  @track valueAlign = "";
  // eslint-disable-next-line no-script-url
  urlHref = "javascript:void(0)";

  triggerRender() {
    this.updateValue();
  }

  validObj = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };

  get labelClass() {
    return `${this.theme}-show--inline ${this.theme}-form-element__label  ${
      this.labelclass ? this.labelclass : ""
    }`;
  }

  get fieldValueClass() {
    return `field-value ${this.valueclass ? this.valueclass : ""}`;
  }
  get _extraClass() {
    return this.extraclass + " vloc-min-height";
  }
  get interpolatedLabel() {
    return this.interpolateMergeField(this.label);
  }

  get interpolatedHelpText() {
    return this.interpolateMergeField(this.fieldLevelHelp);
  }

  interpolateMergeField(stringToInterpolate) {
    if (
      typeof stringToInterpolate === "string" &&
      stringToInterpolate.charAt(0) === "\\"
    ) {
      stringToInterpolate = stringToInterpolate.substring(1);
    }
    if (stringToInterpolate && stringToInterpolate.indexOf("{") !== -1) {
      return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
        let fieldValue = get(this.record, expr);
        if (
          this._allMergeFields &&
          (typeof fieldValue === "undefined" ||
            fieldValue === null ||
            (fieldValue &&
              typeof fieldValue === "string" &&
              fieldValue.indexOf("{") !== -1))
        ) {
          fieldValue = get(this._allMergeFields, expr);
        }
        return typeof fieldValue !== "undefined" ? fieldValue : "";
      });
    }
    return stringToInterpolate;
  }

  renderedCallback() {
    if (!this.isRendered && this.type === "url") {
      this.isTypeUrl = true;
      this.isRendered = true;
    }
    this.updateValue();
  }

  updateValue() {
    if (this.fieldName || this.mergeField)
      this.fieldValue = this.interpolatedValue;
    if (this.label) this._label = this.interpolatedLabel;
  }

  get isMergeField() {
    return this.mergeField ? true : false;
  }

  get interpolatedValue() {
    if (this.mergeField) {
      if (this.mergeField.indexOf("{") !== -1) {
        return this.interpolateValue(this.mergeField);
      }
      return this.mergeField;
    }
    const validObj = (value) => {
      try {
        if (value.charAt(0) === "\\") {
          value = value.substring(1);
        }
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    };
    let record =
      typeof this.record === "string" ? validObj(this.record) : this.record;
    if (this.updatedFieldValue) {
      return this.updatedFieldValue;
      //eslint-disable-next-line no-else-return
    } else {
      if (this.fieldName && this.fieldName.indexOf("{") !== -1) {
        return this.interpolateValue(this.fieldName);
      }
      return this.formatField(get(record, this.fieldName), this.type);
    }
  }

  interpolateValue(value) {
    let stringToInterpolate = value;
    if (
      typeof stringToInterpolate === "string" &&
      stringToInterpolate.charAt(0) === "\\"
    ) {
      stringToInterpolate = stringToInterpolate.substring(1);
    }
    return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
      let fieldValue = get(this.record, expr);
      if (
        this._allMergeFields &&
        (typeof fieldValue === "undefined" ||
          fieldValue === null ||
          (fieldValue &&
            typeof fieldValue === "string" &&
            fieldValue.indexOf("{") !== -1))
      ) {
        fieldValue = get(this._allMergeFields, expr);
      }
      return typeof fieldValue !== "undefined" ? fieldValue : "";
    });
  }

  get placeholderValue() {
    let placeholder = this.placeholder;
    if (typeof placeholder === "string" && placeholder.charAt(0) === "\\") {
      placeholder = placeholder.substring(1);
    }
    return (
      placeholder &&
      placeholder.replace(/\{(.*?)\}/g, (match, expr) => {
        let fieldValue = get(this.record, expr);
        if (
          this._allMergeFields &&
          (typeof fieldValue === "undefined" ||
            fieldValue === null ||
            (fieldValue &&
              typeof fieldValue === "string" &&
              fieldValue.indexOf("{") !== -1))
        ) {
          fieldValue = get(this._allMergeFields, expr);
        }
        return typeof fieldValue !== "undefined" ? fieldValue : "";
      })
    );
  }

  formatUsPhone(phone) {
    let phoneTest = new RegExp(
      /^((\+1)|1)? ?\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})( ?(ext\.? ?|x)(\d*))?$/
    );
    phone = phone.trim();
    let results = phoneTest.exec(phone);
    if (results !== null && results.length > 8) {
      return (
        "(" +
        results[3] +
        ") " +
        results[4] +
        "-" +
        results[5] +
        (typeof results[8] !== "undefined" ? " x" + results[8] : "")
      );
    }
    return phone;
  }

  getLocaleFormat(type) {
    let userLocale = this.locale || LOCALE || "en_US";
    let localeFormat = getDateTimeLocaleFormat(userLocale);
    if (type === "date" && localeFormat) {
      localeFormat = localeFormat.substr(0, localeFormat.indexOf(" "));
    }
    return localeFormat;
  }

  formatDate(date) {
    let dateMask;
    let formattedValue;
    date = this.getDateToFormat(date);
    if (
      !this.format &&
      date &&
      new Date(date).toDateString() !== "Invalid Date"
    ) {
      const options = {
        timeZone: this.useAbsoluteDate ? undefined : TIMEZONE
      };
      const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, options);
      formattedValue = dateTimeFormat.format(dateValueParser(date));
    } else {
      dateMask = this.format ? this.format.replace(/y/g, "Y") : this.format;
      if (date && dateMask) {
        let value = formatDate(date, dateMask);
        formattedValue = value ? value : date;
      }
    }

    return formattedValue;
  }

  formatDateTime(date) {
    let dateTimeMask;
    let formattedValue;
    if (!this.format && date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: TIMEZONE
      };
      const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, options);
      formattedValue = dateTimeFormat.format(new Date(date));
    } else {
      dateTimeMask = this.format ? this.format.replace(/y/g, "Y") : this.format;

      if (date && dateTimeMask) {
        let value = formatDate(date, dateTimeMask);
        formattedValue = value ? value : date;
      }
    }
    return formattedValue;
  }

  formatNumber(val) {
    let maskedValue = "";
    if (this.mask) {
      maskedValue = inputMask(val, this.mask);
    } else if (!this.mask && val !== "" && !isNaN(val)) {
      maskedValue = new Intl.NumberFormat(LOCALE).format(val);
    }
    return maskedValue ? maskedValue : val;
  }

  /* eslint-disable consistent-return */
  formatCurrency(amount) {
    let value = amount; //this might be a string like $5.00
    if (!isNaN(amount)) {
      try {
        value = formatCurrency(amount, {
          anlocale: this.locale || LOCALE || "en-US",
          money: this.currency || CURRENCY || "USD"
        });
        return value;
      } catch (e) {
        // handle error
      }
    }
    return value; //null or undefined or string
  }
  /* eslint-enable consistent-return */

  formatAddress(address) {
    if (!address) return "";

    let add = [
      address.street || address.Street,
      address.city || address.City,
      address.state || address.State,
      address.postalCode || address.PostalCode,
      address.country || address.Country
    ].filter((val) => val != null);

    if (add.length === 0 && (address.Latitude || address.latitude)) {
      return (
        "Longitude: " +
        (address.longitude || address.Longitude) +
        "; Latitude: " +
        (address.latitude || address.Latitude)
      );
    }

    return add.join(", ");
  }

  formatField(input, type) {
    let val = input;
    /* eslint-disable default-case */
    switch (type) {
      case "number":
        val = this.formatNumber(val);
        break;
      case "currency":
        // $ **,***.**
        val = this.formatCurrency(val);
        break;
      case "date":
        // mm/dd/yy
        val = this.formatDate(val);
        break;
      case "datetime":
        // mon dd, yyyy hh:mm AM/PM
        val = this.formatDateTime(val);
        break;
      case "percentage":
      case "percent":
        val = parseFloat(input);
        val = !isNaN(val) ? val + "%" : "";
        break;
      case "phone":
        // (***) ***-****
        val = this.formatUsPhone(val);
        break;
      case "address":
        // stree,city,state,postalcode,country
        val = this.formatAddress(val);
        break;
      case "checkbox":
        // true,false
        val = typeof val === "boolean" ? val.toString() : val;
        break;
      case "url":
        // website link, hyperlink
        if (val && !this.preventNavigation) this.urlHref = val;
        break;
      case "text":
        // If text contains a boolean value, then return it as true/false
        if (typeof val === "boolean") {
          val = val ? "true" : "false";
        } else {
          // If val is a numeric value, convert it to a string
          if (
            typeof val === "number" ||
            (typeof val === "string" && !isNaN(val))
          ) {
            val = val.toString();
          }
        }
        break;
    }
    /* eslint-enable default-case */
    return val;
  }
  getDateToFormat(date) {
    if (
      this.useAbsoluteDate &&
      date &&
      new Date(date).toDateString() !== "Invalid Date" &&
      date.split("T").length > 1
    ) {
      return date.split("T")[0];
    }
    return date;
  }
}
