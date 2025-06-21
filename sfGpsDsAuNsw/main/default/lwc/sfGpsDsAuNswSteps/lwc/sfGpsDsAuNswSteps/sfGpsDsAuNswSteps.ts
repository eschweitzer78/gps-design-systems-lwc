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
  Size 
} from "c/sfGpsDsAuNswSteps";

type CStyleValues = Record<CStyle, string>;
type SizeValues = Record<Size, string>;

const CSTYLE_VALUES: CStyleValues = {
  default: "",
  dark: "nsw-steps--dark",
  light: "nsw-steps--light",
  supplementary: "nsw-steps--supplementary"
};
const CSTYLE_DEFAULT: CStyle = "default";

const SIZE_VALUES: SizeValues = {
  large: "",
  medium: "nsw-steps--medium",
  small: "nsw-steps--small"
}
const SIZE_DEFAULT: Size = "large";

const FIRSTCHILD_DEFAULT = false;

export default 
class SfGpsDsAuNswSteps
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  type?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  // @ts-ignore
  @api 
  cstyle?: boolean;
  _cstyle = this.defineEnumObjectProperty<string, CStyle>("cstyle", {
    validValues: CSTYLE_VALUES,
    defaultValue: CSTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  size?: boolean;
  _size = this.defineEnumObjectProperty<string, Size>("size", {
    validValues: SIZE_VALUES,
    defaultValue: SIZE_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-steps": true,
      [this._cstyle.value]: !!this._cstyle.value,
      [this._size.value]: !!this._size.value,
      "nsw-steps--fill": this.type?.includes("fill"),
      "nsw-steps--counters": this.type?.includes("counter"),
      [this.className || ""]: !!this.className
    };
  }
}
