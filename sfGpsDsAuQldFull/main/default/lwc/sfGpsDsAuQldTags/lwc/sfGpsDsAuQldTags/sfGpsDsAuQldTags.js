/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseString, isArray, isString } from "c/sfGpsDsHelpers";

const TAG_PREFIX = "sf-gps-ds-au-qld-tag";

const SIZE_DEFAULT = "default";
const SIZE_VALUES = {
  default: "",
  large: "qld__tag--large"
};

const MODE_DEFAULT = "default";
const MODE_ACTION = "action";
const MODE_INFO = "info";
const MODE_FILTER = "filter";
const MODE_VALUES = [MODE_ACTION, MODE_DEFAULT, MODE_FILTER, MODE_INFO];

const I18N = {
  clearFilters: "Clear filters"
};

export default class extends LightningElement {
  @api className;

  /* api: mode */

  _mode = MODE_DEFAULT;
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
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

  /* api: size */

  _size = SIZE_VALUES[SIZE_DEFAULT];
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT,
      returnObjectValue: true
    });

    this.updateTags();
  }

  /* api: tags */

  _tags;
  _tagsOriginal;

  @api
  get tags() {
    return this._tagsOriginal;
  }

  set tags(value) {
    this._tagsOriginal = value;
    this.updateTags();
  }

  /* getters */

  get i18n() {
    return I18N;
  }

  get computedClassName() {
    return {
      "qld__tag-list": true,
      [this.className]: this.className
    };
  }

  get computedHasOpenFilterItems() {
    return this.asFilter && (this._tags || []).some((tag) => !tag.closed);
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

  /* methods */

  updateTags() {
    this._tags =
      this._tagsOriginal && isArray(this._tagsOriginal)
        ? this._tagsOriginal.map((tag, index) => {
            const tIsString = isString(tag);
            const text = tIsString ? tag : tag.text;
            const url = tIsString ? null : tag.url;
            const closed = tIsString ? false : tag.closed;

            return {
              text,
              url,
              closed,
              key: `${TAG_PREFIX}-${index}`,
              closeHint: "Remove " + text,
              className: {
                qld__tag: true,
                [this._size]: this._size,
                "qld__tag--info": this.asInfo || (this.asDefault && !url),
                "qld__tag--filter": this.asFilter,
                [tag.className]: tag.className
              }
            };
          })
        : null;
  }

  /* event management */

  handleClick(event) {
    const element = event?.target;

    if (element === null || this._tags === null) {
      return;
    }

    let index = parseInt(element.dataset.idx, 10);

    if (
      typeof index === "undefined" ||
      Number.isNaN(index) ||
      index < 0 ||
      index >= this._tags.length
    ) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("clear", {
        detail: {
          index,
          closed: !this._tags[index].closed
        }
      })
    );
  }

  handleClearFilters() {
    this.dispatchEvent(new CustomEvent("clearall"));
  }
}
