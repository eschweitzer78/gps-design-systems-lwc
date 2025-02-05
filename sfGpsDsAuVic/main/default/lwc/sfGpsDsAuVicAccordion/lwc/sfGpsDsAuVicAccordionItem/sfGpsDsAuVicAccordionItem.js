import { LightningElement, api, track } from "lwc";
import {
  isRTL,
  uniqueId,
  normaliseString,
  computeClass
} from "c/sfGpsDsHelpers";

const CONTENTID_PREFIX = "sf-gps-ds-au-vic-accordion-item-content";

const BUTTONTEXT_CLASSNAME = isRTL()
  ? "rpl-accordion__button-text--rtl"
  : "rpl-accordion__button-text";

const TYPE_DEFAULT = "default";
const TYPE_NUMBERED = "numbered";
const TYPE_VALUES = [TYPE_DEFAULT, TYPE_NUMBERED];

export default class extends LightningElement {
  static renderMode = "light";

  @api index;
  @api title;
  @api content;

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

  /* api: closed */

  @track _isOpen = false;

  @api
  get closed() {
    return !this._isOpen;
  }

  set closed(value) {
    this._isOpen = !value;
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-accordion__list-item": true,
      "rpl-accordion__list-item--expanded": this._isOpen
    };
  }

  get computedTitleClassName() {
    return {
      "rpl-accordion__title": true,
      "rpl-accordion__title--expanded": this._isOpen
    };
  }

  get computedButtonClassName() {
    return {
      "rpl-accordion__button": true,
      "rpl-accordion__button--expanded": this._isOpen
    };
  }

  get computedIconClassName() {
    return computeClass({
      "rpl-accordion__icon": true,
      "rpl-accordion__icon--expanded": this._isOpen
    });
  }

  get computedButtonTextClassName() {
    return BUTTONTEXT_CLASSNAME;
  }

  get computedStyle() {
    return this._isOpen ? `height: auto; visibility: visible` : "";
  }

  _contentId;

  get computedContentId() {
    if (!this._contentId) {
      this._contentId = uniqueId(CONTENTID_PREFIX);
    }

    return this._contentId;
  }

  get computedIsNumbered() {
    return this._type === TYPE_NUMBERED;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(new CustomEvent(this._isOpen ? "collapse" : "expand"));
  }
}
