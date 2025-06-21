import { 
  api 
} from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import type SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

export default 
class SfGpsDsAuNswHeaderProfileIp 
extends SfGpsDsNavigation {
  // @ts-ignore
  @api 
  isGuest?: boolean;

  // @ts-ignore
  @api 
  userAlias?: string;
  
  // @ts-ignore
  @api 
  className?: string;

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

  // @ts-ignore
  @api
  // @ts-ignore
  get navigationDevName() {
    // @ts-ignore
    return super.navigationDevName;
  }

  set navigationDevName(value: string) {
    // @ts-ignore
    super.navigationDevName = value;
    this.updateExperienceCloudNavigation();
  }

  /* getters */

  get navSvc(): SfGpsDsNavigationService {
    return this.refs.navsvc as unknown as SfGpsDsNavigationService;
  }

  /* event management  */

  handleNavigate(
    event: CustomEvent
  ): void {
    if (this._map && event.detail) {
      this.navSvc.navigateNavMenu(this._map[event.detail]);
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleLogin(
    _event: CustomEvent
  ): void {
    this.navSvc?.login();
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
