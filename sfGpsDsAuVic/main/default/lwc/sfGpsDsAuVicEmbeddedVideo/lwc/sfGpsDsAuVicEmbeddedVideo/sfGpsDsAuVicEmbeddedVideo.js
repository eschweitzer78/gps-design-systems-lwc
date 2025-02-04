import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const VARIANT_LINK = "link";
const VARIANT_FULL = "full";
const VARIANT_VALUES = [VARIANT_FULL, VARIANT_LINK];
const VARIANT_DEFAULT = VARIANT_LINK;

const DISPLAYTRANSCRIPT_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title; // string
  @api width; // number
  @api height; // number
  @api src; // string
  @api transcript; // string
  @api mediaLink; //   { iconSymbol: String, iconColor: string, iconPlacement: string, iconSize: string; text: string, link: string }
  @api className;

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* api: displayTranscript */

  _displayTranscript = DISPLAYTRANSCRIPT_DEFAULT;
  _displayTranscriptOriginal = DISPLAYTRANSCRIPT_DEFAULT;

  @api
  get displayTranscript() {
    return this._displayTranscriptOriginal;
  }

  set displayTranscript(value) {
    this._displayTranscriptOriginal = value;
    this._displayTranscript = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISPLAYTRANSCRIPT_DEFAULT
    });
  }

  /* computed */

  get computedShowLink() {
    return this._variant === VARIANT_LINK && this.mediaLink;
  }

  get computedShowTranscriptSection() {
    return this._variant === VARIANT_FULL || this._displayTranscript;
  }

  get computedClassName() {
    return {
      "rpl-embedded-video": true,
      [this.className]: this.className
    };
  }
}
