import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const DIRECTION_COLUMN = "column";
const DIRECTION_ROW = "row";
const DIRECTION_VALUES = [DIRECTION_COLUMN, DIRECTION_ROW];
const DIRECTION_DEFAULT = DIRECTION_COLUMN;

const WRAP_WRAP = "wrap";
const WRAP_NOWRAP = "nowrap";
const WRAP_VALUES = [WRAP_WRAP, WRAP_NOWRAP];
const WRAP_DEFAULT = WRAP_WRAP;

const ALIGNITEMS_CENTER = "center";
const ALIGNITEMS_FLEXSTART = "flex-start";
const ALIGNITEMS_FLEXEND = "flex-end";
const ALIGNITEMS_STRETCH = "stretch";
const ALIGNITEMS_BASELINE = "baseline";
const ALIGNITEMS_VALUES = [
  ALIGNITEMS_BASELINE,
  ALIGNITEMS_CENTER,
  ALIGNITEMS_FLEXEND,
  ALIGNITEMS_FLEXSTART,
  ALIGNITEMS_STRETCH
];
const ALIGNITEMS_DEFAULT = ALIGNITEMS_STRETCH;

const JUSTIFYCONTENT_CENTER = "center";
const JUSTIFYCONTENT_FLEXSTART = "flex-start";
const JUSTIFYCONTENT_FLEXEND = "flex-end";
const JUSTIFYCONTENT_SPACEBETWEEN = "space-between";
const JUSTIFYCONTENT_SPACEAROUND = "space-around";
const JUSTIFYCONTENT_SPACEEVENLY = "space-evenly";
const JUSTIFYCONTENT_VALUES = [
  JUSTIFYCONTENT_CENTER,
  JUSTIFYCONTENT_FLEXEND,
  JUSTIFYCONTENT_FLEXSTART,
  JUSTIFYCONTENT_SPACEBETWEEN,
  JUSTIFYCONTENT_SPACEAROUND,
  JUSTIFYCONTENT_SPACEEVENLY
];
const JUSTIFYCONTENT_DEFAULT = JUSTIFYCONTENT_FLEXSTART;

/**
 * @slot Content1
 * @slot Content2
 * @slot Content3
 * @slot Content4
 * @slot Content5
 * @slot Content6
 * @slot Content7
 * @slot Content8
 * @slot Content9
 * @slot Content10
 */
export default class extends SfGpsDsLwc {
  @api nItems = 10;
  @api gap;
  @api className;

  /* api: direction */

  _direction = DIRECTION_DEFAULT;
  _directionOriginal = DIRECTION_DEFAULT;

  @api
  get direction() {
    return this._directionOriginal;
  }

  set direction(value) {
    this._directionOriginal = value;
    this._direction = normaliseString(value, {
      validValues: DIRECTION_VALUES,
      fallbackValue: DIRECTION_DEFAULT
    });
  }

  /* api: wrap */

  _wrap = WRAP_DEFAULT;
  _wrapOriginal = WRAP_DEFAULT;

  @api
  get wrap() {
    return this._wrapOriginal;
  }

  set wrap(value) {
    this._wrapOriginal = value;
    this._wrap = normaliseString(value, {
      validValues: WRAP_VALUES,
      fallbackValue: WRAP_DEFAULT
    });
  }

  /* api: align-items */

  _alignItems = ALIGNITEMS_DEFAULT;
  _alignItemsOriginal = ALIGNITEMS_DEFAULT;

  @api
  get alignItems() {
    return this._alignItemsOriginal;
  }

  set alignItems(value) {
    this._alignItemsOriginal = value;
    this._alignItems = normaliseString(value, {
      validValues: ALIGNITEMS_VALUES,
      fallbackValue: ALIGNITEMS_DEFAULT
    });
  }

  /* api: justify-content */

  _justifyContent = JUSTIFYCONTENT_DEFAULT;
  _justifyContentOriginal = JUSTIFYCONTENT_DEFAULT;

  @api
  get justifyContent() {
    return this._justifyContentOriginal;
  }

  set justifyContent(value) {
    this._justifyContentOriginal = value;
    this._justifyContent = normaliseString(value, {
      validValues: JUSTIFYCONTENT_VALUES,
      fallbackValue: JUSTIFYCONTENT_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "sfgpsds-flex--nogrow": !this.grow,
      [this.className]: this.className
    };
  }

  get computedFlexStyle() {
    return computeClass(
      {
        "display: flex": true,

        "flex-direction: row": this._direction === DIRECTION_ROW,
        "flex-direction: column": this._direction === DIRECTION_COLUMN,

        "flex-wrap: wrap": this._wrap === WRAP_WRAP,
        "flex-wrap: nowrap": this._wrap === WRAP_NOWRAP,

        "align-items: center": this._alignItems === ALIGNITEMS_CENTER,
        "align-items: flex-end": this._alignItems === ALIGNITEMS_FLEXEND,
        "align-items: flex-start": this._alignItems === ALIGNITEMS_FLEXSTART,
        "align-items: stretch": this._alignItems === ALIGNITEMS_STRETCH,
        "align-items: baseline": this._alignItems === ALIGNITEMS_BASELINE,

        "justify-content: center":
          this._justifyContent === JUSTIFYCONTENT_CENTER,
        "justify-content: flex-start":
          this._justifyContent === JUSTIFYCONTENT_FLEXSTART,
        "justify-content: flex-end":
          this._justifyContent === JUSTIFYCONTENT_FLEXEND,
        "justify-content: space-between":
          this._justifyContent === JUSTIFYCONTENT_SPACEBETWEEN,
        "justify-content: space-around":
          this._justifyContent === JUSTIFYCONTENT_SPACEAROUND,
        "justify-content: space-evenly":
          this._justifyContent === JUSTIFYCONTENT_SPACEEVENLY,

        [`gap: ${this.gap?.replaceAll(";", "")}`]: this.gap
      },
      ";"
    );
  }

  get has2() {
    return this.nItems >= 2;
  }

  get has3() {
    return this.nItems >= 3;
  }

  get has4() {
    return this.nItems >= 4;
  }

  get has5() {
    return this.nItems >= 5;
  }

  get has6() {
    return this.nItems >= 6;
  }

  get has7() {
    return this.nItems >= 7;
  }

  get has8() {
    return this.nItems >= 8;
  }

  get has9() {
    return this.nItems >= 9;
  }

  get has10() {
    return this.nItems >= 10;
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
  }
}
