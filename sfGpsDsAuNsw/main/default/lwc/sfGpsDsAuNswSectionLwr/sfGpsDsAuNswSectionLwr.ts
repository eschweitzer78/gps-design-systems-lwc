/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  PaddingStyle, 
  PaddingValues,
  ColorStyle,
  ColorStyleValues
} from "c/sfGpsDsAuNswSectionLwr";

const PADDINGSTYLE_DEFAULT: PaddingStyle = "full";
const PADDINGSTYLE_VALUES: PaddingValues = {
  full: "",
  half: "nsw-section--half-padding",
  none: "nsw-section--no-padding"
};

const COLORSTYLE_DEFAULT: ColorStyle = "none";
const COLORSTYLE_VALUES: ColorStyleValues = {
  none: "",
  "brand-dark": "nsw-section--brand-dark",
  "brand-light": "nsw-section--brand-light",
  "brand-supplementary": "nsw-section--brand-supplementary",
  black: "nsw-section--black",
  white: "nsw-section--white",
  "off-white": "nsw-section--off-white",
  "grey-01": "nsw-section--grey-01",
  "grey-02": "nsw-section--grey-02",
  "grey-03": "nsw-section--grey-03",
  "grey-04": "nsw-section--grey-04"
};

const WITHBOX_DEFAULT = false;
const WITHCONTAINER_DEFAULT = false;
const WITHINVERT_DEFAULT = false;

/**
 * @slot Section
 */
export default 
class SfGpsDsAuNswSectionLwr
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  imageSrc?: string;

  // @ts-ignore
  @api 
  containerClassName?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  paddingStyle?: PaddingStyle;
  _paddingStyle = this.defineEnumObjectProperty<string, PaddingStyle>("paddingStyle", {
    validValues: PADDINGSTYLE_VALUES,
    defaultValue: PADDINGSTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  colorStyle?: ColorStyle;
  _colorStyle = this.defineEnumObjectProperty<string, ColorStyle>("colorStyle", {
    validValues: COLORSTYLE_VALUES,
    defaultValue: COLORSTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  withContainer?: ColorStyle;
  _withContainer = this.defineBooleanProperty("withContainer", {
    defaultValue: WITHCONTAINER_DEFAULT
  });

  // @ts-ignore
  @api 
  withBox?: ColorStyle;
  _withBox = this.defineBooleanProperty("withBox", {
    defaultValue: WITHBOX_DEFAULT
  });

  // @ts-ignore
  @api 
  withInvert?: ColorStyle;
  _withInvert = this.defineBooleanProperty("withInvert", {
    defaultValue: WITHINVERT_DEFAULT
  });

  /* computed */

  get computedStyle() {
    return this.imageSrc ? `background-image: url(${this.imageSrc})` : null;
  }

  get computedClassName(): any {
    return {
      "nsw-section": true,
      [this._paddingStyle.value]: !!this._paddingStyle.value,
      [this._colorStyle.value]: !!this._colorStyle.value,
      "nsw-section--box": !!this._withBox.value,
      "nsw-section--invert": !!this._withInvert.value,
      "nsw-section--image": !!this.imageSrc,
      [this.className || ""]: !!this.className
    };
  }

  get computedContainerClassName(): any {
    return {
      "nsw-container": this._withContainer.value,
      [this.containerClassName || ""]: !!this.containerClassName
    };
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
