/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDisclosure from "c/sfGpsDsFormDisclosure";
import tmpl from "./sfGpsDsAuNswFormDisclosure.html";

export default class extends SfGpsDsFormDisclosure {
  /* lifecycle */

  render() {
    return tmpl;
  }
}
