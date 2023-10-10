/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass, uniqueId, normaliseBoolean } from "c/sfGpsDsHelpers";

const TAG_PREFIX = "sf-gps-ds-au-nsw-tag";

export default class SfGpsDsAuNswTags extends LightningElement {
  static renderMode = "light";

  _asCheckboxesOriginal;
  _asCheckboxes = false;

  @api
  get asCheckboxes() {
    return this._asCheckboxesOriginal;
  }

  set asCheckboxes(value) {
    this._asCheckboxesOriginal = value;
    this._asCheckboxes = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    this.updateTags();
  }

  @track _tags;
  _originalTags;

  @api
  get tags() {
    return this._originalTags;
  }

  set tags(value) {
    this._originalTags = value;
    this.updateTags();
  }

  updateTags() {
    this._tags =
      this._originalTags && Array.isArray(this._originalTags)
        ? this._originalTags.map((tag, index) => ({
            ...tag,
            key: `${this.idBase}-${index}`,
            checked: tag.checked || false,
            className: computeClass({
              "nsw-tag": true,
              "nsw-tag--checkbox": this._asCheckboxes,
              [tag.className]: tag.className
            })
          }))
        : null;
  }

  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-list": true,
      "nsw-list--8": true,
      [this.className]: this.className
    });
  }

  handleCheckboxClick(event) {
    event.preventDefault();
    event.stopPropagation();

    let element = event.target;

    if (element === null || this._tags === null) {
      return;
    }

    let targetIndex = parseInt(element.dataset.idx, 10);

    if (
      typeof targetIndex === "undefined" ||
      isNaN(targetIndex) ||
      targetIndex < 0 ||
      targetIndex >= this._tags.length
    ) {
      return;
    }

    let tag = this._tags[targetIndex];
    //tag.checked = !tag.checked;

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          index: targetIndex,
          checked: !tag.checked
        }
      })
    );
  }

  _idBase;

  get idBase() {
    if (this._idBase == null) {
      this._idBase = uniqueId(TAG_PREFIX);
    }

    return this._idBase;
  }
}
