import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVicFigure extends LightningElement {
  static renderMode = "light";

  @api image;
  @api caption;
  @api source;

  get showCaption() {
    return this.caption || this.source;
  }
}
