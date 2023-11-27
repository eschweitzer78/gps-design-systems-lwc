/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsUkGovFooterComm extends SfGpsDsLwc {
  @api upperFooterIpName;
  @api upperFooterInputJSON;
  @api upperFooterOptionsJSONN;
  @api upperFooterClassName;

  @api ipName;
  @api inputJSON;
  @api optionsJSON;
  @api licenceMention;
  @api copyrightMention;
  @api builtMention;
  @api lowerFooterClassName;

  @api className;

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "govuk-footer": true,
      [this.className]: this.className
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
  }
}
