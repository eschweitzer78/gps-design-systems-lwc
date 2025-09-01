/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptSaveForLaterAcknowledge from "c/sfGpsDsOsrtOmniscriptSaveForLaterAcknowledge";
import tmpl from "./sfGpsDsAuNswSaveForLaterAck.html";

export default class extends OmniscriptSaveForLaterAcknowledge {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
