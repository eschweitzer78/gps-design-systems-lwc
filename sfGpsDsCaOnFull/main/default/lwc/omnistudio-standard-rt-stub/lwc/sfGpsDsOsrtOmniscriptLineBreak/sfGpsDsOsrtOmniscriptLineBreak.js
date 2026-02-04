/**
 * @module ns/omniscriptLineBreak
 * @description This component is used to render a Line Break, This is extends from class `OmniscriptBaseElement`.
 */
import { api } from "lwc";
import OmniscriptBaseElement from "c/sfGpsDsOsrtOmniscriptBaseElement";

import tmpl from "./sfGpsDsOsrtOmniscriptLineBreak.html";

/**
 * Default exported class OmniscriptLineBreak.
 * @extends OmniscriptBaseElement
 * @typicalname OmniscriptLineBreak
 */
export default class OmniscriptLineBreak extends OmniscriptBaseElement {
  /**
   * @type {String} - class based on theme
   * @scope private
   */
  _themeClass;

  /**
   * @type {String} - padding for line break
   * @scope private
   */
  _ctrlPropertyPadding;

  /**
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._themeClass = `${this._theme}-size_1-of-1 ${this._theme}-line_break ${this._isDesignMode ? "is-design-mode" : ""}`;
    this._ctrlPropertyPadding = `padding-bottom: ${this._propSetMap.padding}px`;
  }

  /**
   * @description Added class for width
   * @returns {Void}
   * @scope private
   */
  applyCtrlWidth() {
    this.classList.add(this._theme + "-size_1-of-1");
  }

  /**
   * @scope public
   * @description verwrites inherited applyCallResp.
   * @param {Object} json
   * @param {Boolean} [bApi=false]
   * @param {Boolean} [bValidation=false]
   * @returns {Void}
   */
  @api applyCallResp(json, bApi = false, bValidation = false) {
    window.console("do nothing " + json + bApi + bValidation);
  }

  /**
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return tmpl;
  }
}
