import { LightningElement, api, track } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const MODE_DEFAULT = "default";
const MODE_BASIC = "basic";
const MODE_ADVANCED = "advanced";
const MODE_VALUES = [MODE_DEFAULT, MODE_BASIC, MODE_ADVANCED];

const CSTYLE_DEFAULT = "default";
const CSTYLE_ALT = "alt";
const CSTYLE_DARK = "dark";
const CSTYLE_DARKALT = "dark-alt";
const CSTYLE_VALUES = [CSTYLE_DEFAULT, CSTYLE_ALT, CSTYLE_DARK, CSTYLE_DARKALT];

export default class SfGpsDsAuQldBanner extends LightningElement {
  @api breadcrumbsItems;
  @api title;
  @api image;
  @api primaryAction;
  @api secondaryAction;
  @api className;

  /* api: mode */

  _mode;
  _modeOriginal;

  @api get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  /* api: cstyle */

  _cstyle;
  _cstyleOriginal;

  @api get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /* getters */

  get computedHasBreadcrumbsItems() {
    return this.breadcrumbsItems?.length;
  }

  get isDefault() {
    return this._mode === MODE_DEFAULT;
  }

  get isBasic() {
    return this._mode === MODE_BASIC;
  }

  get isAdvanced() {
    return this._mode === MODE_ADVANCED;
  }

  get computedClassName() {
    return computeClass({
      qld__banner: true,
      "qld__banner--breadcrumbs": this.computedHasBreadcrumbsItems,
      qld__banner__advanced: this.isAdvanced,
      "qld__banner--has-hero": this.image,
      "qld__banner--alt": this.cstyle === CSTYLE_ALT,
      "qld__banner--dark": this.cstyle === CSTYLE_DARK,
      "qld__banner--dark-alt": this.cstyle === CSTYLE_DARKALT,
      [this.className]: this.className
    });
  }

  get computedImageStyle() {
    return `background-image: url(${this.image})`;
  }

  get hasActions() {
    return this.primaryAction || this.secondaryAction;
  }

  get primaryActionUrl() {
    return this.primaryAction?.url;
  }

  get primaryActionText() {
    return this.primaryAction?.text;
  }

  get secondaryActionUrl() {
    return this.secondaryAction?.url;
  }

  get secondaryActionText() {
    return this.secondaryAction?.text;
  }

  /* event management */

  @track hasBreadcrumbs = false;

  handleSlotChange(event) {
    switch (event.target.name) {
      case "mobileBreadcrumbs":
      case "desktopBreadcrumbs":
        this.hasBreadcrumbs = true;
        break;

      default:
    }
  }
}
