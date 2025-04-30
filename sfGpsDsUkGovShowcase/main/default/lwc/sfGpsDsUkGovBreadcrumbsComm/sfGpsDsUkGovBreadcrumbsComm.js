/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsUkGovBreadcrumbsComm extends SfGpsDsLwc {
  @api label = "Breadcrumb";
  @api linkComponent = "a";
  @api className = "";

  _items;
  @track _itemsArray = [];

  @api set items(markdown) {
    this._items = markdown;
    try {
      this._itemsArray = mdEngine.extractLinks(markdown);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get items() {
    return this._items;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
  }
}
