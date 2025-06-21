/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  CStyle 
} from "c/sfGpsDsAuNswMasthead";

interface CStyleValue {
  skip: string,
  masthead: string
}

type CStyleValues = Record<CStyle, CStyleValue>

const CSTYLE_DEFAULT: CStyle = "default";
const CSTYLE_VALUES: CStyleValues = {
  default: { skip: "", masthead: "" },
  light: { skip: "nsw-skip--light", masthead: "nsw-masthead--light" }
};

export default 
class SfGpsDsAuNswMasthead
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  arLabel: string = "Skip to links";

  // @ts-ignore
  @api 
  navLabel: string = "Skip to navigation";

  // @ts-ignore
  @api 
  contentLabel: string = "Skip to content";

  // @ts-ignore
  @api 
  content?: string;

  // @ts-ignore
  @api 
  nav?: string;
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  cstyle?: CStyle;
  _cstyle = this.defineEnumObjectProperty<CStyleValue, CStyle>("cstyle", {
    validValues: CSTYLE_VALUES,
    defaultValue: CSTYLE_DEFAULT
  });

  /* computed */

  get computedSkipClassName(): any {
    return {
      "nsw-skip": true,
      [this._cstyle.value.skip]: this._cstyle.value.skip
    };
  }

  get computedMastheadClassName(): any {
    return {
      "nsw-masthead": true,
      [this._cstyle.value.masthead]: this._cstyle.value.masthead,
      [this.className || ""]: !!this.className
    };
  }
}
