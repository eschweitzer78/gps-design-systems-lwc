/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT = [];

export default class extends NavigationMixin(SfGpsDsLwc) {
  @api theme;
  @api className;

  /* api: links */

  _linksOriginal = LINKS_DEFAULT;
  _links = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      if (markdown) {
        this._linksOriginal = markdown;
        this._links = markdown
          ? mdEngine.extractLinks(markdown).map((item, index) => ({
              ...item,
              key: `tag-${index + 1}`
            }))
          : null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = LINKS_DEFAULT;
    }
  }
}
