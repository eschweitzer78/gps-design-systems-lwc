/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, track } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const AS_VALUES = {
  default: {
    main: "",
    button: "nsw-button--white"
  },
  light: {
    main: "nsw-global-alert--light",
    button: "nsw-button--dark"
  },
  critical: {
    main: "nsw-global-alert--critical",
    button: "nsw-button--white"
  }
};
const AS_DEFAULT = "default";

const CTASTYLE_LINK = "link";
const CTASTYLE_BUTTON = "button";
const CTASTYLE_VALUES = [CTASTYLE_BUTTON, CTASTYLE_LINK];
const CTASTYLE_DEFAULT = CTASTYLE_LINK;

const CTAPREVENTDEFAULT_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api copy;
  @api ctaText;
  @api ctaHref;
  @api className;

  @track _isClosed;

  /* api: as */

  _as = AS_VALUES[AS_DEFAULT];
  _asOriginal = AS_DEFAULT;

  @api
  get as() {
    return this._asOriginal;
  }

  set as(value) {
    this._asOriginal = value;
    this._as = normaliseString(value, {
      validValues: AS_VALUES,
      fallbackValue: AS_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: ctaStyle */

  _ctaStyle = CTASTYLE_DEFAULT;
  _ctaStyleOriginal = CTASTYLE_DEFAULT;

  @api
  get ctaStyle() {
    return this._ctaStyleOriginal;
  }

  set ctaStyle(value) {
    this._ctaStyleOriginal = value;
    this._ctaStyle = normaliseString(value, {
      validValues: CTASTYLE_VALUES,
      fallbackValue: CTASTYLE_DEFAULT
    });
  }

  /* api: ctaPreventDefault */

  _ctaPreventDefault = CTAPREVENTDEFAULT_DEFAULT;
  _ctaPreventDefaultOriginal = CTAPREVENTDEFAULT_DEFAULT;

  @api
  get ctaPreventDefault() {
    return this._ctaPreventDefaultOriginal;
  }

  set ctaPreventDefault(value) {
    this._ctaPreventDefaultOriginal = value;
    this._ctaPreventDefault = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: CTAPREVENTDEFAULT_DEFAULT
    });
  }

  /* computed */

  get space() {
    return " ";
  }

  get computedClassName() {
    return {
      "nsw-global-alert": true,
      [this._as.main]: this._as.main,
      [this.className]: this.className
    };
  }

  get computedButtonClassName() {
    return {
      "nsw-button": true,
      [this._as.button]: this._as.button
    };
  }

  get _isCtaLinkStyle() {
    return this._ctaStyle === CTASTYLE_LINK;
  }

  get _isCtaButtonStyle() {
    return this._ctaStyle === CTASTYLE_BUTTON;
  }

  /* event management */

  handleCtaClick(event) {
    if (this._ctaPreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  handleCloseClick(event) {
    event.preventDefault();
    this._isClosed = true;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
