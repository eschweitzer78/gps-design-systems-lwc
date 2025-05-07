/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.11
 */

import { LightningElement, api, track } from "lwc";
import {
  normaliseString,
  normaliseBoolean,
  computeClass
} from "c/sfGpsDsHelpers";

const DEBUG = false;
const CSS_ESCAPES = /[;}]/g;

const MODE_DEFAULT = "default";
const MODE_BASIC = "basic";
const MODE_INTERMEDIATE = "intermediate";
const MODE_ADVANCED = "advanced";
const MODE_VALUES = [
  MODE_DEFAULT,
  MODE_BASIC,
  MODE_INTERMEDIATE,
  MODE_ADVANCED
];

const BACKGROUND_COLOUR_DEFAULT = "default";
const BACKGROUND_COLOUR_VALUES = {
  default: { main: "", breadcrumbs: "" },
  alternate: { main: "qld__banner--alt", breadcrumbs: "qld__breadcrumbs--alt" },
  dark: { main: "qld__banner--dark", breadcrumbs: "qld__breadcrumbs--dark" },
  "dark-alternate": {
    main: "qld__banner--dark-alt",
    breadcrumbs: "qld__breadcrumbs--dark"
  }
};

const ITB_DEFAULT = "default";
const ITB_ALT = "alternate";
const ITB_DARK = "dark";
const ITB_DARKALT = "dark-alternate";
const ITB_VALUES = [ITB_DEFAULT, ITB_ALT, ITB_DARK, ITB_DARKALT];

const HIA_GRID = "grid";
const HIA_PAGE = "page";
const HIA_VALUES = [HIA_GRID, HIA_PAGE];
const HIA_DEFAULT = HIA_GRID;

const HIRT_CROP = "crop";
const HIRT_SCALE = "scale";
const HIRT_VALUES = [HIRT_CROP, HIRT_SCALE];
const HIRT_DEFAULT = HIRT_CROP;

const BACKGROUND_TYPE_SOLID = "solid";
const BACKGROUND_TYPE_IMAGE = "image";
const BACKGROUND_TYPE_TEXTURE = "texture";
const BACKGROUND_TYPE_VALUES = [
  BACKGROUND_TYPE_SOLID,
  BACKGROUND_TYPE_IMAGE,
  BACKGROUND_TYPE_TEXTURE
];
const BACKGROUND_TYPE_DEFAULT = BACKGROUND_TYPE_SOLID;

const CTA_TYPE_NONE = "none";
const CTA_TYPE_BUTTONS = "buttons";
const CTA_TYPE_ICONTILES = "icon-tiles";
const CTA_TYPE_LINKLIST = "link-list";
const CTA_TYPE_VALUES = [
  CTA_TYPE_NONE,
  CTA_TYPE_BUTTONS,
  CTA_TYPE_ICONTILES,
  CTA_TYPE_LINKLIST
];
const CTA_TYPE_DEFAULT = CTA_TYPE_BUTTONS;

const HBD_DEFAULT = false;
const HIP_DEFAULT = false;

export default class extends LightningElement {
  @api breadcrumbsItems;
  @api headingPrimary;
  @api headingSecondary;
  @api heroImage;
  @api backgroundImageSm;
  @api backgroundImageLg;
  @api backgroundImageAlt;
  @api backgroundImageAlignment;
  @api backgroundMinHeight;
  @api buttonPrimary;
  @api buttonSecondary;
  @api linkList;
  @api iconTiles;
  @api iconTilesLabel;
  @api className;

  /* api: mode */

  _mode;
  _modeOriginal;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  /* api: headingBackgroundDisplay */

  _headingBackgroundDisplay = HBD_DEFAULT;
  _headingBackgroundDisplayOriginal = HBD_DEFAULT;

  @api
  get headingBackgroundDisplay() {
    return this._headingBackgroundDisplayOriginal;
  }

