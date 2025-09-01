import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./propertyPanel_slds.html";

export default class VlocityPropertyPanel extends LightningElement {
  render() {
    return sldsTemplate;
  }

  @api
  closePropertyPanel() {
    return;
  }

  @api
  openPropertyPanel() {
    return;
  }
}
