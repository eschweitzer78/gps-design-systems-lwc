import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicDescriptionList extends LightningElement {
  @api list; // [{ term: string, description: string }]
  @api divider = ":";
  @api className;

  get showList() {
    return this.list && this.list.length > 0;
  }

  get _list() {
    return this.list && Array.isArray(this.list)
      ? this.list.map((item, index) => ({
          ...item,
          key: `item-${index + 1}`
        }))
      : null;
  }

  get computedClassName() {
    return computeClass({
      "rpl-description-list": true,
      [this.className]: this.className
    });
  }
}
