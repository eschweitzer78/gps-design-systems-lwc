import { api } from "lwc";
import {
  replaceInnerHtml,
  isArray,
  isObject,
  isString
} from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

/**
 * @slot mobileBreadcrumbs
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
  @api backgroundImageAlignment;
  @api backgroundMinHeight;
  @api ctaType;
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
