import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { NavigationMixin } from "lightning/navigation";

/**
 * @slot UserAction
 */
export default class extends NavigationMixin(SfGpsDsNavigation) {
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

  @api
  get navigationDevName() {
    return super.navigationDevName;
  }

  set navigationDevName(value) {
    super.navigationDevName = value;
  }

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

  /* api: primaryLogo */

  _primaryLogoOriginal;
  _primaryLogo;

  @api get primaryLogo() {
    return this._primaryLogoOriginal;
  }

  set primaryLogo(value) {
    this._primaryLogoOriginal = value;

    try {
      value = JSON.parse(value);
    } catch (e) {
      this.addError("PL-JP", "Primary logo must be a valid JSON.");
      return;
    }

    if ("object" !== typeof value) {
      this._primaryLogo = null;
      this.addError("PL-JO", "Primary logo must be a valid JSON object.");
      return;
    }

    this._primaryLogo = { ...value };
  }

  /* api: primaryLogo */

  _secondaryLogoOriginal;
  _secondaryLogo;

  @api get secondaryLogo() {
    return this._secondaryLogoOriginal;
  }

  set secondaryLogo(value) {
    this._secondaryLogoOriginal = value;

    try {
      value = JSON.parse(value);
    } catch (e) {
      this.addError("SL-JP", "Secondary logo must be a valid JSON.");
      return;
    }

    if ("object" !== typeof value) {
      this._secondaryLogo = null;
      this.addError("SL-JO", "Secondary logo must be a valid JSON object.");
      return;
    }

    this._secondaryLogo = { ...value };
  }

  @api showSearch;
  @api showQuickExit;
  @api className;

  get decoratedItems() {
    return this.decoratedItemsMapper(this._items, "menu-");
  }

  decoratedItemsMapper(items, parentIndex) {
    /* Transform exp cloud nav format into what's expected by Rpl Primary Nav */
    return (items || []).map((item, index) => {
      let rv = {
        ...item,
        id: item.index || `${parentIndex}-${index + 1}`
      };

      if (item.subNav) {
        rv.items = this.decoratedItemsMapper(item.subNav, item.id);
      }

      return rv;
    });
  }

  /* event management */

  handleSearch(event) {
    event.stopPropagation();

    // Navigate to search page using lightning/navigation API:
    // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation

    this[NavigationMixin.Navigate]({
      type: "standard__search",
      attributes: {},
      state: {
        term: event.detail.value
      }
    });
  }

  /* event management */

  handleNavigate(event) {
    event.stopPropagation();

    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail.itemId]);
    }
  }
}
