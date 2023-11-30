/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuNswFooterComm extends SfGpsDsLwc {
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
  @api cstyle = "default";
  @api lowerFooterClassName;

  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-footer": true,
      "nsw-footer--dark": this.cstyle === "dark",
      "nsw-footer--light": this.cstyle === "light",
      "nsw-footer--custom": this.cstyle === "custom",
      [this.className]: this.className
    });
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
