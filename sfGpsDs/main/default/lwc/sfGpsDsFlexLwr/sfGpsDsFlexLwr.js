import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Content1
 * @slot Content2
 * @slot Content3
 * @slot Content4
 * @slot Content5
 * @slot Content6
 * @slot Content7
 * @slot Content8
 * @slot Content9
 * @slot Content10
 */
export default class extends SfGpsDsLwc {
  @api nItems = 10;
  @api direction;
  @api wrap;
  @api alignItems;
  @api justifyContent;
  @api gap;
  @api className;

  get computedClassName() {
    return computeClass({
      "sfgpsds-flex--nogrow": !this.grow,
      [this.className]: this.className
    });
  }

  get computedFlexStyle() {
    return computeClass(
      {
        "display: flex": true,
        "flex-direction: row": this.direction === "row",
        "flex-direction: column": this.direction === "column",
        "flex-wrap: wrap": this.wrap === "wrap",
        "flex-wrap: nowrap": this.wrap === "nowrap",
        "align-items: center": this.alignItems === "center",
        "align-items: flex-end": this.alignItems === "flex-end",
        "align-items: flex-start": this.alignItems === "flex-start",
        "align-items: stretch": this.alignItems === "stretch",
        "align-items: baseline": this.alignItems === "baseline",
        "justify-content: center": this.justifyContent === "center",
        "justify-content: flex-start": this.justifyContent === "flex-start",
        "justify-content: flex-end": this.justifyContent === "flex-end",
        "justify-content: space-between":
          this.justifyContent === "space-between",
        "justify-content: space-around": this.justifyContent === "space-around",
        "justify-content: space-evenly": this.justifyContent === "space-evenly",
        [`gap: ${this.gap?.replaceAll(";", "")}`]: this.gap
      },
      ";"
    );
  }

  get has2() {
    return this.nItems >= 2;
  }

  get has3() {
    return this.nItems >= 3;
  }

  get has4() {
    return this.nItems >= 4;
  }

  get has5() {
    return this.nItems >= 5;
  }

  get has6() {
    return this.nItems >= 6;
  }

  get has7() {
    return this.nItems >= 7;
  }

  get has8() {
    return this.nItems >= 8;
  }

  get has9() {
    return this.nItems >= 9;
  }

  get has10() {
    return this.nItems >= 10;
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
  }
}
