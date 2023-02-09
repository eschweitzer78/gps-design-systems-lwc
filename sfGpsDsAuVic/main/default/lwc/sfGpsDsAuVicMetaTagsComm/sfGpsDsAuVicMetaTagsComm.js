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

export default class SfGpsDsAuVicMetaTagsComm extends NavigationMixin(
  SfGpsDsLwc
) {
  @api theme;
  @api className;

  /*
   * links
   */

  _linksOriginal;
  @track _links;

  @api get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    this._linksOriginal = markdown;

    try {
      if (markdown) {
        this._links = mdEngine.extractLinks(markdown).map((item, index) => ({
          ...item,
          key: `tag-${index + 1}`
        }));
      } else {
        this._links = null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
    }
  }
}
