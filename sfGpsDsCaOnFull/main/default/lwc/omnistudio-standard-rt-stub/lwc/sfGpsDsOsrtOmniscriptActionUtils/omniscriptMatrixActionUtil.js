import { getElementValue } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

/**
 * Omniscript Matrix Action Utility Class
 */
export class OmniscriptMatrixActionUtil extends OmniscriptBaseActionUtil {
  /**
   * @description Preprocesses remote call parameters prior to invoking action. Overwrites inherited preProcess.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    let control = JSON.parse(JSON.stringify(this._element)),
      option = control.propSetMap.remoteOptions,
      input = { matrixData: [{}] },
      inputParams = control.propSetMap["matrix Input Parameters"];
    control.propSetMap.preTransformBundle = null;

    if (inputParams && Array.isArray(inputParams)) {
      for (let j = 0; j < inputParams.length; j++) {
        let eleName = inputParams[j].name,
          inputEleVal = getElementValue(
            eleName,
            this.getCompJsonData(comp),
            comp.scriptHeaderDef.labelMap,
            this.isRepeatNotationUtil(eleName) ? comp.jsonDef.JSONPath : null
          );
        // CMT 100, Support Matrix Action in Edit Block.
        if (
          comp.jsonDef &&
          comp.jsonDef.type === "Edit Block" &&
          Array.isArray(inputEleVal) &&
          payload
        )
          inputEleVal = inputEleVal[comp.jsonDef.index];

        if (Array.isArray(inputEleVal)) {
          for (let i = 0; i < inputEleVal.length; i++) {
            if (input.matrixData.length - 1 < i) {
              input.matrixData.push({});
            }
            input.matrixData[i][inputParams[j].value] = inputEleVal[i];
          }
        } else {
          input.matrixData[0][inputParams[j].value] = inputEleVal;
        }
      }
    }

    option.PricingMatrixId = option.matrixName;
    option.defaultMatrixResult = control.propSetMap.defaultMatrixResult;

    // Mergefield for executionDateTime will be processed in the preProcessCommonReq
    if (control.propSetMap.executionDateTime) {
      option.executionDateTime = control.propSetMap.executionDateTime;
    }

    option.useQueueableApexRemoting =
      control.propSetMap.useQueueableApexRemoting === true;

    return this.preProcessCommonReq(
      comp,
      control,
      {
        sClassName: `${this._ns}DefaultOmniScriptMatrix`,
        sMethodName: "calculate"
      },
      input,
      vlcParams
    );
  }

  /**
   * @description Evaluates the response and dispatches relevant information to the Debug Console. Returns an object
   *              in the format of {error: boolean, errorMsg: 'message', result: resp}
   * @param {Object} element
   * @param {Object} resp
   * @param {Boolean} bSendToDebugConsole
   * @param {*} comp
   * @returns {Object}
   */
  evaluateResp(element, resp, bSendToDebugConsole, comp) {
    return super.evaluateResp(
      element,
      resp.matrixResult ? resp.matrixResult[0] : resp,
      bSendToDebugConsole,
      comp
    );
  }
}
