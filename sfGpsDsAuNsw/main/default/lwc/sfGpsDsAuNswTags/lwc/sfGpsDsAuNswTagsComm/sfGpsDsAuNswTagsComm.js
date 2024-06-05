/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswTagsComm extends NavigationMixin(SfGpsDsLwc) {
  @api asCheckboxes = false;
  @api className;

  /*
   * links
   */

  @track _links;
  _originalLinks;

  @api get links() {
    return this._originalLinks;
  }

  set links(markdown) {
    this._originalLinks = markdown;

    try {
      if (markdown) {
        this._links = mdEngine.extractLinks(markdown);
      } else {
        this._links = null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
    }
  }

  handleChange(event) {
    let links = [...this._links];
    links[event.detail.index].checked = event.detail.checked;

    this._links = links;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
