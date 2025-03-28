import { api, LightningElement } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api disabled = false;
  @api options = {};
}
