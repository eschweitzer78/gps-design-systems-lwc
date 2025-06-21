/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  CStyle, 
  Position 
} from "c/sfGpsDsAuNswMedia";

type CStyleValues = Record<CStyle, string>;

const CSTYLE_VALUES: CStyleValues = {
  default: "",
  dark: "nsw-media--dark",
  light: "nsw-media--light",
  transparent: "nsw-media--transparent"
};
const CSTYLE_DEFAULT: CStyle = "default";

type PositionValues = Record<Position, string>

const POSITION_VALUES: PositionValues = {
  default: "",
  "60": "nsw-media--60",
  "70": "nsw-media--70",
  "80": "nsw-media--80",
  "90": "nsw-media--90",
  "left-30": "nsw-media--left-30",
  "left-40": "nsw-media--left-40",
  "left-50": "nsw-media--left-50",
  "right-30": "nsw-media--right-30",
  "right-40": "nsw-media--right-40",
  "right-50": "nsw-media--right-50"
};
const POSITION_DEFAULT = "default";

export default 
class SfGpsDsAuNswMedia
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  video?: string;

  // @ts-ignore
  @api 
  videoTitle?: string;

  // @ts-ignore
  @api 
  caption?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  cstyle?: CStyle;
  _cstyle = this.defineEnumObjectProperty<string, CStyle>("cstyle", {
    validValues: CSTYLE_VALUES,
    defaultValue: CSTYLE_DEFAULT
  });

  // @ts-ignore
  @api
  position?: CStyle;
  _position = this.defineEnumObjectProperty<string, CStyle>("position", {
    validValues: POSITION_VALUES,
    defaultValue: POSITION_DEFAULT
  });

  /* computed */

  get computedClassName() {
    return {
      "nsw-media": true,
      [this._cstyle.value]: this._cstyle.value,
      [this._position.value]: this._position.value,
      [this.className || ""]: !!this.className
    };
  }
}
