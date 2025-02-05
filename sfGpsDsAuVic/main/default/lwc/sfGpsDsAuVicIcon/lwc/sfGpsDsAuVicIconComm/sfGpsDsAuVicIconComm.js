import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api symbol;
  @api color;
  @api size;
}
