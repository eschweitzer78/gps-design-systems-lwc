import { 
  api 
} from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { 
  safeEqualsIgnoreCase, 
  toArray
} from "c/sfGpsDsHelpers";
import getNavigationItems, { 
  ConnectApiNavigationMenuItem, 
  GetNavigationItemsResp
} from "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2";

import cBasePath from "@salesforce/community/basePath";
import { 
  NavigationMixin 
} from "lightning/navigation";
import mdEngine from "c/sfGpsDsMarkdown";

import type {
  NavigationMode,
  NavigationMenuItem,
  NavigationMenuItemMap,
  AdaptedNavigationMenuItem
} from "c/sfGpsDsNavigation";

const MODE_IP = "Integration Procedure";
const MODE_NAV = "Experience Cloud Navigation";

export default 
class SfGpsDsNavigation
extends NavigationMixin<SfGpsDsIpLwc>(SfGpsDsIpLwc) {
  /* api: mode */

  _mode: NavigationMode = MODE_IP;

  // @ts-ignore
  @api
  get mode() {
    return this._mode;
  }

  set mode(value) {
    this._mode = value;
    if (safeEqualsIgnoreCase(value, MODE_IP)) {
      // @ts-ignore
      super.ipActive = true;
    } else {
      // @ts-ignore
      super.ipActive = false;
      this.updateExperienceCloudNavigation();
    }
  }

  /* api: ipName */

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

  /* api: inputJSON */

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

  /* api: optionsJSON */

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

  /* api: navigationDevName */

  _navigationDevName?: string;

  // @ts-ignore
  @api
  get navigationDevName() {
    return this._navigationDevName;
  }

  set navigationDevName(value: string | undefined) {
    this._navigationDevName = value;
    this.updateExperienceCloudNavigation();
  }

  /* computed */

  get isEmpty(): boolean {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  /* methods */

  updateExperienceCloudNavigation(): void {
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
      .then((data: GetNavigationItemsResp) => {
        this._nLoading--;

        if (data.errorMessage) {
          this.addError(
            "EN-EM",
            `Issue getting the navigation: ${data.errorMessage}`
          );
          console.debug("EN-EM", data.errorMessage);
          this._items = [];
        } else {
          this._items = this.mapIpData(data.items);
        }
      })
      .catch((error) => {
        this._nLoading--;

        this.addError("EN-EX", "Issue getting the navigation: " + error.toString());
        console.debug("EN-EX", error.toString());
        this._items = [];
      });
  }

  _map: NavigationMenuItemMap = {};

  /**
   * 2023-01-30 ESC
   * We moved from SOQL-based data to ConnectApi-based due to slight but annoying changes in guest user
   * SOQL data access for NavigationMenuItem, even in not sharing mode that made some rows not accessible.
   *
   * Formats and data points differ quite a bit and we want to keep compatibility hence the re-mapping
   * on map[itemKey]
   */
  
  menuReducer(
    data: ConnectApiNavigationMenuItem[], 
    key: string, 
    map: NavigationMenuItemMap,
    adaptedMap: Record<string, AdaptedNavigationMenuItem>
  ): AdaptedNavigationMenuItem[] {
    if (data === null || data === undefined) {
      return [];
    }

    return data.reduce((m, item, index) => {
      let itemCopy = {...item}; delete itemCopy.subMenu;
      let itemKey = `${key}-${index + 1}`;
      let amik: AdaptedNavigationMenuItem = {
        item: itemCopy,
        text: item.label ? mdEngine.decodeEntities(item.label) : undefined,
        url: item.actionValue,
        index: itemKey,
        target: item.target,
        position: index
      };

      const subNav = this.menuReducer(
        item.subMenu || [], 
        itemKey, 
        map, 
        adaptedMap
      );

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
    }, ([] as AdaptedNavigationMenuItem[]));
  }

  mapIpData(
    data: ConnectApiNavigationMenuItem[] | ConnectApiNavigationMenuItem
  ): AdaptedNavigationMenuItem[] {
    const cdata: ConnectApiNavigationMenuItem[] = toArray<ConnectApiNavigationMenuItem>(data as any);
    // soql: label, target, targetPrefs, type
    // connectApi: label, actionType, actionValue, target, subMenu
    let adaptedMap = {};
    let map = {};

    const rv = this.menuReducer(cdata, "menu", map, adaptedMap);
    this._map = map;

    return rv;
  }

  resolveUrl(
    item: NavigationMenuItem
  ): string | undefined {
    return item.Type === "MenuLabel" 
      ? undefined 
      : item.Target;
  }
}
