/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";
export default class SfGpsDsCaOnLabel extends SfGpsDsLwc {
  static renderMode = "light";
  // @ts-ignore
  @api
  label;
  // @ts-ignore
  @api
  forId;
  // @ts-ignore
  @api
  required;
  // @ts-ignore
  @api
  optional;
  // @ts-ignore
  @api
  large;
  // @ts-ignore
  @api
  heading;
  // @ts-ignore
  @api
  className;
  get computedClassName() {
    let classes = "ontario-label";
    if (this.large) classes += " ontario-label--large";
    if (this.heading) classes += " ontario-label--heading";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }
  get showFlag() {
    return this.required === true || this.optional === true;
  }
  get flagText() {
    if (this.required) return LABELS.Common.Required;
    if (this.optional) return LABELS.Common.Optional;
    return "";
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
