/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const CSTYLE_VALUES = {
  default: "",
  custom: "nsw-footer--custom",
  dark: "nsw-footer--dark",
  light: "nsw-footer--light"
};
const CSTYLE_DEFAULT = "default";

export default class extends SfGpsDsLwc {
  @api upperFooterMode = "Integration Procedure";
  @api upperFooterNavigationDevName;
  @api upperFooterIpName;
  @api upperFooterInputJSON;
  @api upperFooterOptionsJSONN;
  @api upperFooterClassName;

  @api mode = "Integration Procedure";
  @api navigationDevName;
  @api ipName;
  @api inputJSON;
  @api optionsJSON;
  @api statement;
  @api linkedInUrl;
  @api twitterXUrl;
  @api facebookUrl;
  @api copyrightMention;
  @api builtMention;
  @api lowerFooterClassName;

  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }
  /* computed */

  get computedClassName() {
    return {
      "nsw-footer": true,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }

  get computedShowUpperFooter() {
    return this.upperMode !== "Hide";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
