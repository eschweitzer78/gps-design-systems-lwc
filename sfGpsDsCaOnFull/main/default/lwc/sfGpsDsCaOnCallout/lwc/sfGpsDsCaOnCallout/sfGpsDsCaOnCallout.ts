/*
* Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  HeadingColour, 
  HeadingLevel 
} from "c/sfGpsDsCaOnCallout";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnCaCallout";


const HIGHLIGHTCOLOUR_VALUES: Record<HeadingColour, string> = {
  default: "ontario-border-highlight--teal",
  blue: "ontario-border-highlight--blue",
  gold: "ontario-border-highlight--gold", 
  green: "ontario-border-highlight--green", 
  lime: "ontario-border-highlight--lime",
  purple: "ontario-border-highlight--purple",
  sky: "ontario-border-highlight--sky", 
  taupe: "ontario-border-highlight--taupe",
  teal: "ontario-border-highlight--teal", 
  yellow: "ontario-border-highlight--yellow" 
} as const;
const HIGHLIGHTCOLOUR_DEFAULT = "default";

const HEADINGLEVEL_VALUES: HeadingLevel[] = [
  "h2", "h3", "h4", "h5", "h6"
];
const HEADINGLEVEL_DEFAULT: HeadingLevel = "h2";

export default 
class SfGpsDsCaOnCallout
extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api 
  highlightColour?: HeadingColour;
  _highlightColour = this.defineEnumObjectProperty<string, HeadingColour>("highlightColour", {
    validValues: HIGHLIGHTCOLOUR_VALUES,
    defaultValue: HIGHLIGHTCOLOUR_DEFAULT
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
  className?: string;

  /* getters */

  get computedClassName(): any {
    return {
      "ontario-callout": true,
      [this._highlightColour.value]: !!this._highlightColour.value,
      [this.className || ""]: this.className
    }
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
