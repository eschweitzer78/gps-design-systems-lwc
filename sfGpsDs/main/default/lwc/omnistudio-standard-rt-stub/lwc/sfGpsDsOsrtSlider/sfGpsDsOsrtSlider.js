import { LightningElement, track, api } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import IMask from "c/sfGpsDsOsrtImask";
import { numberIMaskParser } from "c/sfGpsDsOsrtUtility";
import { sliderLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./slider_slds.html";
import ndsTemplate from "./slider_nds.html";

export default class Slider extends LightningElement {
  // declare list of attributes

  //DEPRECATED
  @api range;
  //END OF DEPRECATED

  @api theme = "slds";
  @api label;
  @api disabled;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api tabIndex = "0";

  /* api: min */

  @track _min = 0;

  @api
  get min() {
    return this._min;
  }

  set min(val) {
    this._min =
      isNaN(val) || val === null
        ? this._min
        : typeof val === "string"
          ? parseFloat(val)
          : val;
    this.setRange();
  }

  /* api: max */

  @track _max = 100;

  @api
  get max() {
    return this._max;
  }

  set max(val) {
    this._max =
      isNaN(val) || val === null
        ? this._max
        : typeof val === "string"
          ? parseFloat(val)
          : val;
    this.setRange();
  }

  /* api: value */

  @track _value = 0;

  @api
  get value() {
    return this._value;
  }

  set value(val) {
    this.setValue(val);
  }

  @api
  setValue(val) {
    this._value = parseFloat(
      isNaN(val)
        ? this._value
        : typeof val === "string"
          ? val === ""
            ? 0
            : parseFloat(val)
          : val
    );
    this._maskedValue = this.applyMaskToValue(this._value || 0);
    if (this._value) {
      this.setValidity();
    }
  }

  @api messageWhenRangeOverflow = "Range overflow error.";
  @api messageWhenRangeUnderflow = "Range undeflow error.";
  @api messageWhenStepMismatch = "Step mismatch error.";
  @api messageWhenValueMissing = "This field value is missing.";
  @api messageWhenTooLong = "This field is too long";
  @api messageWhenBadInput = "This field is not valid.";
  @api messageWhenPatternMismatch = "The pattern does not match.";
  @api messageWhenTypeMismatch = "Type mismatch error";

  /* api: sliderRangeAssistiveText */

  @track _sliderRangeAssistiveText;

  @api
  get sliderRangeAssistiveText() {
    if (this._sliderRangeAssistiveText) {
      return this._sliderRangeAssistiveText;
    }

    return this.translatedLabels.omniSliderAssistiveRangeText
      .replace("{0}", this._min)
      .replace("{1}", this._max);
  }

  set sliderRangeAssistiveText(value) {
    this._sliderRangeAssistiveText = value
      .replace("{0}", this._min)
      .replace("{1}", this._max);
  }

  @track verticalClass = "";
  @track sizeClass = "";
  @track labelVisible = true;
  @track isError = false;
  @track errorMessage = "";
  @track firstRender = true;
  @track rangeLabel;
  @track _maskedValue = 0;
  _validity;

  /* api: step */

  @track _step;

  @api
  get step() {
    return this._step;
  }
  set step(val) {
    this._step = val;
  }

  /* api: type */

  @api
  get type() {
    return this._type || "horizontal";
  }

  set type(value) {
    this._type = value;
    if (this._type === "vertical") {
      this.verticalClass = `${this.theme}-slider_vertical `;
    } else {
      this.verticalClass = "";
    }
  }

  /* api: size */

  @api
  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
    if (value !== "") {
      this.sizeClass = `${this.theme}-size_${value} `;
    } else {
      this.sizeClass = "";
    }
  }

  /* api: variant */

  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = value;
    if (this.variant === "label-hidden") {
      this.labelVisible = false;
    }
  }

  /* api: imask */

  _imask = "";

  @api
  get imask() {
    return (
      (typeof this._imask === "string"
        ? numberIMaskParser(this._imask)
        : this._imask) || numberIMaskParser()
    );
  }
  set imask(newVal) {
    this._imask = newVal;
    delete this._maskInstance;
  }

  get maskInstance() {
    if (!this._maskInstance) {
      this._maskInstance = IMask.createMask(this.imask);
    }
    return this._maskInstance;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  translatedLabels = {};

  connectedCallback() {
    this.translatedLabels = translatedLabels;
    this.setRange();
  }

  setRange() {
    this.rangeLabel = `${this.applyMaskToValue(
      this.min
    )}-${this.applyMaskToValue(this.max)}`;
    this.boundaryValidity();
  }

  applyMaskToValue(value) {
    return this.maskInstance.resolve(value.toString());
  }

  handleChange = (event) => {
    this.setValue(event.target.value);
    this.reportValidity();
    Promise.resolve().then(() => {
      this.setValidity();
      if (this.validity.valid) {
        pubsub.fire("Slider", "valuechange", {
          name: "Slider",
          value: this._value
        });
      }
      this.dispatchEvent(
        new CustomEvent("change", {
          bubbles: true,
          composed: true
        })
      );
    });
  };

  get sliderClass() {
    return (
      `${this.theme}-slider ` +
      (this.verticalClass !== "" ? this.verticalClass : "") +
      (this.sizeClass !== "" ? this.sizeClass : "")
    );
  }

  @api
  get validity() {
    return this.template.querySelector("input").validity;
  }

  setValidity() {
    let element = this.template.querySelector("input");
    if (element) {
      this._validity = element.validity;
      this.isError = !this._validity.valid;

      switch (true) {
        case this._validity.valid:
          this.isError = false;
          this.errorMessage = "";
          break;
        case this.validity.valueMissing:
          this.errorMessage = this.messageWhenValueMissing;
          this.isError = true;
          break;
        case this.validity.tooLong:
          this.errorMessage = this.messageWhenTooLong;
          this.isError = true;
          break;
        case this.validity.badInput:
          this.errorMessage = this.messageWhenBadInput;
          this.isError = true;
          break;
        case this.validity.patternMismatch:
          this.errorMessage = this.messageWhenPatternMismatch;
          this.isError = true;
          break;
        case this.validity.rangeOverflow:
          this.errorMessage = this.messageWhenRangeOverflow;
          this.isError = true;
          break;
        case this.validity.rangeUnderflow:
          this.errorMessage = this.messageWhenRangeUnderflow;
          this.isError = true;
          break;
        case this.validity.stepMismatch:
          this.errorMessage = this.messageWhenStepMismatch;
          this.isError = true;
          break;
        case this.validity.typeMismatch:
          this.errorMessage = this.messageWhenTypeMismatch;
          this.isError = true;
          break;
        default:
          this.errorMessage = this.errorMessage ? this.errorMessage : "";
      }
    }
    this.boundaryValidity();
  }

  renderedCallback() {
    const input = this.template.querySelector("input");
    if (input && this.firstRender) {
      ["blur", "focus"].forEach((event) => {
        input.addEventListener(event, () => {
          this.dispatchEvent(
            new CustomEvent(event, {
              bubbles: true,
              composed: true
            })
          );
        });
      });
      this.firstRender = false;
    }
  }

  boundaryValidity() {
    if (this.min && this.max && this.min > this.max) {
      this.errorMessage = this.messageWhenBadInput;
      this.isError = true;
    } else if (this.value && this.min && this.max && this.value > this.max) {
      this.errorMessage = this.messageWhenRangeOverflow;
      this.isError = true;
    } else if (this.value && this.min && this.max && this.value < this.min) {
      this.errorMessage = this.messageWhenRangeUnderflow;
      this.isError = true;
    }
  }

  @api
  checkValidity() {
    this._validity = this.template.querySelector("input").validity;
    return this._validity && this._validity.valid;
  }

  @api
  setCustomValidity(message) {
    this.template.querySelector("input").setCustomValidity(message);
    this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity();
  }

  @api
  reportValidity() {
    this.setValidity();
    return this._validity.valid;
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  @api
  blur() {
    this.template.querySelector("input").blur();
  }

  closeTooltip() {
    const tooltip = this.template.querySelector("[data-field-level-help]");
    if (tooltip) {
      tooltip.closeTooltip();
    }
  }
}
