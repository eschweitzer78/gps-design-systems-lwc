/*
 * Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type {
  HeadingColour, HeadingLevel, HorizontalImagePosition, HorizontalImageSize, LayoutDirection
} from "c/sfGpsDsCaOnCard";

const DEBUG = true;
const CLASS_NAME = "SfGpsDsCaOnCard";

const HEADINGCOLOUR_VALUES: HeadingColour[] = [ "default", "light-accent", "dark-accent", "light-gold", "light-yellow", "light-taupe", "light-green", "light-lime", "light-teal", "light-sky", "light-purple", "light-orange", "light-red", "light-magenta", "gold", "yellow", "taupe", "green", "lime", "teal", "sky", "purple", "orange", "red", "magenta" ] as const;
const HEADINGCOLOUR_DEFAULT = "default";

const HEADINGLEVEL_VALUES: HeadingLevel[] = [
  "h2", "h3", "h4", "h5", "h6"
];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

type HorizontalImagePositionValues = Record<HorizontalImagePosition, string>;

const HORIZONTALIMAGEPOSITION_VALUES: HorizontalImagePositionValues = {
  left: "ontario-card__image-left",
  right: "ontario-card__image-right"
};
const HORIZONTALIMAGEPOSITION_DEFAULT: HorizontalImagePosition = "left";

type HorizontalImageSizeValues = Record<HorizontalImageSize, string>;

const HORIZONTALIMAGESIZE_VALUES: HorizontalImageSizeValues = {
  "one-third": "ontario-card__image-size-one-third",
  "one-fourth": "ontario-card__image-size-one-fourth"
};
const HORIZONTALIMAGESIZE_DEFAULT: HorizontalImageSize = "one-third";

type LayoutDirectionValues = Record<LayoutDirection, string>;
const LAYOUTDIRECTION_VALUES: LayoutDirectionValues = {
  horizontal: "ontario-card__card-type--horizontal",
  vertical: "ontario-card__card-type--basic ontario-card--position-vertical"
};
const LAYOUTDIRECTION_DEFAULT: LayoutDirection = "vertical";

export default 
class SfGpsDsCaOnCard 
extends SfGpsDsElement {
  static renderMode="light";

  // @ts-ignore
  @api 
  ariaLabelText?: string;

  // @ts-ignore
  @api 
  hasDescription?: boolean;
  _hasDescription = this.defineBooleanProperty("hasDescription", {
    defaultValue: false
  });

  // @ts-ignore
  @api 
  heading?: string;

  // @ts-ignore
  @api 
  headingColour?: HeadingColour;
  _headingColour = this.defineEnumProperty<HeadingColour>("headingColour", {
    validValues: HEADINGCOLOUR_VALUES,
    defaultValue: HEADINGCOLOUR_DEFAULT
  });

  // @ts-ignore
  @api 
  headingLevel?: string;
  _headingLevel = this.defineEnumProperty<HeadingLevel>("headingLevel", {
    validValues: HEADINGLEVEL_VALUES,
    defaultValue: HEADINGLEVEL_DEFAULT
  });

  // @ts-ignore
  @api 
  horizontalImagePosition?: HorizontalImagePosition;
  _horizontalImagePosition = this.defineEnumObjectProperty<string, HorizontalImagePosition>("horizontalImagePosition", {
    validValues: HORIZONTALIMAGEPOSITION_VALUES,
    defaultValue: HORIZONTALIMAGEPOSITION_DEFAULT
  });

  // @ts-ignore
  @api 
  horizontalImageSize?: HorizontalImageSize;
  _horizontalImageSize = this.defineEnumObjectProperty<string, HorizontalImageSize>("horizontalImageSize", {
    validValues: HORIZONTALIMAGESIZE_VALUES,
    defaultValue: HORIZONTALIMAGESIZE_DEFAULT
  });

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAltText?: string;

  // @ts-ignore
  @api 
  layoutDirection?: LayoutDirection;
  _layoutDirection = this.defineEnumObjectProperty<string, LayoutDirection>("layoutDirection", {
    validValues: LAYOUTDIRECTION_VALUES,
    defaultValue: LAYOUTDIRECTION_DEFAULT
  });

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* getters */

  get computedClassName(): any {
    const isHI = this.isHorizontalImage;
    
    return {
      "ontario-card": true,
      "ontario-card__description-false": !this._hasDescription.value,
      [this._layoutDirection.value || ""]: this.layoutDirection,
      [this._horizontalImageSize.value || ""]: isHI && this.horizontalImageSize,
      [this._horizontalImagePosition.value || ""]: isHI && this.horizontalImagePosition,
      [`ontario-card__background--${this._headingColour.value}`]: !this._hasDescription.value && this._headingColour.value !== "default",
      [this.className || ""]: this.className
    };
  }

  get computedTextContainerClassName(): any {
    return {
      "ontario-card__text-container": true,
      "ontario-card--image-true": this.image
    };
  }

  get computedHeadingClass(): any {
    return {
      "ontario-card__heading": true,
      [`ontario-card__heading--${this._headingColour.value}`]: this._headingColour.value !== "default"
    }
  }

  get isHorizontalImage() {
    return this.image && 
    this._layoutDirection.value === LAYOUTDIRECTION_VALUES.horizontal;
  }

  get isH2() {
    return this._headingLevel.value === "h2";
  }

  get isH3() {
    return this._headingLevel.value === "h3";
  }

  get isH4() {
    return this._headingLevel.value === "h4";
  }

  get isH5() {
    return this._headingLevel.value === "h5";
  }

  get isH6() {
    return this._headingLevel.value === "h6";
  }
}
