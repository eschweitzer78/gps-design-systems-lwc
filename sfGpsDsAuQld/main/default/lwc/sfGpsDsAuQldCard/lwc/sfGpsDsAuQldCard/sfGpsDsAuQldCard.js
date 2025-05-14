import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const TYPE_DEFAULT = "default";
const TYPE_ICON = "icon";
const TYPE_IMAGE = "image";
const TYPE_VALUES = [TYPE_DEFAULT, TYPE_ICON, TYPE_IMAGE];

const ICONALIGN_LEFT = "left";
const ICONALIGN_TOP = "top";
const ICONALIGN_VALUES = [ICONALIGN_LEFT, ICONALIGN_TOP];
const ICONALIGN_DEFAULT = ICONALIGN_TOP;

const HEADINGLEVEL_H2 = "h2";
const HEADINGLEVEL_H3 = "h3";
const HEADINGLEVEL_H4 = "h4";
const HEADINGLEVEL_H5 = "h5";
const HEADINGLEVEL_H6 = "h6";
const HEADINGLEVEL_VALUES = [
  HEADINGLEVEL_H2,
  HEADINGLEVEL_H3,
  HEADINGLEVEL_H4,
  HEADINGLEVEL_H5,
  HEADINGLEVEL_H6
];
const HEADINGLEVEL_DEFAULT = HEADINGLEVEL_H3;

const DISPLAYFOOTER_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api icon;
  @api nameText;
  @api nameUrl;
  @api thumbnail;
  @api tags;
  @api tagsMode;
  @api actions;
  @api displayArrow;
  @api className;

  /* api: type */

  _type = TYPE_DEFAULT;
  _typeOriginal = TYPE_DEFAULT;

  @api
  get type() {
    return this._typeOriginal;
  }

  set type(value) {
    this._typeOriginal = value;
    this._type = normaliseString(value, {
      validValues: TYPE_VALUES,
      fallbackValue: TYPE_DEFAULT
    });
  }

  /* api: iconAlign */

  _iconAlign = ICONALIGN_DEFAULT;
  _iconAlignOriginal = ICONALIGN_DEFAULT;

  @api
  get iconAlign() {
    return this._iconAlignOriginal;
  }

  set iconAlign(value) {
    this._iconAlignOriginal = value;
    this._iconAlign = normaliseString(value, {
      validValues: ICONALIGN_VALUES,
      fallbackValue: ICONALIGN_DEFAULT
    });
  }

  /* api: headingLevel */

  _headingLevel = HEADINGLEVEL_DEFAULT;
  _headingLevelOriginal = HEADINGLEVEL_DEFAULT;

  @api
  get headingLevel() {
    return this._headingLevelOriginal;
  }

  set headingLevel(value) {
    this._headingLevelOriginal = value;
    this._headingLevel = normaliseString(value, {
      validValues: HEADINGLEVEL_VALUES,
      fallbackValue: HEADINGLEVEL_DEFAULT
    });
  }

  /* api: displayFooter */

  _displayFooter = DISPLAYFOOTER_DEFAULT;
  _displayFooterOriginal = DISPLAYFOOTER_DEFAULT;

  @api
  get displayFooter() {
    return this._displayFooterOriginal;
  }

  set displayFooter(value) {
    this._displayFooterOriginal = value;
    this._displayFooter = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISPLAYFOOTER_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return {
      qld__card: true,
      "qld__card--icon": this._type === TYPE_ICON,
      "qld__card--image": this._type === TYPE_IMAGE,
      "qld__card--icon-left":
        this._type === TYPE_ICON && this._iconAlign === ICONALIGN_LEFT,
      "qld__card--arrow": this.displayArrow,
      qld__card__action: this.nameUrl,
      "qld__card__multi-action": this.actions ? this.actions.length : false,
      [this.className]: this.className
    };
  }

  get computedIsIconCard() {
    return this._type === TYPE_ICON;
  }

  get computedIsImageCard() {
    return this._type === TYPE_IMAGE;
  }

  get computedStyle() {
    return `background-image: url(${this.thumbnail})`;
  }

  get computedHeadingLevelIsH2() {
    return this._headingLevel === HEADINGLEVEL_H2;
  }

  get computedHeadingLevelIsH3() {
    return this._headingLevel === HEADINGLEVEL_H3;
  }

  get computedHeadingLevelIsH4() {
    return this._headingLevel === HEADINGLEVEL_H4;
  }

  get computedHeadingLevelIsH5() {
    return this._headingLevel === HEADINGLEVEL_H5;
  }

  get computedHeadingLevelIsH6() {
    return this._headingLevel === HEADINGLEVEL_H6;
  }

  get computedHasTags() {
    return this.tags?.length;
  }

  get computedHasActions() {
    return this.actions?.length;
  }
}
