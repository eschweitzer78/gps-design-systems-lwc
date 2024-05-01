import { LightningElement, api, track } from "lwc";
import {
  RplImageFitOptions,
  RplImagePriorityOptions,
  IMAGE_DEFAULT,
  IMAGE_DEFAULT_JSON
} from "c/sfGpsDsAuVic2ImageConstants";

const BPs = [
  { key: "xs", label: "Extra-small screen" },
  { key: "s", label: "Small screen" },
  { key: "m", label: "Medium screen" },
  { key: "l", label: "Large screen" },
  { key: "xl", label: "Extra-large screen" }
];

export default class SfGpsDsAuVic2ImageCpe extends LightningElement {
  @api label = "Image";
  @api schema; // JSON Schema
  @api errors; // PropertyError[] w/ PropertyError = { message }

  @track isOpen = false;

  /* editor */

  handleAccordionClick() {
    this.isOpen = !this.isOpen;
  }

  get isClosed() {
    return !this.isOpen;
  }

  get computedSectionClassName() {
    return "slds-accordion__section" + (this.isOpen ? " slds-is-open" : "");
  }

  /* api: value */

  _valueOriginal = IMAGE_DEFAULT_JSON;
  @track _value = IMAGE_DEFAULT;

  @api get value() {
    return this._valueOriginal;
  }

  set value(value) {
    this._valueOriginal = value;

    const jsonValue = JSON.parse(value);

    if (typeof jsonValue === "object") {
      this._value = jsonValue || IMAGE_DEFAULT;
    } else {
      this._value = IMAGE_DEFAULT;
    }
  }

  get breakpoints() {
    const rv = BPs.map((item) => {
      const value = this._value?.aspect ? this._value.aspect[item.key] : null;
      const base =
        "slds-button slds-button_icon slds-button_icon-border-filled";
      const selected = " slds-is-selected";

      return {
        id: "bpgroup-" + item.key,
        key: item.key,
        label: item.label,
        isSquare: value === "square",
        squareClass: base + (value === "square" ? selected : ""),
        isFull: value === "full",
        fullClass: base + (value === "full" ? selected : ""),
        isWide: value === "wide",
        wideClass: base + (value === "wide" ? selected : ""),
        isUltrawide: value === "ultrawide",
        ultrawideClass: base + (value === "ultrawide" ? selected : ""),
        isPanorama: value === "panorama",
        panoramaClass: base + (value === "panorama" ? selected : "")
      };
    });

    return rv;
  }

  get priorityOptions() {
    return Object.entries(RplImagePriorityOptions).map(([value, label]) => ({
      label,
      value
    }));
  }

  get fitOptions() {
    return Object.entries(RplImageFitOptions).map(([value, label]) => ({
      label,
      value
    }));
  }

  get focalPoint() {
    return this._value?.focalPoint || { x: null, y: null };
  }

  handleChange(event) {
    const target = event.target;

    switch (target.name) {
      case "focalX":
        this._value = {
          ...this._value,
          focalPoint: {
            ...this._value.focalPoint,
            x: target.value
          }
        };
        break;

      case "focalY":
        this._value = {
          ...this._value,
          focalPoint: {
            ...this._value.focalPoint,
            y: target.value
          }
        };
        break;

      case "circle":
        this._value = {
          ...this._value,
          circle: target.checked
        };
        break;

      default:
        this._value = {
          ...this._value,
          [target.name]: target.value
        };
    }

    this.dispatchValueChange();
  }

  handleAspectClick(event) {
    const bp = event.target.dataset.bp;
    const index = event.target.dataset.ndx;

    this._value = {
      ...this._value,
      aspect: {
        ...this._value.aspect,
        [bp]:
          this._value.aspect && this._value.aspect[bp] === index ? null : index
      }
    };

    this.dispatchValueChange();
  }

  dispatchValueChange() {
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: {
          value: JSON.stringify(this._value)
        }
      })
    );
  }
}
