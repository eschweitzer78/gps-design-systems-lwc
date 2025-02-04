/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { isArray, uniqueId, normaliseBoolean } from "c/sfGpsDsHelpers";

const TAG_PREFIX = "sf-gps-ds-au-nsw-tag";
const DEFAULT_TAGS = [];

const ASCHECKBOXES_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: asCheckboxes */

  _asCheckboxesOriginal = ASCHECKBOXES_DEFAULT;
  _asCheckboxes = ASCHECKBOXES_DEFAULT;

  @api
  get asCheckboxes() {
    return this._asCheckboxesOriginal;
  }

  set asCheckboxes(value) {
    this._asCheckboxesOriginal = value;
    this._asCheckboxes = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ASCHECKBOXES_DEFAULT
    });

    this.updateTags();
  }

  /* api: tags */

  _tags = DEFAULT_TAGS;
  _tagsOriginal = DEFAULT_TAGS;

  @api
  get tags() {
    return this._tagsOriginal;
  }

  set tags(value) {
    this._tagsOriginal = value;
    this.updateTags();
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-list": true,
      "nsw-list--8": true,
      [this.className]: this.className
    };
  }

  _idBase;

  get idBase() {
    if (this._idBase == null) {
      this._idBase = uniqueId(TAG_PREFIX);
    }

    return this._idBase;
  }

  /* methods */

  updateTags() {
    this._tags = isArray(this._tagsOriginal)
      ? this._tagsOriginal.map((tag, index) => ({
          ...tag,
          key: `${this.idBase}-${index}`,
          checked: tag.checked || false,
          className: {
            "nsw-tag": true,
            "nsw-tag--checkbox": this._asCheckboxes,
            [tag.className]: tag.className
          }
        }))
      : DEFAULT_TAGS;
  }

  /* event management */

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
}
