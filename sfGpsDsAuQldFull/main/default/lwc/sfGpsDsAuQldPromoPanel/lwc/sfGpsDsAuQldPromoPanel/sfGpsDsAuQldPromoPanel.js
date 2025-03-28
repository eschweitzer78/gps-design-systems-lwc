/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

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

const IMAGE_ALIGNMENT_LEFT = "left";
const IMAGE_ALIGNMENT_RIGHT = "right";
const IMAGE_ALIGNMENT_VALUES = [IMAGE_ALIGNMENT_LEFT, IMAGE_ALIGNMENT_RIGHT];
const IMAGE_ALIGNMENT_DEFAULT = IMAGE_ALIGNMENT_RIGHT;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api abstract;
  @api icon;
  @api image;
  @api ctaLinkTitle;
  @api ctaLinkUrl;
  @api primaryLinkTitle;
  @api primaryLinkUrl;
  @api secondaryLinkTitle;
  @api secondaryLinkUrl;
  @api className;

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
  }

  /* api: background */

  _backgroundColour = BACKGROUND_COLOUR_VALUES[BACKGROUND_COLOUR_DEFAULT];
  _backgroundColourOriginal = BACKGROUND_COLOUR_DEFAULT;

  @api
  get backgroundColour() {
    return this._backgroundColourOriginal;
  }

  set backgroundColour(value) {
    this._backgroundColourOriginal = value;
    this._backgroundColour = normaliseString(value, {
      validValues: BACKGROUND_COLOUR_VALUES,
      fallbackValue: BACKGROUND_COLOUR_DEFAULT,
      returnObjectValue: true
    });
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
    this._imageAlignmentOriginal = value;
    this._imageAlignment = normaliseString(value, {
      validValues: IMAGE_ALIGNMENT_VALUES,
      fallbackValue: IMAGE_ALIGNMENT_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return {
      qld__body: true,
      "qld__body--full-width": !this.image,
      "qld__body--large-text": this.image && this._type === TYPE_LARGE_TEXT,
      "qld__body--contained": this.image && this._type === TYPE_CONTAINED,
      "qld__body--full-image": this.image && this._type === TYPE_FULL_IMAGE,
      [this._backgroundColour]: this._backgroundColour,
      "qld__promo-panel": true,
      "qld__promo-panel--image-left":
        this.image && this._imageAlignment === IMAGE_ALIGNMENT_LEFT,
      "qld__promo-panel--image-right":
        this.image && this._imageAlignment === IMAGE_ALIGNMENT_RIGHT,
      "qld__promo-panel--no-image": !this.image,
      "container-fluid": !this.image,
      [this.className]: this.className
    };
  }

  get computedPanelContainerStyle() {
    return this._type === TYPE_FULL_IMAGE
      ? `background-image: url(${encodeURI(this.image)}); background-repeat: no-repeat; background-size: cover`
      : null;
  }

  get computedPanelImageStyle() {
    return this._type === TYPE_FULL_IMAGE
      ? "background: transparent"
      : `background-image: url(${encodeURI(this.image)})`;
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
    return this.primaryLinkUrl || this.secondaryLinkUrl;
  }

  get computedHasTitleOrAbstract() {
    return this.title || this.abstract;
  }
}
