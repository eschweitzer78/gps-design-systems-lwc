import { LightningElement, api } from "lwc";

export default class Layout extends LightningElement {
  @api horizontalAlign;
  @api verticalAlign;
  @api pullToBoundary;
  @api extraclass;
  @api theme = "slds";
  @api multipleRows;
  isRendered = false;
  keyCounter = 0;

  renderedCallback() {
    if (!this.isRendered) {
      let elements = this.querySelectorAll("*");
      elements.forEach((elem) => {
        if (elem.tagName.toLowerCase().includes("layout-item")) {
          this.gridItemClass(elem);
        }
      });
      this.isRendered = true;
    }
  }

  uniqueKey() {
    return Date.now() + "-" + Math.random();
  }

  get gridClass() {
    let gridCls = `${this.theme}-grid`;
    if (this.multipleRows === "true" || this.multipleRows === true) {
      gridCls += ` ${this.theme}-wrap`;
    }
    if (this.horizontalAlign) {
      gridCls += `${this.theme}-grid_align-${this.horizontalAlign}`;
    }
    if (this.verticalAlign) {
      gridCls += `${this.theme}-grid_vertical-align-${this.verticalAlign}`;
    }
    if (this.pullToBoundary) {
      gridCls += `${this.theme}-grid_pull-padded${
        this.pullToBoundary === "small" ? "" : `-${this.pullToBoundary}`
      }`;
    }

    if (this.extraclass) {
      gridCls += " " + this.extraclass;
    }
    return gridCls;
  }

  gridItemClass(elem) {
    elem.classList.add(`${this.theme}-col`);
    if (elem.size) {
      elem.classList.add(
        `${this.theme}-size_${elem.size ? parseInt(elem.size, 10) : 1}-of-12`
      );
    }
    if (elem.smallDeviceSize) {
      elem.classList.add(
        `${this.theme}-small-size_${
          elem.smallDeviceSize ? parseInt(elem.smallDeviceSize, 10) : 1
        }-of-12`
      );
    }
    if (elem.mediumDeviceSize) {
      elem.classList.add(
        `${this.theme}-medium-size_${
          elem.mediumDeviceSize ? parseInt(elem.mediumDeviceSize, 10) : 1
        }-of-12`
      );
    }
    if (elem.largeDeviceSize) {
      elem.classList.add(
        `${this.theme}-large-size_${
          elem.largeDeviceSize ? parseInt(elem.largeDeviceSize, 10) : 1
        }-of-12`
      );
    }
    if (elem.padding) {
      elem.classList.add(`${this.theme}-p-${elem.padding.replace("-", "_")}`);
    }
    if (elem.alignmentBump) {
      elem.classList.add(`${this.theme}-col_bump-${elem.alignmentBump}`);
    }

    if (elem.flexibility) {
      let items = elem.flexibility.split(",");
      items.forEach((item) => {
        switch (item) {
          case "shrink":
            elem.classList.add(`${this.theme}-shrink`);
            break;
          case "no-shrink":
            elem.classList.add(`${this.theme}-shrink-none`);
            break;
          case "grow":
            elem.classList.add(`${this.theme}-grow`);
            break;
          case "no-grow":
            elem.classList.add(`${this.theme}-grow-none`);
            break;
          case "no-flex":
            elem.classList.add(`${this.theme}-no-flex`);
            break;
          default:
        }
      });
      elem.classList.add(`${this.theme}-col_bump-${elem.alignmentBump}`);
    }
  }
}
