import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api fullWidth;
  @api className;

  @track hasBehindSlot;
  @track hasUpperSlot;
  @track hasLowerSlot;
  @track hasAsideSlot;

  get computedClassName() {
    return computeClass({
      "rpl-header": true,
      [this.className]: this.className
    });
  }

  get computedMainClassName() {
    return computeClass({
      "rpl-header__main": true,
      "rpl-col-12": true,
      "rpl-col-8-m": !this.fullWidth && this.hasAsideSlot,
      "rpl-col-10-m": !this.fullWidth && !this.hasAsideSlot
    });
  }

  get computedBehindClassName() {
    return this.hasBehindSlot ? "rpl-header__behind rpl-u-screen-only" : null;
  }

  get computedUpperClassName() {
    return this.hasUpperSlot ? "rpl-header__upper" : null;
  }

  get computedLowerClassName() {
    return this.hasLowerSlot ? "rpl-header__lower" : null;
  }

  get computedAsideClassName() {
    return this.hasAsideSlot
      ? "rpl-header__aside rpl-col-12 rpl-col-4-m rpl-col-start-9-m"
      : null;
  }

  handleSlotChange(event) {
    switch (event.target.name) {
      case "behind":
        this.hasBehindSlot = true;
        break;

      case "upper":
        this.hasUpperSlot = true;
        break;

      case "lower":
        this.hasLowerSlot = true;
        break;

      case "aside":
        this.hasAsideSlot = true;
        break;

      default:
    }
  }
}
