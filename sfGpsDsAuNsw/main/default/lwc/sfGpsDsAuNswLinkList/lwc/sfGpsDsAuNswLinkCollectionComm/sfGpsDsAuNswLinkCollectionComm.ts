/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import demoCollection from "./demoCollection";

import type { 
  NavigationMode 
} from "c/sfGpsDsNavigation";

export default 
class SfGpsDsAuNswLinkCollectionComm
extends SfGpsDsNavigation {
  // @ts-ignore
  @api 
  highlightExternal?: boolean;

  // @ts-ignore
  @api 
  firstChild?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;

  /* api: mode, Array of Object */;

  // @ts-ignore
  @api
  // @ts-ignore
  get mode(): NavigationMode {
    // @ts-ignore
    return super.mode;
  }

  set mode(value: NavigationMode) {
    // @ts-ignore
    super.mode = value;

    if (value === "Demo") {
      this._items = this.mapIpData(demoCollection);
    }
  }

  /* api: navigationDevName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get navigationDevName(): string {
    // @ts-ignore
    return super.navigationDevName;
  }

  set navigationDevName(value: string) {
    // @ts-ignore
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName(): string {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value: string) {
    // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON(): string {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value: string) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON(): string {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value: string) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
