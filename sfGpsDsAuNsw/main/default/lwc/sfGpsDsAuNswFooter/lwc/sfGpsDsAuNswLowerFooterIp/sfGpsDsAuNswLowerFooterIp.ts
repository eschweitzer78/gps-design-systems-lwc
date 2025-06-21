/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

export default 
class SfGpsDsAuNswLowerFooterIp 
extends SfGpsDsNavigation {
  // @ts-ignore
  @api 
  statement?: string;

  // @ts-ignore
  @api 
  linkedInUrl?: string;

  // @ts-ignore
  @api 
  twitterXUrl?: string;

  // @ts-ignore
  @api 
  facebookUrl?: string;

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

    if (value === "Demo") {
      /* eslint-disable no-unused-vars */
      const cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/accessibility-statement",
          imageUrl: undefined,
          label: "Accessibility statement",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/copyright",
          imageUrl: undefined,
          label: "Copyright",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "ExternalLink",
          actionValue: "https://www.nsw.gov.au/nsw-government/disclaimer",
          imageUrl: undefined,
          label: "Disclaimer",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
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
  copyrightMention?: string;
  _copyrightMentionHtml = this.defineMarkdownUnpackedFirstPProperty("copyrightMention", {
    errorCode: "CM-MD",
    errorText: "Issue when parsing Copyright mention markdown"
  });

  // @ts-ignore
  @api
  builtMention?: string;
  _builtMentionHtml = this.defineMarkdownUnpackedFirstPProperty("builtMention", {
    errorCode: "CM-MD",
    errorText: "Issue when parsing Built mention markdown"
  })

  /* computed */

  get computedShowSocial(): boolean {
    return !!(this.linkedInUrl || this.twitterXUrl || this.facebookUrl);
  }

  /* event management */

  handleNavClick(
    event: CustomEvent
  ): void {
    if (this._map && event.detail) {
      (this.refs.navsvc as unknown as SfGpsDsNavigationService).navigateNavMenu(this._map[event.detail]);
    }
  }

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback?.();
    
    if (
      this.refs.copyright &&
      this.copyrightMention
    ) {
      replaceInnerHtml(this.refs.copyright, this._copyrightMentionHtml.value);
    }

    if (
      this.refs.built &&
      this.builtMention
    ) {
      replaceInnerHtml(this.refs.built, this._builtMentionHtml.value);
    }
  }
}
