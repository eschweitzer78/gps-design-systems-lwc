import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api list; // [{ icon: string, heading: string, content: string }]  content is html markup
  @api className;

  /* computed */

  get computedShowList() {
    return this.list?.length > 0;
  }

  get decoratedList() {
    return isArray(this.list)
      ? this.list.map((item, index) => ({
          ...item,
          key: `item-${index + 1}`
        }))
      : null;
  }

  get computedClassName() {
    return {
      "rpl-description-list-icon": true,
      [this.className]: this.className
    };
  }
}
