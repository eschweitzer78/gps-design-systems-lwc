import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVicCol extends LightningElement {
  static renderMode = "light";

  @api cols = "full";
  @api colsBp;
  @api pull;
  @api push;

  get computedColClassName() {
    let colClass = "rpl-col";
    colClass += ` rpl-col--${this.cols}`;

    // eslint-disable-next-line guard-for-in
    for (let item in this.colsBp) {
      colClass += ` rpl-col--${this.colsBp[item]}-${item}`;
    }

    // eslint-disable-next-line guard-for-in
    for (let item in this.pull) {
      colClass += ` rpl-col--pull-${this.pull[item]}-${item}`;
    }

    // eslint-disable-next-line guard-for-in
    for (let item in this.push) {
      colClass += ` rpl-col--push-${this.push[item]}-${item}`;
    }

    return colClass;
  }
}
