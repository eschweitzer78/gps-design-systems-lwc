import OmniscriptBaseElement from "c/sfGpsDsOsrtOmniscriptBaseElement";
import { HasValidation } from "c/sfGpsDsOsrtOmniscriptValidation";
import { showHideValidityHook } from "c/sfGpsDsOsrtOmniscriptValidation";
import {
  currencySymbol,
  isRepeatNotation
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * Atomic Base Element Component for Leaf element, this extends OmniscriptBaseElement
 * empty html template
 * Mixin HasValidation
 * Mask Helper
 */
export default class OmniscriptAtomicElement extends HasValidation(
  OmniscriptBaseElement
) {
  _maskProperties = {};
  _isMasked = false;
  _patternVal;
  _handleHelpText;
  _styleClasses = {};
  _savedJsonPath;

  /**
   * Custom mask parsing to determine decimal and thousands separator symbols
   * @param {String} mask
   */
  prepareCustomMask(mask) {
    // figure out if '.' , ',' , or ' ' is used for decimal/thousands separator
    let radix = null;
    let group = null;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "," || mask[i] === "." || mask[i] === " ") {
        group = radix;
        radix = i;
      }
    }

    // thousand and radix symbols are the same, ignore thousand symbol
    const thousandSeparator = mask[group] === mask[radix] ? "" : mask[group];
    this._maskProperties.thousandsSeparator = group
      ? thousandSeparator
      : this._maskProperties.thousandsSeparator;
    this._maskProperties.radix = radix
      ? mask[radix]
      : this._maskProperties.radix;

    const radixToEnd = radix ? mask.length - radix - 1 : 0;

    this._maskProperties.scale =
      radixToEnd >= 0 ? radixToEnd : this._maskProperties.scale;
    this._maskProperties.padFractionalZeros = radixToEnd !== 0;
  }

  /**
   *  Masking helper function
   *  1. if a mask provided (string), the logic determines the thousands and decimal separators
   *  2. if a mask provided (integer), set the scale
   *  3. if no mask is provided (null), number default case
   * */
  prepareIMaskProperties(mask, thousand, decimal) {
    this._maskProperties.radix = decimal || ".";
    this._maskProperties.thousandsSeparator = thousand != null ? thousand : ",";

    if (mask || typeof mask === "number") {
      // mask/format from currencySymbols list
      // thousand separator (group)
      // decimal separator (radix)
      this._isMasked = true;
      this._maskProperties.scale = typeof mask === "number" ? mask : null;
      this._maskProperties.padFractionalZeros =
        typeof mask === "number" && mask > 0;

      // handle custom mask
      if (typeof mask === "string") {
        this.prepareCustomMask(mask);
      }
    } else {
      // number default case (without a mask)
      this._maskProperties.scale = 1000;
      this._maskProperties.padFractionalZeros = false;
    }
  }

  initCompVariables() {
    super.initCompVariables();
    // assigns style classes
    this._styleClasses.container = `${this._theme}-grid`;
    this._styleClasses.input = `${this._theme}-container_fluid `;
    this.applyRepeatableStyles();
    this._savedJsonPath = this.jsonDef.JSONPath;

    if (this.jsonDef && this._propSetMap && this._propSetMap.pattern) {
      this._patternVal = this._propSetMap.pattern;
    }

    if (this.jsonDef && this._propSetMap && this._propSetMap.help) {
      this._handleHelpText = this._propSetMap.helpText;
    }

    if (this.jsonDef && this._propSetMap && this._propSetMap.autocomplete) {
      this._autocomplete = this._propSetMap.autocomplete;
    }
  }

  /**
   * @scope private
   * @description Applies class styles to support repeat / repeat clone features for all atomic inputs.
   * @return {Void}
   */
  applyRepeatableStyles() {
    const prefix = this._theme;

    if (this.jsonDef && this._propSetMap && this._propSetMap.repeat) {
      this._styleClasses.repeatAdd = `${prefix}-button_reset ${prefix}-m-right_x-small `;
      this._styleClasses.repeatIcons = `${prefix}-button__icon ${prefix}-button__icon_small `;
      this._styleClasses.repeatRemove = `${this._styleClasses.repeatAdd} `;
      this._styleClasses.repeatContainer = "omni-repeat-button-group ";

      if (this.layout === "newport") {
        this._styleClasses.input += "nds-input-has-icon_right";
        this._styleClasses.repeatContainer +=
          "nds-button-group nds-m-right_x-small nds-tooltip__container";
        this._styleClasses.repeatAdd +=
          "vlocity-btn nds-button nds-button_icon nds-m-right_x-small";
        this._styleClasses.repeatRemove +=
          "vlocity-btn nds-button nds-button_icon";
      } else {
        this._styleClasses.repeatContainer +=
          "slds-button-group omni-repeat-button-group";
        this._styleClasses.repeatIcons += "slds-grid";
        this._styleClasses.input = " omni-repeat-input ";
      }
    }
  }

  validityHook(newShow) {
    showHideValidityHook(newShow, this);
  }

  // use this to validate the api data
  // derived components can overwrite it
  validateData(data) {
    // default - String
    return {
      valid: typeof data === "string" || data === null,
      dataToApply: data
    };
  }

  setElementFormattedValue() {
    super.setElementFormattedValue();
    if (this.childInput && this._isMasked) {
      this._elementFormattedValue = this.childInput.maskedValue;
    }
    if (this._elementFormattedValue != null) {
      this.dispatchOmniEventUtil(
        this,
        { node: this.jsonDef.JSONPath, value: this._elementFormattedValue },
        "omniformatteddata"
      );
    }
  }

  // Masking helper function
  getImaskCurrencyAttributes() {
    let imaskAttributes = null;
    if (!this.childInput) {
      const currencyCode = this.getCurrencyCode();
      const currencyInfo = currencySymbol[currencyCode];
      const DEFAULT_CURRENCY_SCALE = 2;
      const propMask =
        this._propSetMap.mask == null
          ? DEFAULT_CURRENCY_SCALE
          : this._propSetMap.mask;

      // thousand separator (group), decimal separator (radix)
      this.prepareIMaskProperties(
        propMask,
        currencyInfo.group,
        currencyInfo.decimal
      );

      imaskAttributes = {
        mask: this.getCurrencySymbol() + " num",
        numberMask: true,
        currency: true,
        blocks: {
          num: {
            // TODO: move convert imask options to single attributes.
            // eslint-disable-next-line no-new-wrappers
            mask: new Number(),
            scale: this._maskProperties.scale,
            thousandsSeparator: this._propSetMap.hideGroupSep
              ? ""
              : this._maskProperties.thousandsSeparator,
            radix: this._maskProperties.radix,
            signed: this._propSetMap.allowNegative,
            padFractionalZeros: this._maskProperties.padFractionalZeros
          }
        }
      };
    }
    return imaskAttributes;
  }

  // Masking helper function
  getImaskNumberAttributes() {
    let imaskAttributes = null;
    if (!this.childInput) {
      const radix = ".";
      const thousandsSeparator = "";
      this.prepareIMaskProperties(
        this._propSetMap.mask,
        thousandsSeparator,
        radix
      );
      imaskAttributes = {
        // TODO: move convert imask options to single attributes.
        // eslint-disable-next-line no-new-wrappers
        mask: new Number(),
        numberMask: true,
        scale: this._maskProperties.scale,
        thousandsSeparator: this._maskProperties.thousandsSeparator,
        radix: this._maskProperties.radix,
        signed: true,
        padFractionalZeros: this._maskProperties.padFractionalZeros
      };
    }
    return imaskAttributes;
  }

  getCurrencyCode() {
    return (
      this.jsonData.OmniScriptCurrencyCode ||
      this.scriptHeaderDef.propSetMap.currencyCode ||
      this.jsonData.userCurrencyCode
    );
  }

  /**
   * @returns currency symbol or currency code
   */
  getCurrencySymbol() {
    let currencyCode = this.getCurrencyCode();
    let currencyInfo = this.getCurrencyInfo(currencyCode);

    return this._propSetMap.displayCurrencyCode
      ? currencyInfo.code
      : currencyInfo.text;
  }

  /**
   * If currencyCode is specified (default to USD)
   *
   * @param {String} currencyCode
   * @returns an Object containing currency format, separators, symbol
   */
  getCurrencyInfo(currencyCode) {
    let code = currencyCode;
    if (!currencySymbol.hasOwnProperty(currencyCode)) {
      code = "USD";
    }
    let currencyInfo = currencySymbol[code];
    currencyInfo.code = code;

    return currencyInfo;
  }

  get defaultValue() {
    if (
      this._propSetMap.defaultValue != null &&
      typeof this._propSetMap.defaultValue === "string" &&
      this._propSetMap.defaultValue.indexOf("%") >= 0
    ) {
      return this.handleMergeFieldUtil(
        this._propSetMap.defaultValue,
        this.jsonData,
        this.scriptHeaderDef.labelMap,
        isRepeatNotation(this._propSetMap.defaultValue)
          ? this.jsonDef.JSONPath
          : null
      );
    }

    return this._propSetMap.defaultValue;
  }

  stateRefresh() {
    if (
      this._savedJsonPath !== this.jsonDef.JSONPath &&
      this._elementFormattedValue != null
    ) {
      this.setElementFormattedValue();
      this._savedJsonPath = this.jsonDef.JSONPath;
    }
  }

  omniRORequired(ckValidity) {
    // Angular - if the property readOnly is set to true in the designer, we don't run conditional readonly watch
    // LWC - OWC-1239, the conditional readonly watch will run no matter whether readOnly is true or false
    // Angular - if the property required is set to false in the designer, we don't run conditional required watch
    // LWC - OWC-1239, the conditional required watch will run no matter whether required is true or false
    if (this._propSetMap.conditionType === "Readonly if False") {
      let ro = this.evalConditionUtil(this.jsonDef, "show", this);
      this._propSetMap = Object.assign({}, this._propSetMap, { readOnly: !ro });
      this.setReadOnly(!ro);
    } else if (this._propSetMap.conditionType === "Optional if False") {
      let req = this.evalConditionUtil(this.jsonDef, "show", this);
      if (req !== this._propSetMap.required) {
        this._propSetMap = Object.assign({}, this._propSetMap, {
          required: req
        });
        Promise.resolve().then(() => {
          if (req === true || ckValidity) {
            this.checkValidity();
          } else {
            this.reportValidity();
          }
        });
      }
    }
  }
}
