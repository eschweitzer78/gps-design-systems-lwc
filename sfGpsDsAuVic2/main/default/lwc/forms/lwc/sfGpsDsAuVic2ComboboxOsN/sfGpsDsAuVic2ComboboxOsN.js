/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsAuVic2RplDropdownOsN from "c/sfGpsDsAuVic2RplDropdownOsN";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";
import { normaliseBoolean } from "c/sfGpsDsHelpersOs";

const SEARCHABLE_DEFAULT = false;
const SEARCHABLE = Symbol("searchable");

export default class extends SfGpsDsOmniInputMixinOsN(
  SfGpsDsAuVic2RplDropdownOsN
) {
  @api
  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
  }

  _searchableOriginal;
  _searchable = SEARCHABLE_DEFAULT;

  @api
  get searchable() {
    return this._searchableOriginal;
  }

  set searchable(value) {
    this._searchableOriginal = value;
    const searchable = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SEARCHABLE_DEFAULT
    });

    super.mode = searchable ? "filter-auto" : "lookup";
    this[SEARCHABLE] = searchable;
  }

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = this[SEARCHABLE] ? "filter-auto" : "lookup";
  }

  /* lifecycle */

  connectedCallback() {
    super.mode = this[SEARCHABLE] ? "filter-auto" : "lookup";
  }
}
