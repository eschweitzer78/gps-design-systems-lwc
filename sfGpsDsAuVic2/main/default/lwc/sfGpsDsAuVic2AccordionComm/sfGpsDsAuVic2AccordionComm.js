/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVic2AccordionComm extends SfGpsDsLwc {
  @api type;
  @api addClassName;

  /* api: content */

  _contentOriginal;
  computedH1s = [];

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      let h1s = mdEngine.extractH1s(markdown.replaceAll("\\n", "\n"));
      this.computedH1s = h1s.map((h1) => ({ ...h1, active: false }));
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* getter: numbered */

  get computedNumbered() {
    return this.type === "numbered";
  }
}
