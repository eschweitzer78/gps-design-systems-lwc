/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

import isGuest from "@salesforce/user/isGuest";
import cBasePath from "@salesforce/community/basePath";

export default class SfGpsDsAuNswMainNavComm extends SfGpsDsIpLwc {
  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  //

  @api megaMenu = false;
  @api className;
  @api isActive = false;

  //

  _map = {};

  mapIpData(data) {
    // remove draft entries in published, and live in exp builder
    // remove non guest entries if guest
    let isP = this.isPreview;
    data = data.filter(
      (item) =>
        item.Status === (isP ? "Draft" : "Live") &&
        (item.AccessRestriction === "None" || !isGuest)
    );

    // create a map by Id
    let adaptedMap = {};
    this._map = data.reduce((m, item) => {
      m[item.Id] = item;
      adaptedMap[item.Id] = {
        text: item.Label,
        url: item.Type === "MenuLabel" ? null : "#menu-" + item.Id,
        index: item.Id,
        position: item.Position,
      };

      return m;
    }, {});

    let rootItems = [];
    // decorate with children array
    data.forEach((item) => {
      if (item.ParentId) {
        let parent = adaptedMap[item.ParentId];
        (parent.subNav || (parent.subNav = [])).push(adaptedMap[item.Id]);
      } else {
        rootItems.push(adaptedMap[item.Id]);
      }
    });

    // sort subNav by position
    data.forEach((item) => {
      let subNav = adaptedMap[item.Id].subNav;
      if (subNav) {
        subNav.sort((a, b) => (a.position > b.position ? 1 : -1));
      }
    });

    // sort rootItems by position
    return rootItems.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  get isPreview() {
    return !document.URL.startsWith(cBasePath);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  // Events

  handleCloseMenu() {
    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleNavigate(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation");

    if (nav && this._map && event.detail) {
      nav.navigateNavMenu(this._map[event.detail]);
    }
  }
}
