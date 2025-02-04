import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api hideMainFooter = false;
  @api lfMode;
  @api lfNavigationDevName;
  @api ipName;
  @api lfInputJSON;
  @api lfOptionsJSON;
  @api lfClassName;

  handleNavigate(event) {
    if (event.detail) {
      this.refs.navsvc.navigateNavMenu(event.detail);
    }
  }
}
