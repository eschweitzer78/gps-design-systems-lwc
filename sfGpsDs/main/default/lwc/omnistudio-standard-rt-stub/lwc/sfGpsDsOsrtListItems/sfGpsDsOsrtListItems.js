import { LightningElement, api } from "lwc";
import sldsTemplate from "./listItems_slds.html";
import ndsTemplate from "./listItems_nds.html";

export default class ListItem extends LightningElement {
  @api records = [];
  @api theme;

  render() {
    if (this.theme === "nds") return ndsTemplate;
    return sldsTemplate;
  }
}
