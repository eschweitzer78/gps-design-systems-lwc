/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.10
 */

import { api } from "lwc";
import {
  replaceInnerHtml,
  isArray,
  isObject,
  isString
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldBannerComm";

/**
 * @slot mobileBreadcrumbs
 * @slot tabletBreadcrumbs
 * @slot desktopBreadcrumbs
 * @slot abstract
 */
export default class extends SfGpsDsLwc {
  @api mode;
  @api headingPrimary;
  @api headingSecondary;
  @api headingBackgroundDisplay;
  @api heroImage;
  @api heroImageResponsiveTreatment;
  @api heroImageAlignment;
  @api heroImagePadding;
  @api backgroundType;
  @api backgroundColour;
  @api backgroundImageSm;
  @api backgroundImageLg;
  @api backgroundImageAlt;
  @api backgroundImageAlignment;
  @api backgroundMinHeight;
  @api ctaType;
  @api iconTilesLabel;
  @api className;

  /* api: items */

  _itemsArray = [];
  _itemsOriginal;

  @api set breadcrumbsItems(markdown) {
    try {
      this._itemsOriginal = markdown;
      this._itemsArray = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set breadcrumbsItems", e);
    }
  }

  get breadcrumbsItems() {
    return this._itemsOriginal;
  }

  /* api: abstract */

  _abstractHtml;
  _abstractOriginal;

  @api
  get abstract() {
    return this._abstractOriginal;
  }

  set abstract(markdown) {
    this._abstractOriginal = markdown;
    try {
      this._abstractHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Abstract markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set abstract", e);
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
    this._buttonPrimaryOriginal = markdown;

    try {
      this._buttonPrimary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Primary button markdown");
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
    this._buttonSecondaryOriginal = markdown;

    try {
      this._buttonSecondary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Button secondary markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set buttonSecondary", e);
    }
  }

  /* api: ctaConfig */

  _ctaConfig;
  _ctaConfigOriginal;

  @api
  get ctaConfig() {
    return this._ctaConfigOriginal;
  }

  set ctaConfig(value) {
    this._ctaConfigOriginal = value;

    if (isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        this.addError(
          "CU-JP",
          "Issue when parsing Call to Action config JSON value"
        );
        if (DEBUG) console.debug(CLASS_NAME, "set ctaConfig", e);
      }
    }

    if (isArray(value) || isObject(value)) {
      this._ctaConfig = value;
    } else {
      this._ctaConfig = null;
    }
  }

  /* computed */

  get computedLinkList() {
    return isArray(this._ctaConfig) ? this.ctaConfig : null;
  }

  get computedIconTiles() {
    return isArray(this._ctaConfig) ? this.ctaConfig : this._ctaConfig?.tiles;
  }

  get computedIconTileBackground() {
    return isArray(this._ctaConfig) ? null : this._ctaConfig?.background;
  }

  /* lifecycle */

  renderedCallback() {
    if (this.refs.abstract) {
      replaceInnerHtml(this.refs.abstract, this._abstractHtml);
    }
  }
}
