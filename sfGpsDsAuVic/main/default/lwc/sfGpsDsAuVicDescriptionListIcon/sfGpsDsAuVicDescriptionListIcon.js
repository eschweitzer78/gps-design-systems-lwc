import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicDescriptionListIcon extends LightningElement {
  static renderMode = "light";

  @api list; // [{ icon: string, heading: string, content: string }]  content is html markup
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
      "rpl-description-list-icon": true,
      [this.className]: this.className
    });
  }
}
