import { handleExpressionEngine } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

export class OmniscriptSetValuesUtil extends OmniscriptBaseActionUtil {
  // this._element is passed from the constructor

  /**
   * @description Preprocesses data. Overwrites inherited preProcess.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    const data = { error: false };

    if (this._element.propSetMap.elementValueMap) {
      data.result = this.processValueMap(
        this._element.propSetMap.elementValueMap,
        comp
      );
    }

    return Promise.resolve(data);
  }

  /**
   * @description Processes element's property set value map.
   * @param {Object} valueMap
   * @param {*} comp
   * @returns {Object}
   */
  processValueMap(valueMap, comp) {
    const newObj = Object.assign({}, valueMap);
    const compJsonData = this.getCompJsonData(comp);
    const labelMap = comp.scriptHeaderDef.labelMap;
    const jsonPath = comp?.jsonDef?.JSONPath;

    // process an expression if it starts with `=`
    let resolvedValue = this.processAnyExpressions(
      newObj,
      comp.jsonDef,
      compJsonData,
      labelMap
    );
    // even though expression engine can do token replacement, if it wasn't an expression we have to do this
    // we unfortunately can't pass the string to expression engine because it might be in the format "Please call STRING() %ABC%"
    // The expression engine would barf on the above so have to then do merge tokens seperately.
    // also to keep backwards compatible if the expression engine did run and returned a value like "Hello %ABC%" then we'd need
    // to do token replacement on it here otherwise we may break existing behaviour.
    return JSON.parse(
      this.handleMergeFieldUtil(
        JSON.stringify(resolvedValue),
        compJsonData,
        labelMap,
        jsonPath
      )
    );
  }

  processAnyExpressions(valueToProcess, compJsonDef, compJsonData, labelMap) {
    if (typeof valueToProcess == "string") {
      return handleExpressionEngine(
        valueToProcess,
        compJsonDef,
        compJsonData,
        labelMap
      );
    } else if (Array.isArray(valueToProcess)) {
      return valueToProcess.map((value) => {
        return this.processAnyExpressions(
          value,
          compJsonDef,
          compJsonData,
          labelMap
        );
      });
    } else if (!!valueToProcess && valueToProcess.constructor === Object) {
      return Object.fromEntries(
        Object.entries(valueToProcess).map(([key, val]) => [
          this.processAnyExpressions(key, compJsonDef, compJsonData, labelMap),
          this.processAnyExpressions(val, compJsonDef, compJsonData, labelMap)
        ])
      );
    }

    // for backwards compatibility we have to turn date's back into a String
    if (valueToProcess instanceof Date) {
      return valueToProcess.toISOString();
    }
    return valueToProcess;
  }
}
