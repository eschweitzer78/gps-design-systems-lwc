import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicLinksAndCopyright extends SfGpsDsLwc {
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
