/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuQldMainNavComm";

export default class extends SfGpsDsNavigation {
  @api megaMenu = false;
  @api descLevel;
  @api cstyle;
  @api preHeaderStyle;
  @api isActive = false;
  @api mainNavId = "mainmenu";
  @api ctaOneIcon;
  @api ctaTwoIcon;
  @api authMode;
  @api profileIcon;
  @api className = "";

  /* api: mode */

  @api
  get mode() {
    return super.mode;
  }

  set mode(value) {
    super.mode = value;

    if (value === "Demo") {
      let cbp = this.communityBasePath;

      this._items = this.mapIpData([
        {
          actionType: "InternalLink",
          actionValue: cbp + "/get-involved",
          imageUrl: null,
          label: "Get involved",
          subMenu: [],
          target: "CurrentWindow"
        },
        {
          actionType: "InternalLink",
          actionValue: cbp + "/stories",
          imageUrl: null,
          label: "Stories",
          subMenu: [],
          target: "CurrentWindow"
        }
      ]);
    }
  }

  /* api: navigationDevName */

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

  /* api: ipName */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: ctaOneLink */

  _ctaOneLink;
  _ctaOneLinkOriginal;

  @api
  get ctaOneLink() {
    return this._ctaOneLinkOriginal;
  }

  set ctaOneLink(markdown) {
    try {
      this._ctaOneLinkOriginal = markdown;
      this._ctaOneLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-CO", "Issue when parsing CTA One Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set ctaOneLink", e);
    }
  }

  /* api: ctaTwoLink */

  _ctaTwoLink;
  _ctaTwoLinkOriginal;

  @api
  get ctaTwoLink() {
    return this._ctaTwoLinkOriginal;
  }

  set ctaTwoLink(markdown) {
    try {
      this._ctaTwoLinkOriginal = markdown;
      this._ctaTwoLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-CT", "Issue when parsing CTA Two Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set ctaTwoLink", e);
    }
  }

  /* api: profileLink */

  _profileLink;
  _profileLinkOriginal;

  @api
  get profileLink() {
    return this._profileLinkOriginal;
  }

  set profileLink(markdown) {
    try {
      this._profileLinkOriginal = markdown;
      this._profileLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-CO", "Issue when parsing Profile Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set profileLink", e);
    }
  }

  /* event management */

  handleCloseMenu() {
    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleNavigate(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
