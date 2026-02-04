import { getElementValue } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

export class OmniscriptDrExtractActionUtil extends OmniscriptBaseActionUtil {
  // this._element is passed from the constructor

  /**
   * @description Preprocesses remote call parameters prior to invoking action. Overwrites inherited preProcess.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    const drExtractParams = {
      sClassName: `${this._ns}DefaultDROmniScriptIntegration`,
      sMethodName: "invokeOutboundDR",
      respId: queueableRespId
    };
    let input = { Bundle: this._element.propSetMap.bundle };
    let queryCriteria = {};
    const drInputParams =
      this._element.propSetMap["dataRaptor Input Parameters"];

    if (drInputParams && Array.isArray(drInputParams)) {
      for (let i = 0; i < drInputParams.length; i++) {
        queryCriteria[drInputParams[i].inputParam] = getElementValue(
          drInputParams[i].element,
          this.getCompJsonData(comp),
          comp.scriptHeaderDef.labelMap,
          this.isRepeatNotationUtil(drInputParams[i].element)
            ? comp.jsonDef.JSONPath
            : null
        );
      }

      input = { ...input, DRParams: queryCriteria };
    }

    return this.preProcessCommonReq(
      comp,
      this._element,
      drExtractParams,
      input,
      vlcParams
    );
  }

  /**
   * @description Evaluates the response and dispatches relevant information to the Debug Console. Overwrites
   *              inherited evaluateResp.
   * @param {Object} element
   * @param {Object} resp
   * @param {Boolean} bSendToDebugConsole
   * @param {*} comp
   * @returns {Object}
   */
  evaluateResp(element, resp, bSendToDebugConsole, comp) {
    if (resp.responseResult) {
      try {
        resp = JSON.parse(resp.responseResult);
      } catch (error) {
        resp = resp.responseResult;
      }
    }

    return super.evaluateResp(
      element,
      resp.OBDRresp,
      bSendToDebugConsole,
      comp
    );
  }
}
