/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { debounce } from "c/sfGpsDsHelpers";

const WINDOW_RESIZE = Symbol("_sfGpsDsOnWindowResize");

export default class {
  [WINDOW_RESIZE]?: {
    handler: EventListener
  };

  /* bind must be called in the connectedCallback method */
  bind(handler: EventListener) {
    this[WINDOW_RESIZE] = {
      handler: debounce((e: Event) => {
        handler(e);
      }, 250)
    };

    window.addEventListener("resize", this[WINDOW_RESIZE].handler, false);
  }

  /* unbind must be called in the disconnectedCallback method */
  unbind() {
    if (this[WINDOW_RESIZE]) {
      window.removeEventListener("resize", this[WINDOW_RESIZE].handler, false);

      delete this[WINDOW_RESIZE];
    }
  }
}
