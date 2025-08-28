/**
 * @module ns/omniscriptTextBlock
 * @description This component is used to render a Text Block element. Text Block supports Merge fields (e.g. %Text1%).
 * OmniscriptTextBlock is extended from omniscriptBaseElement.
 */
import { api, track } from "lwc";
import OmniscriptBaseElement from "c/sfGpsDsOsrtOmniscriptBaseElement";
import { isRepeatNotation } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { replaceUrlHost } from "c/sfGpsDsOsrtOmniscriptRestApi";
import tmpl from "./sfGpsDsOsrtOmniscriptTextBlock.html";

/**
 * Default exported class OmniscriptTextBlock.
 * @extends OmniscriptBaseElement
 * @typicalname OmniscriptText
 */
export default class OmniscriptTextBlock extends OmniscriptBaseElement {
  _isEmptyTextBlockInDesignMode = false;

  /**
   * @type {string} - Reactive private property. Realtime refresh of text displayed for a Text Block element..
   * @scope track (private)
   */
  @track mergeVal;

  /**
   * @type {string} - Use to set the class name.
   * @scope private
   */
  _themeClass;

  /**
   * @type {string} - get the value from the omniscript.
   * @scope private
   */
  _tbText;

  /**
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._themeClass = `${this._theme}-form-element ${this._theme}-form-container ${this._theme}-text-block`;
    this._tbText = this._propSetMap.text;

    // Display the element's name in Design Mode for when Text Block content is empty
    if (this._isDesignMode && (this._tbText == null || this._tbText === "")) {
      this._isEmptyTextBlockInDesignMode = true;
    }

    if (this.scriptHeaderDef.multiLang) {
      this._tbText = this._propSetMap.textKey;
    }

    if (this._tbText) {
      this._tbText = replaceUrlHost(
        this._tbText,
        this.scriptHeaderDef.isCommunity,
        this.scriptHeaderDef.networkUrlPathPrefix || null,
        this.scriptHeaderDef.communityBaseUrl
      );
    }
  }

  /**
   * @description Overwrite, watch to refresh the text displayed for a Text Block element (with merge fields).
   * @returns {Void}
   * @scope private
   */
  stateRefresh() {
    if (this._tbText) {
      this.mergeVal = `<div>${this._tbText}</div>`;
      // if we're in designer we don't want to remove merge fields, we just want to show it as the raw text
      // so skip merging here
      if (!this._isDesignMode && this._jsonData) {
        this.mergeVal = `<div>${this.handleMergeFieldUtil(
          this._tbText,
          this._jsonData,
          this.scriptHeaderDef.labelMap,
          isRepeatNotation(this._tbText) ? this.jsonDef.JSONPath : null,
          true,
          true
        )}</div>`;
      }
    }
  }

  /**
   * @scope public
   * @description Overwrite, Text Block elements do not accept API responses.
   * @param {Object} json
   * @param {Boolean} [bApi=false]
   * @param {Boolean} [bValidation=false]
   * @returns {Void}
   */
  // eslint-disable-next-line no-unused-vars
  @api applyCallResp(json, bApi = false, bValidation = false) {}

  /**
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return tmpl;
  }
}
