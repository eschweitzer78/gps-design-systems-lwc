/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseBoolean, normaliseString, isArray } from "c/sfGpsDsHelpers";

const CSTYLE_DEFAULT = "dark";
const CSTYLE_VALUES = {
  dark: {
    main: "nsw-hero-banner--dark",
    button: "nsw-button--white"
  },
  light: {
    main: "nsw-hero-banner--light",
    button: "nsw-button--dark"
  },
  "off-white": {
    main: "nsw-hero-banner--off-white",
    button: "nsw-button--dark"
  },
  white: {
    main: "nsw-hero-banner--white",
    button: "nsw-button--dark"
  }
};

const CTAPREVENTDEFAULT_DEFAULT = false;
const LINKSPREVENTDEFAULT_DEFAULT = false;
const WIDE_DEFAULT = false;
const FEATURED_DEFAULT = false;
const LINES_DEFAULT = false;
const LINKS_DEFAULT = [];

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api subtitle;
  @api cta;
  @api image;
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: wide */

  _wide = WIDE_DEFAULT;
  _wideOriginal = WIDE_DEFAULT;

  @api
  get wide() {
    return this._wideOriginal;
  }

  set wide(value) {
    this._wideOriginal = value;
    this._wide = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: WIDE_DEFAULT
    });
  }

  /* api: feature */

  _featured = FEATURED_DEFAULT;
  _featuredOriginal = FEATURED_DEFAULT;

  @api
  get featured() {
    return this._featuredOriginal;
  }

  set featured(value) {
    this._featuredOriginal = value;
    this._featured = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FEATURED_DEFAULT
    });
  }

  /* api: lines */

  _lines = LINES_DEFAULT;
  _linesOriginal = LINES_DEFAULT;

  @api
  get lines() {
    return this._linesOriginal;
  }

  set lines(value) {
    this._linesOriginal = value;
    this._lines = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: LINES_DEFAULT
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

  /* api: linksPreventDefault */

  _linksPreventDefault = LINKSPREVENTDEFAULT_DEFAULT;
  _linksPreventDefaultOriginal = LINKSPREVENTDEFAULT_DEFAULT;

  @api
  get linksPreventDefault() {
    return this._linksPreventDefaultOriginal;
  }

  set linksPreventDefault(value) {
    this._linksPreventDefaultOriginal = value;
    this._linksPreventDefault = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: CTAPREVENTDEFAULT_DEFAULT
    });
  }

  /* api: links */

  _links = LINKS_DEFAULT;
  _linksOriginal = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(value) {
    this._linksOriginal = value;
    this._links = isArray(value)
      ? value.map((link, index) => ({
          ...link,
          index: link.index ? link.index : `link-${index + 1}`
        }))
      : LINKS_DEFAULT;
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-hero-banner": true,
      "nsw-hero-banner--wide": this._wide,
      "nsw-hero-banner--featured": this._featured,
      "nsw-hero-banner--lines": this._lines,
      [this._cstyle.main]: this._cstyle.main,
      [this.className]: this.className
    };
  }

  get computedButtonClassName() {
    return {
      "nsw-button": true,
      [this._cstyle.button]: this._cstyle.button
    };
  }

  get computedHasLinks() {
    return this._links?.length > 1;
  }

  /* event management */

  handleCtaClick(event) {
    if (this._ctaPreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { detail: event.target.href })
    );
  }

  handleLinksClick(event) {
    if (this._linksPreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { detail: event.target.href })
    );
  }
}
