/**
 * @module ns/omniscriptSelect
 * @description This component is used to render a multiselect element, This is extends from mixins class `OmniscriptOptionsMixin`, `OmniscriptAtomicElement`.
 * `OmniscriptOptionsMixin` mixin class is used for validating prefill data for select.
 */
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { OmniscriptOptionsMixin } from "c/sfGpsDsOsrtOmniscriptOptionsMixin";
import tmpl from "./sfGpsDsOsrtOmniscriptMultiselect.html";

/**
 * Default exported class OmniscriptMultiselect.
 * @extends OmniscriptOptionsMixin(OmniscriptAtomicElement)
 * @typicalname OmniscriptMultiselect
 */
export default class OmniscriptMultiselect extends OmniscriptOptionsMixin(
  OmniscriptAtomicElement
) {
  /**
   * @type {Boolean} - Checks whether horizontalMode is image or not
   * @scope private
   */
  _isImage = false;

  /**
   * @type {Boolean} - Checks whether image needs to display or not
   * @scope private
   */
  _isImageDisplay;

  /**
   * OnChange Event Handler. Applies the changed value directly to the response
   * @returns {void}
   * @scope private
   */
  handleChange(evt) {
    // ABD script crashes on 3rd step when there is a Multi-select
    if (evt && evt.target) {
      this.applyCallResp(evt.target.value);
    }
  }

  /**
   * Overwrites inherited checkOptions.
   * @param {arr} options - new options
   * @param {string} jResp
   * @returns {Object}
   */
  checkOptions(options, data) {
    if (data != null) {
      const jRespArr = data.split(";");
      let resp = "";

      for (let i = 0; i < options.length; i++) {
        // stores any valid jsonDef response as a string delimited by ';'
        if (options[i].value && jRespArr.indexOf(options[i].value) !== -1) {
          resp = resp + options[i].value + ";";
        }
      }

      // removes any outlier ';' that the loop may add
      if (resp.charAt(resp.length - 1) === ";") {
        resp = resp.substring(0, resp.length - 1);
      }

      // returns valid options
      return { valid: resp !== "" ? true : false, dataToApply: resp };
    }

    return { valid: true, dataToApply: null };
  }

  /**
   * @description Overwrites inherited initCompVariables.(this method executes once during connectedCallback.)
   * @returns {Void}
   * @scope private
   */
  initCompVariables() {
    super.initCompVariables();
    this._isImage = this._propSetMap.horizontalMode === "image" ? true : false;
    this._horizontalMode =
      this._propSetMap.horizontalMode === true ? "horizontal" : "vertical";
    this._isImageDisplay =
      this._propSetMap.optionSource.type === "image" ? true : false;
  }

  /**
   * @description Will dispach event(omniupdatejsondef) with detailed object
   * @param {Object} newOptions
   * @returns {Void}
   * @scope private
   */
  updatePropOptions(newOptions) {
    this.dispatchOmniEventUtil(
      this,
      {
        path: this._jsonPath + ":propSetMap",
        elementId: this._elementId,
        value: newOptions,
        node: "options"
      },
      "omniupdatejsondef"
    );
  }

  applyRepeatableStyles() {
    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      this._styleClasses.repeatAdd = `${this._theme}-button_reset ${this._theme}-m-right_x-small `;
      this._styleClasses.repeatIcons = `${this._theme}-button__icon ${this._theme}-button__icon_small `;
      this._styleClasses.repeatRemove = `${this._styleClasses.repeatAdd} `;
      this._styleClasses.repeatContainer = "omni-repeat-button-group ";

      if (this.layout !== "newport") {
        this._styleClasses.repeatContainer +=
          "slds-button-group slds-p-right_x-small";
        this._styleClasses.repeatIcons += "slds-m-bottom_xxx-small ";
      } else {
        this._styleClasses.repeatContainer += "nds-m-bottom_xx-small";
        this._styleClasses.repeatIcons += "nds-m-bottom_xxx-small";
      }
    }
  }

  /**
   * @description Determines if seed data is to be returned.
   * @returns {Boolean}
   * @scope private
   */
  seedOptions() {
    return this.jsonDef.bInit;
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
