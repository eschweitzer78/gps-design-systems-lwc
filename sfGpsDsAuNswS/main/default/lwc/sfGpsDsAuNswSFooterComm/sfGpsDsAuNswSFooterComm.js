import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswSFooterComm extends LightningElement {
  @api hideMainFooter = false;
  @api ipName;
  @api lfInputJSON;
  @api lfOptionsJSON;
  @api lfClassName;

  handleNavigate(event) {
    let nav = this.template.querySelector("c-sf-gps-ds-navigation-service");

    if (nav && event.detail) {
      nav.navigateNavMenu(event.detail);
    }
  }
}
