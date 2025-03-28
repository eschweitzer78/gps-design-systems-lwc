import { LightningElement, api, track } from "lwc";
import { RplIconNames } from "c/sfGpsDsAuVic2IconConstants";
import {
  normaliseString,
  normaliseBoolean,
  isString,
  isObject
} from "c/sfGpsDsHelpers";
import { RplColorThemes, RplIconSizes } from "c/sfGpsDsAuVic2UiCoreConstants";

import STATIC_RESOURCE from "@salesforce/resourceUrl/sfGpsDsAuVic2";

const SIZE_DEFAULT = "s";
const COLOUR_DEFAULT = null;
const PADDED_DEFAULT = false;

/* eslint-disable @lwc/lwc/no-api-reassignments */

export default class extends LightningElement {
  @api title;
  @api className;

  /* api: icon */

  _iconOriginal;
  _error;

  @api
  get icon() {
    return this._iconOriginal;
  }

  set icon(value) {
    this._iconOriginal = value;

    if (isString(value)) {
      try {
        value = JSON.parse(value);
        this._error = null;
      } catch (e) {
        value = null;
        this._error = e;
      }
    }

    if (isObject(value)) {
      this.padded = value.padded;
      this.colour = value.colour;
      this.size = value.size;
      this.name = value.name;
      this.title = value.title;
      this.className = value.className;
    } else {
      this.padded = null;
      this.colour = null;
      this.size = null;
      this.name = null;
      this.title = null;
      this.className = null;
    }
  }

  /* api: padded */

  _padded = PADDED_DEFAULT;
  _paddedOriginal = PADDED_DEFAULT;

  @api
  get padded() {
    return this._paddedOriginal;
  }

  set padded(value) {
    this._paddedOriginal = value;
    this._padded = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PADDED_DEFAULT
    });
  }

  /* api: colour */

  _colour = COLOUR_DEFAULT;
  _colourOriginal = COLOUR_DEFAULT;

  @api
  get colour() {
    return this._colourOriginal;
  }

  set colour(value) {
    this._colourOriginal = value;
    this._colour = normaliseString(value, {
      validValues: RplColorThemes,
      fallbackValue: COLOUR_DEFAULT
    });
  }

  /* api: size */

  _size = SIZE_DEFAULT;
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: RplIconSizes,
      fallbackValue: SIZE_DEFAULT
    });
  }

  /* api: name */

  _name;
  _nameOriginal;

  @api
  get name() {
    return this._nameOriginal;
  }

  set name(value) {
    this._nameOriginal = value;
    this._name = normaliseString(value, {
      validValues: RplIconNames,
      fallbackValue: null
    });
  }

  /* getters */

  get computedClassName() {
    return {
      "rpl-icon": true,
      [`rpl-icon--size-${this._size}`]: this._size,
      [`rpl-icon--${this._name}`]: this._name,
      [`rpl-icon--colour-${this._colour}`]: this._colour,
      "rpl-icon--padded": this._padded,
      [this.className]: this.className
    };
  }

  get computedRole() {
    return this.title ? null : "presentation";
  }

  @track staticResourceHref = STATIC_RESOURCE;

  get computedHref() {
    return this.staticResourceHref != null
      ? `${this.staticResourceHref}/assets/icons/${this._name}.svg#icon`
      : null;
  }
}
