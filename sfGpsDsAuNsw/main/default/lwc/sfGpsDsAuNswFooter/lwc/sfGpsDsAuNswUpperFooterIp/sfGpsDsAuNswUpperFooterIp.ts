import { 
  api 
} from "lwc";
import demoFooter from "./demoFooter";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

export default 
class SfGpsDsAuNswUpperFooterIp
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

  // @ts-ignore
  set mode(value) {
    // @ts-ignore
    super.mode = value;

    if (value === "Demo") {
      this._items = this.mapIpData(demoFooter);
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

  /* event management */

  handleNavClick(
    event: CustomEvent
  ): void {
    if (this._map && event.detail) {
      (this.refs.navsvc as unknown as SfGpsDsNavigationService).navigateNavMenu(this._map[event.detail]);
    }
  }
}
