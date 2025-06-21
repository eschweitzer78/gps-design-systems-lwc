/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswSideNavComm";

export default 
class sfGpsDsAuNswSideNavComm
extends SfGpsDsNavigation {
  // @ts-ignore
  @api 
  className?: string;

  /* api: mode, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get mode() {
    // @ts-ignore
    return super.mode;
  }

  set mode(value) {
    // @ts-ignore
    super.mode = value;
  }

  /* api: navigationDevName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get navigationDevName() {
    // @ts-ignore
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    // @ts-ignore
    super.navigationDevName = value;
  }

  /* api: ipName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName() {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value) {
    // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON() {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON() {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  // @ts-ignore
  @api
  titleLink?: string;
  _titleLink = this.defineMarkdownFirstLinkProperty("titleLink", {
    errorCode: "HL-MD",
    errorText: "Issue when parsing Title Link markdown"
  });

  get _title(): string | undefined {
    return this._titleLink.value?.text;
  }

  get _url(): string | undefined {
    return this._titleLink.value?.url;
  }

  get navSvc(): SfGpsDsNavigationService {
    return this.refs.navsvc as unknown as SfGpsDsNavigationService;
  }

  /* event management */

  handleNavigate(
    event: CustomEvent
  ): any {
    if (this._map && event.detail) {
      this.navSvc.navigateNavMenu(this._map[event.detail]);
    }
  }
  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
