/**
 * @module ns/OmniscriptEditBlockNew
 * @description This component is used to render a OmniscriptEditBlockNew
 */
import { api, LightningElement } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { handleMultiLangLabel } from "c/sfGpsDsOsrtOmniscriptCustomLabels";
import { RUN_MODES } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import tmpl_nds from "./omniscriptEditBlockNew_nds.html";
import tmpl from "./omniscriptEditBlockNew_slds.html";

/**
 * Default exported class OmniscriptEditBlockNew
 * @extends LightningElement
 * @typicalname OmniscriptEditBlockNew
 */
export default class OmniscriptEditBlockNew extends LightningElement {
  @api layout;
  @api resume;
  @api runMode = RUN_MODES.PLAYER;
  @api jsonDef;
  @api jsonData;
  @api jsonDataStr;
  @api scriptHeaderDef;
  _jsonDef;
  @api mode;
  _svgIcon = "";

  get _isDesignMode() {
    return this.runMode === RUN_MODES.DESIGNER;
  }

  /**
   * Triggers adding a new edit block for Cards and LongCards
   */
  handleAdd() {
    if (this._isCards && this.scriptHeaderDef && this.scriptHeaderDef.uuid) {
      pubsub.fire(
        this._jsonDef.name + "_" + this.scriptHeaderDef.uuid,
        "data",
        { add: true, addIndex: this.jsonDef.eleArray.length - 1 }
      );
    }
  }

  /**
   * Handles "Enter" or "Space" keys for triggering Add
   */
  handleKeyboardAdd(evt) {
    if (evt.keyCode === 13 || evt.keyCode === 32) {
      evt.preventDefault();
      this.handleAdd();
    }
  }

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

    let templateName = this._propSetMap.HTMLTemplateId;

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

    this._newLabel = this._propSetMap.newLabel;
    // override with action
    if (this._propSetMap.newAction) {
      this._newLabel = this._propSetMap.newAction.propSetMap.label;
    }

    this._allowNew = this._propSetMap.allowNew;
  }

  connectedCallback() {
    if (this.jsonDef) {
      this._jsonDef = this.jsonDef.eleArray[0];
      if (!this._jsonDef) {
        return;
      }
      this._propSetMap = this._jsonDef.propSetMap;
      this.mode = this._propSetMap.mode;
      this._theme = this.layout === "newport" ? "nds" : "slds";
      this._svgIcon =
        this._propSetMap.svgSprite + ":" + this._propSetMap.svgIcon;
      this._multiLang = this.scriptHeaderDef.multiLang;
      if (this._multiLang && !this._isDesignMode) {
        this._propSetMap = JSON.parse(JSON.stringify(this._jsonDef.propSetMap));
        handleMultiLangLabel(
          this._jsonDef.type,
          this._propSetMap,
          this.scriptHeaderDef.allCustomLabels
        );
        // translate the global action's properties
        if (this._propSetMap.newAction) {
          handleMultiLangLabel(
            this._propSetMap.newAction.type,
            this._propSetMap.newAction.propSetMap,
            this.scriptHeaderDef.allCustomLabels
          );
        }
      }
      this.initCompVariables();

      if (this._isCards) {
        if (!this._focusPubsubObj) {
          this._focusPubsubObj = {
            data: this.focusOnNew.bind(this)
          };
          pubsub.register(
            "focusToNewButton_" +
              this._jsonDef.name +
              this.scriptHeaderDef.uuid,
            this._focusPubsubObj
          );
        }
        if (!this._isDesignMode) {
          this.classList.add(`${this._theme}-large-size_3-of-12`);
          this.classList.add(`${this._theme}-medium-size_6-of-12`);
          this.classList.add(`${this._theme}-small-size_1-of-1`);
          this.classList.add(`${this._theme}-m-bottom_xx-small`);
        } else {
          this.classList.add(`${this._theme}-size_1-of-1`);
        }
        if (this.layout !== "newport") {
          this.classList.add(`${this._theme}-p-right_small`);
        }
      }
    }
  }

  render() {
    if (this._isDesignMode) {
      this.initCompVariables();
    }
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  disconnectedCallback() {
    if (this._focusPubsubObj) {
      pubsub.unregister(
        "focusToNewButton_" + this._jsonDef.name + this.scriptHeaderDef.uuid,
        this._focusPubsubObj
      );
    }
  }

  focusOnNew() {
    Promise.resolve().then(() => {
      const newEl = this.template.querySelector(".editblock-new");
      if (newEl) {
        newEl.focus();
      }
    });
  }
}
