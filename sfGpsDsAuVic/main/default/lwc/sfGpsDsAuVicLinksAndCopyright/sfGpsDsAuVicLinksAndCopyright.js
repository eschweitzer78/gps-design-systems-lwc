import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVicLinksAndCopyright extends LightningElement {
  static renderMode = "light";

  @api links; //: Array,
  @api copyright; //: String

  get _links() {
    let index = 1;

    return this.links
      ? this.links.map((item) => ({
          ...item,
          key: `link-${index++}`
        }))
      : [];
  }
}
