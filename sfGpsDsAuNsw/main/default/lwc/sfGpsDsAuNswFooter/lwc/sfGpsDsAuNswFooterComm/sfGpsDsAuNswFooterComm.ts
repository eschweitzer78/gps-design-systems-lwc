/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  CStyle 
} from "c/sfGpsDsAuNswFooterComm";

type CStyleValues = Record<CStyle, string>;

const CSTYLE_VALUES: CStyleValues = {
  default: "",
  custom: "nsw-footer--custom",
  dark: "nsw-footer--dark",
  light: "nsw-footer--light"
};
const CSTYLE_DEFAULT: CStyle = "default";

export default 
class SfGpsDsAuNswFooterCoom 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  upperFooterMode: string = "Integration Procedure";

  // @ts-ignore
  @api 
  upperFooterNavigationDevName?: string;

  // @ts-ignore
  @api 
  upperFooterIpName?: string;

  // @ts-ignore
  @api 
  upperFooterInputJSON?: string;

  // @ts-ignore
  @api 
  upperFooterOptionsJSONN?: string;

  // @ts-ignore
  @api 
  upperFooterClassName?: string;

  // @ts-ignore
  @api 
  mode: string = "Integration Procedure";

  // @ts-ignore
  @api 
  navigationDevName?: string;

  // @ts-ignore
  @api 
  ipName?: string;

  // @ts-ignore
  @api 
  inputJSON?: string;

  // @ts-ignore
  @api 
  optionsJSON?: string;
  // @ts-ignore
  
  @api 
  statement?: string;

  // @ts-ignore
  @api 
  linkedInUrl?: string;

  // @ts-ignore
  @api 
  twitterXUrl?: string;

  // @ts-ignore
  @api 
  facebookUrl?: string;

  // @ts-ignore
  @api 
  copyrightMention?: string;

  // @ts-ignore
  @api 
  builtMention?: string;

  // @ts-ignore
  @api 
  lowerFooterClassName?: string;

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

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-footer": true,
      [this._cstyle.value]: !!this._cstyle.value,
      [this.className || ""]: !!this.className
    };
  }

  get computedShowUpperFooter(): boolean {
    return this.upperFooterMode !== "Hide";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
