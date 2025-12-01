import { api } from "lwc";
import SfGpsDsAuQldBodyLwr from "c/sfGpsDsAuQldBodyLwr";

/**
 * @slot Tab1
 * @slot Tab2
 * @slot Tab3
 * @slot Tab4
 * @slot Tab5
 * @slot Tab6
 * @slot Tab7
 * @slot Tab8
 * @slot Tab9
 * @slot Tab10
 */
export default class extends SfGpsDsAuQldBodyLwr {
  static renderMode = "light";

  @api tab1Label;
  @api tab1IconName;
  @api tab2Label;
  @api tab2IconName;
  @api tab3Label;
  @api tab3IconName;
  @api tab4Label;
  @api tab4IconName;
  @api tab5Label;
  @api tab5IconName;
  @api tab6Label;
  @api tab6IconName;
  @api tab7Label;
  @api tab7IconName;
  @api tab8Label;
  @api tab8IconName;
  @api tab9Label;
  @api tab9IconName;
  @api tab10Label;
  @api tab10IconName;

  @api
  get cstyle() {
    return super.cstyle;
  }

  set cstyle(value) {
    super.cstyle = this.value;
  }

  @api
  get width() {
    return super.width;
  }

  set width(value) {
    super.width = value;
  }

  /* api: mode */

  _mode;

  @api
  get mode() {
    return this._mode;
  }

  set mode(value) {
    if (value === this._mode) return;

    if (this.computedIsSection) this.classList.remove("qld__tab-section");
    this._mode = value;
    if (this.computedIsSection) this.classList.add("qld__tab-section");
  }

  get computedIsSection() {
    return this._mode === "section";
  }

  /* api: className */

  _preClassName;

  @api
  get className() {
    return super.className;
  }

  set className(value) {
    super.className = value;
  }
}
