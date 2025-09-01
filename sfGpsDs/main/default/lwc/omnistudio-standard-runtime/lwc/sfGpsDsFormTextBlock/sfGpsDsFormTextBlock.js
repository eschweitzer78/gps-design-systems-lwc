/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptTextBlock from "c/sfGpsDsOsrtOmniscriptTextBlock";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpers";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsFormTextBlock.html";

const MERGE_QUERY_SELECTOR = ".sfGpsDsMerge";

export default class extends OmniscriptTextBlock {
  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    let element = this.template.querySelector(MERGE_QUERY_SELECTOR);

    if (element) {
      replaceInnerHtml(
        element,
        omniGetMergedField(this, this.jsonDef.propSetMap.text)
      );
    }
  }
}
