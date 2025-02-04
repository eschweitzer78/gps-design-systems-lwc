import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const I18N = {
  closeAlert: "Close alert"
};

const LEVEL_DEFAULT = "default";
const LEVEL_VALUES = {
  critical: {
    className: "qld__global-alert--critical",
    ariaLabel: "Critial alert",
    iconName: "qld__icon__critical"
  },
  default: {
    className: "qld__global-alert--default",
    ariaLabel: "Alert",
    iconName: "qld__icon__warning"
  },
  general: {
    className: "qld__global-alert--general",
    ariaLabel: "General alert",
    iconName: "qld__icon__info"
  }
};

const DISMISSIBLE_DEFAULT = true;

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/svg-icons.svg";

export default class extends LightningElement {
  @api alertId;
  @api title;
  @api content;
  @api linkText;
  @api linkUrl;
  @api linkPreventDefault = false;
  @api className;

  /* api: level */

  _level = LEVEL_VALUES[LEVEL_DEFAULT];
  _levelOriginal = LEVEL_DEFAULT;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = normaliseString(value, {
      validValues: LEVEL_VALUES,
      fallbackValue: LEVEL_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: dismissible */

  _dismissible = DISMISSIBLE_DEFAULT;
  _dismissibleOriginal = DISMISSIBLE_DEFAULT;

  @api
  get dismissible() {
    return this._dismissibleOriginal;
  }

  set dismissible(value) {
    this._dismissibleOriginal = value;
    this._dismissible = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISMISSIBLE_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return {
      "qld__global-alert": true,
      [this._level.className]: this._level,
      [this.className]: this.className
    };
  }

  get i18n() {
    return I18N;
  }

  get computedAriaLabel() {
    return this._level.ariaLabel;
  }

  get computedIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#" + this._level.iconName;
  }

  get computedArrowRightIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__arrow-right";
  }

  get computedCloseIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#qld__icon__close";
  }

  /* event management */

  handleLinkClick(event) {
    if (this.linkPreventDefault) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.dispatchEvent(new CustomEvent("linkclick"));
  }

  handleCloseClick() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
