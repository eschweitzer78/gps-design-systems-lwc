import { LightningElement, api } from "lwc";
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

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2Icon";

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
    if (DEBUG) console.debug(CLASS_NAME, "> set padded", value);

    this._paddedOriginal = value;
    this._padded = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PADDED_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set padded", this._padded);
  }

  /* api: colour */

  _colour = COLOUR_DEFAULT;
  _colourOriginal = COLOUR_DEFAULT;

  @api
  get colour() {
    return this._colourOriginal;
  }

  set colour(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set colour", value);

    this._colourOriginal = value;
    this._colour = normaliseString(value, {
      validValues: RplColorThemes,
      fallbackValue: COLOUR_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set colour", this._colour);
  }

  /* api: size */

  _size = SIZE_DEFAULT;
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set size", value);

    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: RplIconSizes,
      fallbackValue: SIZE_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set size", this._size);
  }

  /* api: name */

  _name;
  _nameOriginal;

  @api
  get name() {
    return this._nameOriginal;
  }

  set name(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set name", value);

    this._nameOriginal = value;
    this._name = normaliseString(value, {
      validValues: RplIconNames,
      fallbackValue: null
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set name", this._name);
  }

  /* getters */

  get computedClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedClassName");

    const rv = {
      "rpl-icon": true,
      [`rpl-icon--size-${this._size}`]: this._size,
      [`rpl-icon--${this._name}`]: this._name,
      [`rpl-icon--colour-${this._colour}`]: this._colour,
      "rpl-icon--padded": this._padded,
      [this.className]: this.className
    };

    if (DEBUG) console.debug(CLASS_NAME, "< computedClassName", rv);
    return rv;
  }

  get computedRole() {
    return this.title ? null : "presentation";
  }

  get computedHref() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedHref", this._name);

    const rv = `${STATIC_RESOURCE}/assets/icons/${this._name}.svg#icon`;

    if (DEBUG) console.debug(CLASS_NAME, "< computedHref", rv);
    return rv;
  }
}
