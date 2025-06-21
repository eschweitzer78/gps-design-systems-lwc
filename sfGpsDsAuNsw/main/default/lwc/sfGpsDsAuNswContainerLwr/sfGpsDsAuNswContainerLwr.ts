/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type {
  Mode
} from "c/sfGpsDsAuNswContainerLwr";

const MODE_VALUES = {
  default: "",
  flush: "nsw-container--flush"
};
const MODE_DEFAULT = "default";

/**
 * @slot Container
 */
export default 
class sfGpsDsAuNswContainerLwr
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  containerClassName?: string;

  // @ts-ignore
  @api
  mode?: string;
  _mode = this.defineEnumObjectProperty<string, Mode>("mode", {
    validValues: MODE_VALUES,
    defaultValue: MODE_DEFAULT
  });

  /* computed */

  get computedContainerClassName(): any {
    return {
      "nsw-container": true,
      [this._mode.value]: !!this._mode.value,
      [this.containerClassName || ""]: !!this.containerClassName
    };
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
