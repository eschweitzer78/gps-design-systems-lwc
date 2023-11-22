import { api } from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { safeEqualsIgnoreCase } from "c/sfGpsDsHelpers";
import getNavigationItems from "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2";

import cBasePath from "@salesforce/community/basePath";
import { NavigationMixin } from "lightning/navigation";

const MODE_IP = "Integration Procedure";
const MODE_NAV = "Experience Cloud Navigation";

export default class SfGpsDsNavigation extends NavigationMixin(SfGpsDsIpLwc) {
  /* api: mode */

  _mode = MODE_IP;

  @api
  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
    if (safeEqualsIgnoreCase(value, MODE_IP)) {
      super.ipActive = true;
    } else {
      super.ipActive = false;
      this.updateExperienceCloudNavigation();
    }
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

  /* api: navigationDevName */

  _navigationDevName;

  @api
  get navigationDevName() {
    return this._navigationDevName;
  }

  set navigationDevName(value) {
    this._navigationDevName = value;
    this.updateExperienceCloudNavigation();
  }

  updateExperienceCloudNavigation() {
    if (!safeEqualsIgnoreCase(this._mode, MODE_NAV)) return;

    if (!this._navigationDevName) {
      this._items = [];
      return;
    }

    this._nLoading++;

    getNavigationItems({
      communityId: this.communityId,
      developerName: this._navigationDevName,
      communityPreview: this.isPreview
    })
      .then((data) => {
        this._nLoading--;

        if (data.errorMessage) {
          this.addError(
            "EN-EM",
            `Issue getting the navigation: ${data.errorMessage}`
          );
          console.log("EN-EM", data.errorMessage);
          this._items = [];
        } else {
          this._items = this.mapIpData(data.items);
        }
      })
      .catch((error) => {
        this._nLoading--;

        this.addError("EN-EX", "Issue getting the navigation.");
        console.log("EN-EX", error);
        this._items = [];
      });
  }

  _map = {};

  /**
   * 2023-01-30 ESC
   * We moved from SOQL-based data to ConnectApi-based due to slight but annoying changes in guest user
   * SOQL data access for NavigationMenuItem, even in not sharing mode that made some rows not accessible.
   *
   * Formats and data points differ quite a bit and we want to keep compatibility hence the re-mapping
   * on map[itemKey]
   */

  menuReducer(data, key, map, adaptedMap) {
    if (data === null || data === undefined) {
      return null;
    }

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
          (item.actionValue === null || item.actionValue === undefined) &&
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

    if (data && !Array.isArray(data)) {
      data = [data];
    }

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
