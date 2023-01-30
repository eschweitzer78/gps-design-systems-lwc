import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

import cBasePath from "@salesforce/community/basePath";
import { NavigationMixin } from "lightning/navigation";

export default class SfGpsDsNavigation extends NavigationMixin(SfGpsDsIpLwc) {
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

  _map = {};

  /**
   * 2023-01-30
   * We moved from SOQL-based data to ConnectApi-based due to slight but annoying changes in guest user
   * SOQL data access for NavigationMenuItem, even in not sharing mode that made some rows not accessible.
   *
   * Formats and data points differ quite a bit and we want to keep compatibility hence the re-mapping
   * on map[itemKey]
   */

  menuReducer(data, key, map, adaptedMap) {
    return data.reduce((m, item, index) => {
      let itemKey = `${key}-${index + 1}`;
      let amik = {
        text: item.label,
        url: item.actionValue,
        index: itemKey,
        position: index
      };

      let subNav = this.menuReducer(item.subMenu, itemKey, map, adaptedMap);
      if (subNav && subNav.length) {
        amik.subNav = subNav;
      }

      adaptedMap[itemKey] = amik;
      m.push(amik);

      map[itemKey] = {
        Type:
          item.actionType === "InternalLink" &&
          item.actionValue === null &&
          item.subMenu
            ? "MenuLabel"
            : item.actionType,
        TargetPrefs: item.target === "NewWindow" ? "OpenInExternalTab" : "None",
        Target:
          item.actionValue && item.actionType === "InternalLink"
            ? item.actionValue.replace(cBasePath, "")
            : item.actionValue,
        Label: item.label
      };

      return m;
    }, []);
  }

  mapIpData(data) {
    // soql: label, target, targetPrefs, type
    // connectApi: label, actionType, actionValue, target, subMenu
    let adaptedMap = {};
    let map = {};

    let rv = this.menuReducer(data, "menu", map, adaptedMap);
    this._map = map;
    return rv;
  }

  resolveUrl(item) {
    return item.Type === "MenuLabel" ? null : item.Target;
  }

  get isEmpty() {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  get isPreview() {
    return !document.URL.startsWith(cBasePath);
  }
}
