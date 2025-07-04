/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const FIRSTCHILD_DEFAULT = false;

/**
 * @slot Block
 */
export default class extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-block": true,
      [this.className || ""]: !!this.className
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
