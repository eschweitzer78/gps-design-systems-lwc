import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import { RplIconSizes, RplIconNames } from "./constants";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
//import tmpl from "./sfGpsDsAuVic2Icon.html";
const RplColorThemes = [];
//const CLASS_NAME = "sfGpsDsAuVic2Icon";

export default class extends LightningElement {
  @api title;
  @api addClassName;

  /* api: padded */

  _paddedOriginal = false;
  _padded = false;

  @api get paddded() {
    return this._paddedOriginal;
  }

  set padded(value) {
    this._paddedOriginal = value;
    this._padded = normaliseBoolean(value, {
      acceptAsString: true
    });
  }

  /* api: colour */

  _colourOriginal;
  _colour;

  @api
  get colour() {
    return this._colourOriginal;
  }

  set colour(value) {
    this._colourOriginal = value;
    this._colour = normaliseString(value, {
      validValues: RplColorThemes,
      fallbackValue: null
    });
  }

  /* api: size */
  _sizeOriginal = "s";
  _size = "s";

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: RplIconSizes,
      fallbackValue: null
    });
  }

  /* api: name */

  _nameOriginal;
  _name;

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
    return computeClass({
      "rpl-icon": true,
      [`rpl-icon--size-${this._size}`]: this._size,
      [`rpl-icon--${this._name}`]: this._name,
      [`rpl-icon--colour-${this._colour}`]: this._colour,
      "rpl-icon--padded": this._padded,
      [this.addClassNamme]: this.addClassName
    });
  }

  get computedRole() {
    return this.title ? "presentation" : null;
  }

  get computedHref() {
    return `/sfsites/c/resource/sfGpsDsAuVic2/assets/icons/${this._name}.svg#icon`;
  }
}
