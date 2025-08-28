/**
 * @module ns/omniscriptFormula
 * @description This component is used for formulas
 */
import { track, api } from "lwc";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { evaluate } from "c/sfGpsDsOsrtExpressionEngine";
import {
  getElementValue,
  isRepeatNotation
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { dateFormatCompatability } from "c/sfGpsDsOsrtOmniscriptUtils";
import dayjs from "c/sfGpsDsOsrtDayjs";

import tmpl from "./sfGpsDsOsrtOmniscriptFormula.html";

/**
 * @module ns/omniscriptFormula
 * @extends OmniscriptAtomicElement
 * @typicalname omniscriptFormula
 */
export default class OmniscriptFormula extends OmniscriptAtomicElement {
  _isCurrency;
  _isNumber;
  _isDate;
  _isBoolean;
  _isText;
  _imaskAttributes;

  @track renderedValue;

  initCompVariables() {
    super.initCompVariables();
    switch (this._propSetMap.dataType) {
      case "Currency":
        this._isCurrency = true;
        this._propSetMap = Object.assign({}, this._propSetMap, {
          allowNegative: true
        });
        this._imaskAttributes = this.getImaskCurrencyAttributes();
        break;
      case "Number":
        this._isNumber = true;
        this._imaskAttributes = this.getImaskNumberAttributes();
        break;
      case "Boolean":
        this._isBoolean = true;
        break;
      case "Date":
        this._isDate = true;
        break;
      default:
        this._isText = true;
    }
  }

  stateRefresh() {
    let expression = this._propSetMap.expression;
    switch (this._propSetMap.dataType) {
      case "Number": // intentionally fall through
      case "Currency":
        expression = `NUMBER(${expression})`;
        break;
      case "Date": {
        expression = `MOMENT(DATE(${expression}))`;
        break;
      }
      case "Boolean":
        expression = `BOOLEAN(${expression})`;
        break;
      case "Text":
        expression = `STRING(${expression})`;
        break;
      default: // do nothing
    }

    let usedCached = true,
      randomNumberRequestCount = 0;
    if (
      !this.cachedRandomValues ||
      Date.now() - this.cachedValuesLastCreated > 500
    ) {
      this.cachedValuesLastCreated = Date.now();
      this.cachedRandomValues = [];
      usedCached = false;
    }
    try {
      let newFormulaValue = evaluate(
        expression,
        (token) => {
          return getElementValue(
            token,
            this._jsonData,
            this.scriptHeaderDef.labelMap,
            isRepeatNotation(token) ? this.jsonDef.JSONPath : null
          );
        },
        false,
        () => {
          if (usedCached && this.cachedRandomValues[randomNumberRequestCount]) {
            return this.cachedRandomValues[randomNumberRequestCount++];
          }
          randomNumberRequestCount++;
          let newRandom = Math.random();
          this.cachedRandomValues.push(newRandom);
          return newRandom;
        }
      );

      if (!this.lodashUtil.isEqual(newFormulaValue, this.elementValue)) {
        // Formula set should not trigger any validation, therefore directly set this.elementValue
        this.elementValue = newFormulaValue;
        newFormulaValue =
          this._imaskAttributes && this._propSetMap.dataType === "Currency"
            ? String(newFormulaValue)
            : newFormulaValue;
        this.setRenderedValue(newFormulaValue);
        this.setElementFormattedValue();
        this.dispatchOmniEventUtil(
          this,
          this.createAggregateNode(),
          "omniaggregate"
        );
      }
      super.stateRefresh();
    } catch (e) {
      console.error("Invalid runtime formula found", e);
    }
  }

  // to prevent Formula to be set
  validateData(data) {
    return { valid: false, dataToApply: data };
  }

  connectedCallback() {
    super.connectedCallback();
    this.setRenderedValue(this.elementValue);

    // we ONLY add slds-hide if hide is true
    // AND we're not in the designer
    if (!this._isDesignMode && this._propSetMap.hide === true) {
      this.classList.add(`${this._theme}-hide`);
    }
  }

  setRenderedValue(value) {
    if (this._imaskAttributes && this.childInput) {
      this.renderedValue = value;
      this.childInput.typedValue = value;
    } else if (this._propSetMap.dataType === "Date") {
      if (dayjs(value).isValid()) {
        const dateFormatString = this._propSetMap.dateFormat
          ? dateFormatCompatability(this._propSetMap.dateFormat, true)
          : "";
        this.renderedValue = dayjs(value).format(dateFormatString);
      } else {
        this.renderedValue = null;
      }
    } else {
      this.renderedValue = this.elementValue;
    }
  }

  render() {
    return tmpl;
  }

  // eslint-disable-next-line no-unused-vars
  @api applyCallResp(json, bApi = false, bValidation = false) {}
}
