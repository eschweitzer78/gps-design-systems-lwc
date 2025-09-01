/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { isArray, isString, normaliseBoolean } from "c/sfGpsDsHelpers";
import SfGpsDsAuVic2RplDropdown from "c/sfGpsDsAuVic2RplDropdown";
import SfGpsDsOmniInputMixin from "c/sfGpsDsOmniInputMixin";

const OPTIONS_ORIGINAL = Symbol("_optionsOriginal");

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2Typeahead";

export default class extends SfGpsDsOmniInputMixin(SfGpsDsAuVic2RplDropdown) {
  /* api: remoteSource, which controls whether to show the progress bar / spinner */

  _remoteSource;
  _remoteSourceOriginal;

  @api
  get remoteSource() {
    return this._remoteSourceOriginal;
  }

  set remoteSource(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set remoteSource", value);

    this._remoteSourceOriginal = value;
    this._remoteSource = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< set remoteSource", this._remoteSource);
  }

  /* api: disableFilter */

  _disableFilter;
  _disableFilterOriginal;

  @api
  get disableFilter() {
    return this._disableFilterOriginal;
  }

  set disableFilter(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set disableFilter", value);

    this._disableFilterOriginal = value;
    this._disableFilter = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (DEBUG)
      console.debug(CLASS_NAME, "< set disableFilter", this._disableFilter);
  }

  /* api: options */

  @api
  get options() {
    return this[OPTIONS_ORIGINAL];
  }

  set options(value) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> set options", JSON.stringify(value));

    this[OPTIONS_ORIGINAL] = value;

    this.setOptions(
      isArray(value)
        ? value.map((item) => ({
            label: isString(item) ? item : item.name || "",
            value: isString(item) ? item : item.name || "",
            item: item.item
          }))
        : []
    );

    this._loading = false;

    if (DEBUG) console.debug(CLASS_NAME, "< set options");
  }

  @api
  get value() {
    if (DEBUG) console.debug(CLASS_NAME, "= get value", this._searchValue);

    return this._searchValue;
  }

  set value(value) {
    if (DEBUG) console.debug(CLASS_NAME, "= set value", value);
    super.value = value;
  }

  get _filtering() {
    return !this.disableFilter;
  }

  clearSearch() {
    super.clearSearch();

    this.dispatchEvent(
      new CustomEvent("clear", {
        bubbles: true,
        composed: true
      })
    );
  }

  dispatchChangeEvent() {
    if (DEBUG) console.debug(CLASS_NAME, "> dispatchChangeEvent");

    super.dispatchChangeEvent();

    const matches = this.getValueMatchingOptions(this._value);

    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: {
          name: this._value,
          item: matches.length ? matches[0].item : null
        }
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< dispatchChangeEvent");
  }

  selectLastItem() {
    if (DEBUG) console.debug(CLASS_NAME, "> selectLastItem");

    super.selectLastItem();

    this.dispatchPubSub(this._value);

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: {
          index: "last-item"
        }
      })
    );

    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: {
          index: "last-item"
        }
      })
    );

    if (DEBUG) console.debug(CLASS_NAME, "< selectLastItem");
  }

  handleSearchInput(event) {
    super.handleSearchInput(event);

    this._loading = this.remoteSource ? true : false;
  }

  handleOpen(fromKeyboard = false) {
    super.handleOpen(fromKeyboard);

    this.dispatchEvent(
      new CustomEvent("lookupfocus", {
        bubbles: true,
        composed: true
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    if (DEBUG) console.debug(CLASS_NAME, "> connectedCallback");

    this._connected = true;
    this.mode = "combobox-auto";
    this._showNoResults = false;
    this.preventDeselect = true;

    if (DEBUG) console.debug(CLASS_NAME, "< connectedCallback");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
  }
}
