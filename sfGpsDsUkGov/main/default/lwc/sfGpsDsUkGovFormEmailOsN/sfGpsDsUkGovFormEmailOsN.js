/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsFormEmailOsN from "c/sfGpsDsFormEmailOsN";
import tmpl from "./sfGpsDsUkGovFormEmailOsN.html";

const DEBUG = false;

export default class SfGpsDsUkGovFormEmailOsN extends SfGpsDsFormEmailOsN {
  render() {
    return tmpl;
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector("[data-omni-input]");

    if (elt) {
      if (elt.getErrorDetails) {
        return elt.getErrorDetails();
      }

      if (DEBUG) console.log("child does not have getErrorDetails api");
    }

    if (DEBUG) console.log("child not found");
    return null;
  }

  @api scrollTo() {
    const input = this.template.querySelector("[data-omni-input]");
    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }
}
