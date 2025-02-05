/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptSaveForLaterAcknowledge from "omnistudio/omniscriptSaveForLaterAcknowledge";
import tmpl from "./sfGpsDsUkGovSaveForLaterAckOsN.html";

export default class extends OmniscriptSaveForLaterAcknowledge {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
