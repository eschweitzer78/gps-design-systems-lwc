import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api links; //: Array,
  @api copyright; //: String

  /* computed */

  get _links() {
    let index = 1;

    return isArray(this.links)
      ? this.links.map((item) => ({
          ...item,
          key: `link-${index++}`
        }))
      : [];
  }
}
