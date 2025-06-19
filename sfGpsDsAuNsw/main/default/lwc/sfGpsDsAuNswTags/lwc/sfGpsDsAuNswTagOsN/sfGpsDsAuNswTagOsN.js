/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
export default class SfGpsDsAuNswTagOsN extends SfGpsDsElement {
  // @ts-ignore
  @api
  url;
  // @ts-ignore
  @api
  text;
  // @ts-ignore
  @api
  tagClassName;
  // @ts-ignore
  @api
  className;
  /* computed */
  get computedClassName() {
    return {
      "nsw-list": true,
      "nsw-list-8": true,
      [this.className]: !!this.className
    };
  }
  get computedTagClassName() {
    return {
      "nsw-tag": true,
      [this.tagClassName]: !!this.tagClassName
    };
  }
}
