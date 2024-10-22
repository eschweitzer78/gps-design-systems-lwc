import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

const COL_CLASSNAME = "qld__card-list--col";
/**
 * @slot column1
 * @slot column2
 * @slot column3
 * @slot column4
 * @slot column5
 * @slot column6
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api col1ClassName;
  @api col2ClassName;
  @api col3ClassName;
  @api col4ClassName;
  @api col5ClassName;
  @api col6ClassName;
  @api className;

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__card-list": true,
      [this.className]: this.className
    });
  }

  get computedCol1ClassName() {
    return computeClass({
      [this.col1ClassName]: this.col1ClassName,
      [COL_CLASSNAME]: true
    });
  }

  get computedCol2ClassName() {
    return computeClass({
      [this.col2ClassName]: this.col2ClassName,
      [COL_CLASSNAME]: true
    });
  }

  get computedCol3ClassName() {
    return computeClass({
      [this.col3ClassName]: this.col3ClassName,
      [COL_CLASSNAME]: true
    });
  }

  get computedCol4ClassName() {
    return computeClass({
      [this.col4ClassName]: this.col4ClassName,
      [COL_CLASSNAME]: true
    });
  }

  get computedCol5ClassName() {
    return computeClass({
      [this.col5ClassName]: this.col5ClassName,
      [COL_CLASSNAME]: true
    });
  }

  get computedCol6ClassName() {
    return computeClass({
      [this.col6ClassName]: this.col6ClassName,
      [COL_CLASSNAME]: true
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
