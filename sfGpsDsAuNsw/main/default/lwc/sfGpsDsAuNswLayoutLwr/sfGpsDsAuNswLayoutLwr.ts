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
} from "c/sfGpsDsAuNswLayoutLwr";

/**
 * @slot Main
 * @slot Sidebar
 */
export default 
class SfGpsDsAuNswLayoutLwr
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  mode?: Mode;

  // @ts-ignore
  @api 
  sidebarClassName?: string;

  // @ts-ignore
  @api 
  mainClassName?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedShowSidebarLeft(): boolean {
    return this.mode ? this.mode.startsWith("Sidebar Left") : false;
  }

  get computedShowSidebarRight(): boolean {
    return this.mode ? this.mode.startsWith("Sidebar Right") : false;
  }

  get computedClassName(): any {
    return {
      "nsw-layout": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedMainClassName(): any {
    return {
      "nsw-layout__main": true,
      [this.mainClassName || ""]: !!this.mainClassName
    };
  }

  get computedSidebarClassName(): any {
    const sidebar = this.mode ? this.mode.startsWith("Sidebar") : false;
    const desktop = this.mode ? this.mode.endsWith("Desktop") : false;

    return {
      "nsw-layout__sidebar": sidebar,
      "nsw-layout__sidebar--desktop": desktop,
      [this.sidebarClassName || ""]: !!this.sidebarClassName
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
