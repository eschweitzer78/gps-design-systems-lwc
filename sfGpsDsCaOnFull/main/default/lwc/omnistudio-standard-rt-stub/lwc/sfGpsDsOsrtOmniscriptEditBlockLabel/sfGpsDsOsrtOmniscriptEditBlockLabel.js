import { track, api, LightningElement } from "lwc";
import { createGlobalActionList } from "c/sfGpsDsOsrtOmniscriptEditBlockUtils";
import { handleMultiLangLabel } from "c/sfGpsDsOsrtOmniscriptCustomLabels";
import {
  sendHttpDataToDebugConsole,
  RUN_MODES
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";

import tmpl_nds from "./omniscriptEditBlockLabel_nds.html";
import tmpl from "./omniscriptEditBlockLabel_slds.html";
/**
 * @module ns/omniscriptEditBlockLabel
 */
export default class OmniscriptEditBlockLabel extends LightningElement {
  @api jsonDef;
  @api layout;
  @api resume;
  @api runMode = RUN_MODES.PLAYER;
  @api jsonData;
  @api jsonDataStr;
  @api scriptHeaderDef;
  @track isPageLoading = false;
  @api mode;

  get _isDesignMode() {
    return this.runMode === RUN_MODES.DESIGNER;
  }
  _showLabel = false;
  /**
   * @type {Object} Contains the global actions for edit block
   * @scope private
   */
  _gActions = [];
  /**
   * @description Button spinner flag.
   * @type {Boolean}
   * @scope private
   */
  isBtnLoading = false;
  _jsonDef;
  _jsonData;
  _propSetMap;
  dispatchOmniEventUtil = dispatchOmniEvent;
  /**
   * Initializes private component variables
   */
  initCompVariables() {
    // backwards compat, template name will override the mode property to determine template to use
    this._isInline = this.mode === "Inline";
    this._isFS = this.mode === "FS";
    this._isTable = this.mode === "Table" || this.mode === "";
    this._isCards = this.mode === "Cards";
    this._isLongCards = this.mode === "LongCards";

    let templateName = this._jsonDef.propSetMap.HTMLTemplateId;

    let hasTemplate =
      this._isInline ||
      this._isFS ||
      this._isTable ||
      this._isCards ||
      this._isLongCards;

    if (!hasTemplate) {
      if (templateName === "vlcEditBlockInline.html") {
        this._isInline = true;
      } else if (templateName === "vlcEditBlockFS.html") {
        this._isFS = true;
      } else if (templateName === "vlcEditBlock.html" || templateName === "") {
        this._isTable = true;
      } else if (templateName === "vlcEditBlockCards.html") {
        this._isCards = true;
      } else if (templateName === "vlcEditBlockLongCards.html") {
        this._isLongCards = true;
      }
    }

    if (this._propSetMap.gActions) {
      createGlobalActionList(this, this._propSetMap.gActions);
    }

    this._showLabel = this._isCards || this._isLongCards;
  }

  sendDataToDebugConsole(params, resp, label) {
    sendHttpDataToDebugConsole(
      this,
      params,
      resp,
      label,
      this._jsonDef,
      "omniactiondebug"
    );
  }

  connectedCallback() {
    if (this.jsonDef) {
      this._jsonData = this.jsonData;
      this._jsonDef = this.jsonDef.eleArray[0];
      if (!this._jsonDef) {
        return;
      }
      this._propSetMap = this._jsonDef.propSetMap;
      this._multiLang = this.scriptHeaderDef.multiLang;
      this.allCustomLabelsUtil = this.scriptHeaderDef.allCustomLabels;
      if (this._multiLang && !this._isDesignMode) {
        this._propSetMap = JSON.parse(JSON.stringify(this._jsonDef.propSetMap));
        handleMultiLangLabel(
          this._jsonDef.type,
          this._propSetMap,
          this.scriptHeaderDef.allCustomLabels
        );
        // translate the global action's properties
        if (this._propSetMap.gActions) {
          this._propSetMap.gActions.forEach((gAction) => {
            handleMultiLangLabel(
              gAction.type,
              gAction.propSetMap,
              this.scriptHeaderDef.allCustomLabels
            );
          });
        }
      }
      this.mode = this._propSetMap.mode;
      this._theme = this.layout === "newport" ? "nds" : "slds";
      this.initCompVariables();
      this.classList.add(`${this._theme}-size_1-of-1`);
      this.classList.add(`${this._theme}-m-vertical_small`);
    }
  }

  render() {
    if (this._isDesignMode) {
      this.initCompVariables();
    }
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
}
