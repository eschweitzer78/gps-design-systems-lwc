import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Column-1
 * @slot Column-2
 * @slot Column-3
 * @slot Column-4
 * @slot Column-5
 * @slot Column-6
 * @slot Column-7
 * @slot Column-8
 * @slot Column-9
 * @slot Column-10
 * @slot Column-11
 * @slot Column-12
 */
export default class SfGpsDsAuNswColumnsLwr extends SfGpsDsLwc {
  // We'd be fine with shadow but for the Exp Builder design time styling which requires to spill to other components...
  static renderMode = "light";

  _widthOriginal = {
    xs: "12",
    sm: "12",
    md: "4",
    lg: "4",
    xl: "4"
  };

  _width = {
    xs: 12,
    sm: 12,
    md: 4,
    lg: 4,
    xl: 4
  };

  /* api: xsWidth */

  @api
  get xsWidth() {
    return this._widthOriginal.xs;
  }

  set xsWidth(value) {
    this.setWidth("xs", value);
  }

  /* api: smWidth */

  @api
  get smWidth() {
    return this._widthOriginal.sm;
  }

  set smWidth(value) {
    this.setWidth("sm", value);
  }

  /* api: mdWidth */

  @api
  get mdWidth() {
    return this._widthOriginal.md;
  }

  set mdWidth(value) {
    this.setWidth("md", value);
  }

  /* api: lgWidth */

  @api
  get lgWidth() {
    return this._widthOriginal.lg;
  }

  set lgWidth(value) {
    this.setWidth("lg", value);
  }

  /* api: xlWidth */

  @api
  get xlWidth() {
    return this._widthOriginal.xl;
  }

  set xlWidth(value) {
    this.setWidth("xl", value);
  }

  /* api: nbColumns */

  _nbColumnsOriginal = "3";
  _nbColumns = 3;

  @api
  get nbColumns() {
    return this._nbColumnsOriginal;
  }

  set nbColumns(value) {
    this._nbColumnsOriginal = value;

    switch (typeof value) {
      case "string":
        this._nbColumns = parseInt(value, 10);
        break;

      case "number":
        this._nbColumns = Math.round(value);
        break;

      default:
        this._nbColumns = 3;
    }

    this.computeVisibleColumns();
  }

  @api mode;
  @api columnMode;
  @api columnClassName;
  @api className;

  /* getters */

  get computedClassName() {
    return computeClass({
      "nsw-grid": true,
      "nsw-grid--spaced": this.mode === "Spaced",
      "nsw-grid--flush": this.mode === "Flush",
      "sfgpsdsaunsw-columns--stretch": this.columnMode === "Stretch",
      "sfgpsdsaunsw-columns--center": this.columnMode === "Center",
      "sfgpsdsaunsw-columns--start": this.columnMode === "Start",
      "sfgpsdsaunsw-columns--end": this.columnMode === "End",
      [this.className]: this.className
    });
  }

  get computedColumn1ClassName() {
    return this.computedColClassNameForColumn(1);
  }
  get computedColumn2ClassName() {
    return this.computedColClassNameForColumn(2);
  }
  get computedColumn3ClassName() {
    return this.computedColClassNameForColumn(3);
  }
  get computedColumn4ClassName() {
    return this.computedColClassNameForColumn(4);
  }
  get computedColumn5ClassName() {
    return this.computedColClassNameForColumn(5);
  }
  get computedColumn6ClassName() {
    return this.computedColClassNameForColumn(6);
  }
  get computedColumn7ClassName() {
    return this.computedColClassNameForColumn(7);
  }
  get computedColumn8ClassName() {
    return this.computedColClassNameForColumn(8);
  }
  get computedColumn9ClassName() {
    return this.computedColClassNameForColumn(9);
  }
  get computedColumn10ClassName() {
    return this.computedColClassNameForColumn(10);
  }
  get computedColumn11ClassName() {
    return this.computedColClassNameForColumn(11);
  }
  get computedColumn12ClassName() {
    return this.computedColClassNameForColumn(12);
  }

  /* methods */

  setWidth(bracket, value) {
    this._widthOriginal[bracket] = value;

    switch (typeof value) {
      case "string":
        this._width[bracket] = parseInt(value, 10);
        break;

      case "number":
        this._width[bracket] = Math.round(value);
        break;

      default:
        this._width[bracket] = 12;
    }
    this.computeVisibleColumns(bracket);
  }

  _visibleColumns = {
    xs: 3,
    sm: 3,
    md: 3,
    lg: 3,
    xl: 3
  };

  computeVisibleColumns(bracket = null) {
    for (let current of ["xs", "sm", "md", "lg", "xl"]) {
      if (current === bracket || bracket == null) {
        let currentColsPerRow = this._width[current]
          ? 12 / this._width[current]
          : 4;
        this._visibleColumns[current] =
          currentColsPerRow * Math.floor(this._nbColumns / currentColsPerRow);
      }
    }
  }

  computedColClassNameForColumn(colNumber) {
    return computeClass({
      "nsw-col": true,
      ["nsw-col-xs-" + this._width.xs]: this._width.xs,
      "nsw-display-xs-none":
        this._width.xs && colNumber > this._visibleColumns.xs,
      ["nsw-col-sm-" + this._width.sm]: this._width.sm,
      "nsw-display-sm-none":
        this._width.sm && colNumber > this._visibleColumns.sm,
      ["nsw-col-md-" + this._width.md]: this._width.md,
      "nsw-display-md-none":
        this._width.md && colNumber > this._visibleColumns.md,
      ["nsw-col-lg-" + this._width.lg]: this._width.lg,
      "nsw-display-lg-none":
        this._width.lg && colNumber > this._visibleColumns.lg,
      ["nsw-col-xl-" + this._width.xl]: this._width.xl,
      "nsw-display-xl-none":
        this._width.xl && colNumber > this._visibleColumns.xl,
      [this.columnClassName]: this.columnClassName
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