  set headingBackgroundDisplay(value) {
    this._headingBackgroundDisplayOriginal = value;
    this._headingBackgroundDisplay = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HBD_DEFAULT
    });
  }

  /* api: heroImageResponsiveTreatment */

  _heroImageResponsiveTreatment = HIRT_DEFAULT;
  _heroImageResponsiveTreatmentOriginal = HIRT_DEFAULT;

  @api
  get heroImageResponsiveTreatment() {
    return this._heroImageResponsiveTreatmentOriginal;
  }

  set heroImageResponsiveTreatment(value) {
    this._heroImageResponsiveTreatmentOriginal = value;
    this._heroImageResponsiveTreatment = normaliseString(value, {
      validValues: HIRT_VALUES,
      fallbackValue: HIRT_DEFAULT
    });
  }

  /* api: heroImageAlignment */

  _heroImageAlignment = HIA_DEFAULT;
  _heroImageAlignmentOriginal = HIA_DEFAULT;

  @api
  get heroImageAlignment() {
    return this._heroImageAlignmentOriginal;
  }

  set heroImageAlignment(value) {
    this._heroImageAlignmentOriginal = value;
    this._heroImageAlignment = normaliseString(value, {
      validValues: HIA_VALUES,
      fallbackValue: HIA_DEFAULT
    });
  }

  /* api: heroImagePadding */

  _heroImagePadding = HIP_DEFAULT;
  _heroImagePaddingOriginal = HIP_DEFAULT;

  @api
  get heroImagePadding() {
    return this._heroImagePaddingOriginal;
  }

  set heroImagePadding(value) {
    this._heroImagePaddingOriginal = value;
    this._heroImagePadding = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIP_DEFAULT
    });
  }

  /* api: backgroundType */

  _backgroundType = BACKGROUND_TYPE_DEFAULT;
  _backgroundTypeOriginal = BACKGROUND_TYPE_DEFAULT;

  @api
  get backgroundType() {
    return this._backgroundType;
  }

  set backgroundType(value) {
    this._backgroundTypeOriginal = value;
    this._backgroundType = normaliseString(value, {
      validValues: BACKGROUND_TYPE_VALUES,
      fallbackValue: BACKGROUND_TYPE_DEFAULT
    });
  }

  /* api: backgroundColour */

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

  /* api: ctaType */

  _ctaType = CTA_TYPE_DEFAULT;
  _ctaTypeOriginal = CTA_TYPE_DEFAULT;

  @api
  get ctaType() {
    return this._ctaType;
  }

  set ctaType(value) {
    this._ctaTypeOriginal = value;
    this._ctaType = normaliseString(value, {
      validValues: CTA_TYPE_VALUES,
      fallbackValue: CTA_TYPE_DEFAULT
    });
  }

  /* api: iconTileBackground */

  _iconTileBackground = ITB_DEFAULT;
  _iconTileBackgroundOriginal = ITB_DEFAULT;

  @api
  get iconTileBackground() {
    return this._iconTileBackgroundOriginal;
  }

  set iconTileBackground(value) {
    this._iconTileBackgroundOriginal = value;
    this._iconTileBackground = normaliseString(value, {
      validValues: ITB_VALUES,
      fallbackValue: ITB_DEFAULT
    });
  }

  /* getters */

  get computedHasBreadcrumbsItems() {
    return !!this.breadcrumbsItems?.length;
  }

  get computedIsDefault() {
    return this._mode === MODE_DEFAULT;
  }

  get computedIsBasic() {
    return this._mode === MODE_BASIC;
  }

  get computedIsAdvanced() {
    return this._mode === MODE_ADVANCED;
  }

  get computedClassName() {
    return {
      qld__banner: true,
      "qld__banner--breadcrumbs": this.computedHasBreadcrumbsItems,
      [this._backgroundColour.main]: this._backgroundColour,
      qld__banner__advanced: this.computedIsAdvanced,
      "qld__banner--has-hero": this.heroImage,
      "qld__banner--padded": this._heroImagePadding,
      "qld__banner--hero-right": this._heroImageAlignment === HIA_PAGE,
      "qld__banner--nav": this._ctaType === CTA_TYPE_ICONTILES,
      [this.className]: this.className,
      "sf-gps-ds-au-qld-banner--background-type--image":
        !this.computedIsDefault &&
        this._backgroundType === BACKGROUND_TYPE_IMAGE,
      "sf-gps-ds-au-qld-banner--background-type--texture":
        this._backgroundType === BACKGROUND_TYPE_TEXTURE,
      "sf-gps-ds-au-qld-banner--background-min-height":
        this.computedIsAdvanced && this.backgroundMinHeight
    };
  }

  get computedStyle() {
    const hasI = !!this.backgroundImageLg || this.backgroundImageSm;
    const i = encodeURI(this.backgroundImageLg || this.backgroundImageSm);

    return computeClass(
      {
        [`--sfgpsds-au-qld-banner--background-image-lg: url(${encodeURI(
          this.backgroundImageLg
        )})`]: this.backgroundImageLg,
        [`--sfgpsds-au-qld-banner--background-image-alignment: ${this.backgroundImageAlignment?.replaceAll(
          CSS_ESCAPES,
          ""
        )}`]: this.backgroundImageAlignment,
        [`--sfgpsds-au-qld-banner--default-texture: url(${i})`]: hasI,
        [`--sfgpsds-au-qld-banner--default-texture-dark: url(${i})`]: hasI,
        [`--sfgpsds-au-qld-banner--background-min-height: ${this.backgroundMinHeight?.replaceAll(
          CSS_ESCAPES,
          ""
        )}`]: this.backgroundMinHeight
      },
      ";"
    );
  }

  get computedIntermediateBannerHeroClassName() {
    return {
      qld__banner__hero: true,
      "col-xs-12": true,
      "qld__banner__hero--scale":
        this._heroImageResponsiveTreatment === HIRT_SCALE,
      "col-md-6":
        this._heroImageResponsiveTreatment === HIRT_SCALE ||
        (this._heroImageResponsiveTreatment === HIRT_CROP &&
          this._imageAlignment === HIA_GRID),
      "col-md-7":
        this._heroImageResponsiveTreatment === HIRT_CROP &&
        this._imageAlignment !== HIA_GRID,
      "col-lg-5":
        this._heroImageResponsiveTreatment === HIRT_SCALE ||
        this._heroImageResponsiveTreatment === HIRT_CROP,
      "col-xl-4":
        this._heroImageResponsiveTreatment === HIRT_CROP &&
        this._imageAlignment !== HIA_GRID,
      "col-xl-5":
        this._heroImageResponsiveTreatment === HIRT_SCALE ||
        (this._heroImageResponsiveTreatment === HIRT_CROP &&
          this._imageAlignment === HIA_GRID)
    };
  }

  get computedAdvancedBannerHeroClassName() {
    return {
      qld__banner__hero: true,
      "col-xs-12": true,
      "qld__banner__hero--scale":
        this._heroImageResponsiveTreatment === HIRT_SCALE,
      "col-md-6":
        this._heroImageResponsiveTreatment === HIRT_SCALE ||
        (this._heroImageResponsiveTreatment === HIRT_CROP &&
          this._imageAlignment === HIA_GRID),
      "col-md-7":
        this._heroImageResponsiveTreatment === HIRT_CROP &&
        this._imageAlignment !== HIA_GRID,
      "col-lg-5":
        this._heroImageResponsiveTreatment === HIRT_SCALE ||
        this._heroImageResponsiveTreatment === HIRT_CROP,
      "col-xl-4": this._heroImageResponsiveTreatment === HIRT_SCALE
    };
  }

  get computedIntermediateBannerContentClassName() {
    return {
      qld__banner__content: true,
      "col-xs-12": true,
      "col-md-6": this.heroImage,
      "col-md-8": !this.heroImage,
      "col-lg-7": this.heroImage,
      "col-lg-8": !this.heroImage
    };
  }

  get computedBreadcrumbsMobileClassName() {
    return this.computeBreadcrumbsClassName("mobile");
  }

  get computedBreadcrumbsTabletClassName() {
    return this.computeBreadcrumbsClassName("tablet");
  }

  get computedBreadcrumbsDesktopClassName() {
    return this.computeBreadcrumbsClassName("desktop");
  }

  get computedHasImage() {
    return this.heroImage || this.backgroundImageSm;
  }

  get computedBannerImageDesktopClassName() {
    return {
      qld__banner__image: true,
      "qld__banner__image--mobile-hide": this.backgroundImageSm
    };
  }

  get computedBannerImageDesktopStyle() {
    return this.heroImage
      ? `background-image: url(${encodeURI(this.heroImage)})`
      : null;
  }

  get computedBannerImageMobileStyle() {
    return this.backgroundImageSm
      ? `background-image: url(${encodeURI(this.backgroundImageSm)})`
      : null;
  }

  get computedNavClassName() {
    return {
      qld__banner__nav: true,
      "qld__banner__nav--fix-right": this.heroImageAlignment === HIA_PAGE
    };
  }

  get computedBannerNavClassName() {
    return {
      qld__banner__nav: true,
      "qld__banner__nav--fix-right": this.heroImageAlignment === HIA_PAGE
    };
  }

  get computedTileNavClassName() {
    return {
      "qld__tile-nav": true,
      "qld__tile-nav--alt": this.iconTileBackground === ITB_ALT,
      "qld__tile-nav--dark": this.iconTileBackground === ITB_DARKALT,
      "qld__tile-nav--dark-alt": this.iconTileBackground === ITB_DARKALT
    };
  }

  get computedIsCtaButtons() {
    return this._ctaType === CTA_TYPE_BUTTONS;
  }

  get computedIsCtaLinkList() {
    return this._ctaType === CTA_TYPE_LINKLIST;
  }

  get computedIsCtaIconTiles() {
    return this._ctaType === CTA_TYPE_ICONTILES;
  }

  get computedButtonPrimaryUrl() {
    return this.buttonPrimary?.url;
  }

  get computedButtonPrimaryText() {
    return this.buttonPrimary?.text;
  }

  get computedButtonSecondaryUrl() {
    return this.buttonSecondary?.url;
  }

  get computedButtonSecondaryText() {
    return this.buttonSecondary?.text;
  }

  get debug() {
    return DEBUG;
  }

  /* methods */

  computeBreadcrumbsClassName(type) {
    return computeClass({
      qld__banner__breadcrumbs: true,
      "qld__banner__breadcrumbs--desktop": type === "desktop",
      "qld__banner__breadcrumbs--mobile": type === "mobile",
      "qld__banner__breadcrumbs--tablet": type === "tablet",
      [this._backgroundColour?.breadcrumbs]: this._backgroundColour
    });
  }

  /* event management */

  @track hasBreadcrumbs = false;

  handleSlotChange(event) {
    switch (event.target.name) {
      case "mobileBreadcrumbs":
      case "tabletBreadcrumbs":
      case "desktopBreadcrumbs":
        this.hasBreadcrumbs = true;
        break;

      default:
    }
  }
}
