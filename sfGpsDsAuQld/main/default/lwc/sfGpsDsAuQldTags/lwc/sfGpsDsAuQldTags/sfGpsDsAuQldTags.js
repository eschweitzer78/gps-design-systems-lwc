/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const TAG_PREFIX = "sf-gps-ds-au-qld-tag";

const SIZE_DEFAULT = "default";
const SIZE_LARGE = "large";
const SIZE_VALUES = [SIZE_DEFAULT, SIZE_LARGE];

const MODE_DEFAULT = "default";
const MODE_ACTION = "action";
const MODE_INFO = "info";
const MODE_FILTER = "filter";
const MODE_VALUES = [MODE_ACTION, MODE_DEFAULT, MODE_FILTER, MODE_INFO];

const I18N = {
  clearFilters: "Clear filters"
};

export default class extends LightningElement {
  _mode;
  _modeOriginal;

  @api get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });

    this.updateTags();
  }

  get asFilter() {
    return this._mode === MODE_FILTER;
  }

  get asAction() {
    return this._mode === MODE_ACTION;
  }

  get asInfo() {
    return this._mode === MODE_INFO;
  }

  get asDefault() {
    return (this._mode || MODE_DEFAULT) === MODE_DEFAULT;
  }

  /* api: size */

  _sizeOriginal;
  _size = false;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT
    });

    this.updateTags();
  }

  /* api: tags */

  @track _tags;
  _tagsOriginal;

  @api
  get tags() {
    return this._tagsOriginal;
  }

  set tags(value) {
    this._tagsOriginal = value;
    this.updateTags();
  }

  @api className;

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return computeClass({
      "qld__tag-list": true,
      [this.className]: this.className
    });
  }

  get computedHasOpenFilterItems() {
    return this.asFilter && (this._tags || []).some((tag) => !tag.closed);
  }

  /* methods */

  updateTags() {
    this._tags =
      this._tagsOriginal && Array.isArray(this._tagsOriginal)
        ? this._tagsOriginal.map((tag, index) => {
            const isString = typeof tag === "string";
            const text = isString ? tag : tag.text;
            const url = isString ? null : tag.url;
            const closed = isString ? false : tag.closed;

            return {
              text,
              url,
              closed,
              key: `${TAG_PREFIX}-${index}`,
              closeHint: "Remove " + text,
              className: computeClass({
                qld__tag: true,
                "qld__tag--large": this._size === SIZE_LARGE,
                "qld__tag--info": this.asInfo || (this.asDefault && !url),
                "qld__tag--filter": this.asFilter,
                [tag.className]: tag.className
              })
            };
          })
        : null;
  }

  /* event management */

  handleClick(event) {
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

    this.dispatchEvent(
      new CustomEvent("clear", {
        detail: {
          index: targetIndex,
          closed: !tag.closed
        }
      })
    );
  }

  handleClearFilters() {
    this.dispatchEvent(new CustomEvent("clearall"));
  }
}
