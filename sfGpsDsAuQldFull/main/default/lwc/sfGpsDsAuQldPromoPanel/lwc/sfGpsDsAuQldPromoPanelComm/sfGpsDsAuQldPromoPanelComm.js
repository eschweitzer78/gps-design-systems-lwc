/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import {
  normaliseString,
  replaceInnerHtml,
  computeClass
} from "c/sfGpsDsHelpers";

const TYPE_LARGE_TEXT = "large-text";
const TYPE_CONTAINED = "contained";
const TYPE_FULL_IMAGE = "full-image";
const TYPE_VALUES = [TYPE_LARGE_TEXT, TYPE_CONTAINED, TYPE_FULL_IMAGE];
const TYPE_DEFAULT = TYPE_LARGE_TEXT;

const BACKGROUND_COLOUR_DEFAULT = "light";
const BACKGROUND_COLOUR_VALUES = {
  light: "qld__body--light",
  alternate: "qld__body--alt",
  dark: "qld__body--dark",
  "dark-alternate": "qld__body--dark-alt"
};

const LINKTYPE_DEFAULT = "none";
const LINKTYPE_BUTTON = "button";
const LINKTYPE_CTA = "cta";
const LINKTYPE_VALUES = [LINKTYPE_DEFAULT, LINKTYPE_BUTTON, LINKTYPE_CTA];

const IMAGE_ALIGNMENT_VALUES = {
  left: "qld__promo-panel--image-left",
  right: "qld__promo-panel--image-right"
};
const IMAGE_ALIGNMENT_DEFAULT = "left";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldPromoPanelComm";

/**
 * @slot panelContent
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api title;
  @api abstract;
  @api icon;

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* api: cta */

  _cta;
  _ctaOriginal;

  @api
  get cta() {
    return this._ctaOriginal;
  }

  set cta(markdown) {
    try {
      this._ctaOriginal = markdown;
      this._cta = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("CT-MD", "Issue when parsing CTA markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set cta", e);
    }
  }

  /* api: buttonPrimary */

  _buttonPrimary;
  _buttonPrimaryOriginal;

  @api
  get buttonPrimary() {
    return this._buttonPrimaryOriginal;
  }

  set buttonPrimary(markdown) {
    try {
      this._buttonPrimaryOriginal = markdown;
      this._buttonPrimary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("PB-MD", "Issue when parsing Primary button markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set buttonPrimary", e);
    }
  }

  /* api: buttonSecondary */

  _buttonSecondary;
  _buttonSecondaryOriginal;

  @api
  get buttonSecondary() {
    return this._buttonSecondaryOriginal;
  }

  set buttonSecondary(markdown) {
    try {
      this._buttonSecondaryOriginal = markdown;
      this._buttonSecondary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("SB-MD", "Issue when parsing Secondary button markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set buttonSecondary", e);
    }
  }

  /* api: type */

  _type;
  _typeOriginal;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });

    this.updateClassName();
  }

  /* api: background */

  _backgroundColour = BACKGROUND_COLOUR_VALUES[BACKGROUND_COLOUR_DEFAULT];
  _backgroundColourOriginal = BACKGROUND_COLOUR_DEFAULT;

  @api
  get backgroundColour() {
    return this._backgroundColourOriginal;
  }

  set backgroundColour(value) {
    if (this._backgroundColour) this.classList.remove(this._backgroundColour);

    this._backgroundColourOriginal = value;
    this._backgroundColour = normaliseString(value, {
      validValues: BACKGROUND_COLOUR_VALUES,
      fallbackValue: BACKGROUND_COLOUR_DEFAULT,
      returnObjectValue: true
    });
    if (this._backgroundColour) this.classList.add(this._backgroundColour);
  }

  /* api: linkType */

  _linkType;
  _linkTypeOriginal;

  @api
  get linkType() {
    return this._linkTypeOriginal;
  }

  set linkType(value) {
    this._linkTypeOriginal = value;
    this._linkType = normaliseString(value, {
      validValues: LINKTYPE_VALUES,
      fallbackValue: LINKTYPE_DEFAULT
    });
  }

  /* api: imageAlignment */

  _imageAlignment;
  _imageAlignmentOriginal;

  @api
  get imageAlignment() {
    return this._imageAlignmentOriginal;
  }

  set imageAlignment(value) {
    if (this._imageAlignment) this.classList.remove(this._imageAlignment);

    this._imageAlignmentOriginal = value;
    this._imageAlignment = normaliseString(value, {
      validValues: IMAGE_ALIGNMENT_VALUES,
      fallbackValue: IMAGE_ALIGNMENT_DEFAULT,
      returnObjectValue: true
    });
    if (this._imageAlignment) this.classList.add(this._imageAlignment);
  }

  /* api: image */

  _image;

  @api
  get image() {
    return this._image;
  }

  set image(value) {
    this._image = value;
    this.updateClassName();
  }

  /* api: className */

  _className;

  @api
  get className() {
    return this._className;
  }

  set className(value) {
    if (this._className) this.classList.remove(this._className);
    this._className = value;
    if (this._className) this.classList.add(this._className);
  }

  /* getters */

  get computedCtaLinkUrl() {
    return this._cta?.url;
  }

  get computedCtaLinkText() {
    return this._cta?.text;
  }

  get computedPrimaryLinkUrl() {
    return this._buttonPrimary?.url;
  }

  get computedPrimaryLinkText() {
    return this._buttonPrimary?.text;
  }

  get computedSecondaryLinkUrl() {
    return this._buttonSecondary?.url;
  }

  get computedSecondaryLinkText() {
    return this._buttonSecondary?.text;
  }

  get computedPanelContainerStyle() {
    return this._type === TYPE_FULL_IMAGE
      ? `background-image: url(${encodeURI(this._image)}); background-repeat: no-repeat; background-size: cover`
      : null;
  }

  get computedPanelImageStyle() {
    return this._type === TYPE_FULL_IMAGE
      ? "background: transparent"
      : `background-image: url(${encodeURI(this._image)})`;
  }

  get computedIconClassName() {
    return {
      "qld__promo-panel__icon": true,
      [this.icon]: this.icon
    };
  }

  get computedLinkTypeIsCta() {
    return this._linkType === LINKTYPE_CTA;
  }

  get computedLinkTypeIsButton() {
    return this._linkType === LINKTYPE_BUTTON;
  }

  get computedHasLinks() {
    return this.computedPrimaryLinkUrl || this.computedSecondaryLinkUrl;
  }

  get computedHasTitleOrAbstract() {
    return this.title || this.abstract;
  }

  /* methods */

  updateClassName() {
    this.classList.remove(
      "qld__body--large-text",
      "qld__body--contained",
      "qld__body--full-image",
      "qld__body--full-width",
      "container-fluid"
    );

    if (this._image) {
      const className = computeClass({
        "qld__body--large-text": this._type === TYPE_LARGE_TEXT,
        "qld__body--contained": this._type === TYPE_CONTAINED,
        "qld__body--full-image": this._type === TYPE_FULL_IMAGE
      });
      if (className) this.classList.add(className);
    } else {
      this.classList.add("qld__body--full-width", "container-fluid");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld__body", "qld__promo-panel");
    this.updateClassName();
  }

  renderedCallback() {
    const md = this.refs.markdown;

    if (this._contentOriginal && md) {
      replaceInnerHtml(md, this._contentHtml || "");
    }
  }
}
