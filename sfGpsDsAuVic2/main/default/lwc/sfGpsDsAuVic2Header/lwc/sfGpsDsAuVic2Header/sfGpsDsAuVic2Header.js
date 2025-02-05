import { LightningElement, api, track } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  /* api: fullWidth */

  _fullWidthOriginal;
  _fullWidth;

  @api
  get fullWidth() {
    return this._fullWidthOriginal;
  }

  set fullWidth(value) {
    this._fullWidthOriginal = value;
    this._fullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: limitContent */

  _limitContentOriginal;
  _limitContent;

  @api
  get limitContent() {
    return this._limitContentOriginal;
  }

  set limitContent(value) {
    this._limitContentOriginal = value;
    this._limitContent = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: hasTitle */

  _hasTitleOriginal;
  _hasTitle;

  @api
  get hasTitle() {
    return this._hasTitleOriginal;
  }

  set hasTitleWidth(value) {
    this._hastitleOriginal = value;
    this._hasTitle = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: hasSidevar */

  _hasSidebarOriginal;
  _hasSidebar;

  @api
  get hasSidebar() {
    return this._hasSidebarOriginal;
  }

  set hasSidebar(value) {
    this._hasSidebarOriginal = value;
    this._hasSidebar = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  @api pageBackground = "default";
  @api className;

  @track hasBehindSlot;
  @track hasUpperSlot;
  @track hasLowerSlot;
  @track hasAsideSlot;

  get computedClassName() {
    return {
      "rpl-header": true,
      [this.className]: this.className
    };
  }

  get computedMainClassName() {
    return {
      "rpl-header__main": true,
      "rpl-col-12": true,
      "rpl-col-7-m":
        !this._fullWidth && (this.hasAsideSlot || this._limitContent),
      "rpl-col-10-m":
        !this._fullWidth && !this.hasAsideSlot && !this._limitContent
    };
  }

  get computedBehindClassName() {
    return this.hasBehindSlot ? "rpl-header__behind rpl-u-screen-only" : null;
  }

  get computedBehindStyle() {
    return this.hasBehindSlot ? null : "display: none";
  }

  get computedUpperClassName() {
    return this.hasUpperSlot ? "rpl-header__upper" : null;
  }

  get computedUpperStyle() {
    return this.hasUpperSlot ? null : "display: none";
  }

  get computedLowerClassName() {
    return this.hasLowerSlot ? "rpl-header__lower" : null;
  }

  get computedLowerStyle() {
    return this.hasLowerSlot ? null : "display: none";
  }

  get computedAsideClassName() {
    return this.hasAsideSlot
      ? "rpl-header__aside rpl-col-12 rpl-col-4-m rpl-col-start-9-m"
      : null;
  }

  get computedAsideStyle() {
    return this.hasAsideSlot ? null : "display: none";
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
