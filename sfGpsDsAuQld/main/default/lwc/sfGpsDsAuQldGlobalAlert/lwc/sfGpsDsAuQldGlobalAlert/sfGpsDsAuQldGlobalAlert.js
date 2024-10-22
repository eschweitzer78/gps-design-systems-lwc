import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const LEVEL_CRITICAL = "critical";
const LEVEL_DEFAULT = "default";
const LEVEL_GENERAL = "general";
const LEVEL_VALUES = [LEVEL_CRITICAL, LEVEL_DEFAULT, LEVEL_GENERAL];

const I18N = {
  closeAlert: "Close alert",
  criticalAlert: "Critical alert",
  defaultAlert: "Alert",
  generalAlert: "General alert"
};

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/svg-icons.svg";

export default class extends LightningElement {
  @api title;
  @api copy;
  @api ctaText;
  @api ctaHref;
  @api ctaPreventDefault = false;
  @api className;

  /* api: level */

  _level;
  _levelOriginal;

  @api get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = normaliseString(value, {
      validValues: LEVEL_VALUES,
      fallbackValue: LEVEL_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__global-alert": true,
      "qld__global-alert--critical": this._level === LEVEL_CRITICAL,
      "qld__global-alert--default": this._level === LEVEL_DEFAULT,
      "qld__global-alert--general": this._level === LEVEL_GENERAL,
      [this.className]: this.className
    });
  }

  get i18n() {
    return I18N;
  }

  get computedAriaLabel() {
    switch (this._level) {
      case LEVEL_CRITICAL:
        return I18N.criticalAlert;

      case LEVEL_DEFAULT:
        return I18N.defaultAlert;

      case LEVEL_GENERAL:
        return I18N.generalAlert;

      default:
        return null;
    }
  }

  get computedIconUrl() {
    switch (this._level) {
      case LEVEL_CRITICAL:
        return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__critical";

      case LEVEL_DEFAULT:
        return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__warning";

      case LEVEL_GENERAL:
        return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__info";

      default:
        return null;
    }
  }

  get computedArrowRightIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__arrow-right";
  }

  get computedCloseIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__close";
  }

  /* methods */

  handleCtaClick(event) {
    if (this.ctaPreventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  handleCloseClick() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
