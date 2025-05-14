import { api, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2VerticalNavComm";

export default class SfGpsDsAuVic2VerticalNavComm extends SfGpsDsNavigation {
  @api title;
  @api className;

  /* wire: handlePageReference */

  _pageReference;

  @wire(CurrentPageReference) handlePageReference(pageReference) {
    /* This is called when we navigate off the current page... */

    if (this._pageReference && this._pageReference !== pageReference) {
      /* update menu */
      this._items = [...this._items];
    }

    this._pageReference = pageReference;
  }

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
          subMenu: [
            {
              actionType: "InternalLink",
              actionValue: cbp + "/get-involved/register",
              imageUrl: null,
              label: "Register",
              target: "CurrentWindow"
            },
            {
              actionType: "InternalLink",
              actionValue: cbp + "/get-involved/attend",
              imageUrl: null,
              label: "Attend",
              target: "CurrentWindow"
            }
          ],
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

  get _adaptedItems() {
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return (this._items || []).map((item) => this.adaptItem(item, pathname));
  }

  adaptItem(item, pathname) {
    const isCurrentPage =
      item.url === pathname ||
      (item.url && pathname.startsWith(item.url + "/"));

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> adaptItem",
        JSON.stringify(item),
        pathname,
        isCurrentPage
      );

    const subItems = (item.subNav || []).map((subitem) =>
      this.adaptItem(subitem, pathname)
    );

    let rv = {
      ...item,
      id: item.index,
      active:
        item.active ||
        isCurrentPage ||
        subItems.some((subitem) => subitem.active),
      items: subItems
    };

    if (rv.subNav) delete rv.subNav;
    if (DEBUG) console.log(CLASS_NAME, "< adaptItem", JSON.stringify(rv));

    return rv;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }

  /* event management */

  handleNavigate(event) {
    if (this._map && event.detail) {
      this.refs.navsvc.navigateNavMenu(this._map[event.detail]);
    }
  }
}
