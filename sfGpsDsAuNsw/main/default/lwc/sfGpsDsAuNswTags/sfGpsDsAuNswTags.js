/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswTags extends LightningElement {
  @api asCheckboxes = false;

  @track _tags;
  _originalTags;

  @api
  get tags() {
    return this._originalTags;
  }

  set tags(value) {
    this._originalTags = value;
    this._tags = value.map((tag) => ({
      ...tag,
      key: `checkbox${tag.index}`,
      className: `${
        this.asCheckboxes ? "nsw-tag nsw-tag--checkbox" : "nsw-tag"
      } ${tag.className ? tag.className : ""}`
    }));
  }

  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-list": true,
      "nsw-list--8": true,
      [this.className]: this.className
    });
  }
}
