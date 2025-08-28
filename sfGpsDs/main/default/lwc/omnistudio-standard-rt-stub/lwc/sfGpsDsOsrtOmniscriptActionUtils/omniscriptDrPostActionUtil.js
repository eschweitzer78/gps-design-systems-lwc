import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

export class OmniscriptDrPostActionUtil extends OmniscriptBaseActionUtil {
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
    const drPostParams = {
      sClassName: `${this._ns}DefaultDROmniScriptIntegration`,
      sMethodName: "invokeInboundDR",
      respId: queueableRespId
    };
    const input = {
      objectList: this.getSendResponseJSONUtil(
        payload ? payload : this.getCompJsonData(comp),
        this._element.propSetMap.sendJSONPath,
        this._element.propSetMap.sendJSONNode,
        this._element.JSONPath,
        comp.scriptHeaderDef.labelMap,
        this._element.propSetMap.sendOnlyExtraPayload
      ),
      bundleName: this._element.propSetMap.bundle
    };

    if (input.objectList) {
      input.objectList.contextId = input.objectList.ContextId;
    }

    return this.preProcessCommonReq(
      comp,
      this._element,
      drPostParams,
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
      resp.IBDRresp || resp,
      bSendToDebugConsole,
      comp
    );
  }

  /**
   * @description Performs post processing of the executed action's response. postProcess hook. Overwrites inherited
   *              postProcessHelper.
   * @param {Object} resp
   * @param {Object} element
   * @param {*} comp
   * @returns {Object}
   */
  postProcessHelper(resp, element, comp) {
    const processedResp = super.postProcessHelper(resp, element, comp);

    if (processedResp.vlcValidationErrors) {
      return {
        vlcValidationErrors: processedResp.vlcValidationErrors
      };
    }

    const resultResp = {};
    const { createdObjectsByType } = processedResp;
    const recMap = createdObjectsByType[element.propSetMap.bundle];

    if (recMap) {
      // Recreates JSON -> { DRId_bundle : 'someValue' }
      for (let key in recMap) {
        if (recMap.hasOwnProperty(key)) {
          const data = recMap[key];

          if (data && Array.isArray(data) && data.length === 1) {
            resultResp[`DRId_${key}`] = data[0];
          }
        }
      }
    }

    return resultResp;
  }

  /**
   * @description Checks response for errors. Overwrites inherited checkResponseForError.
   * @param {Object} resp
   * @returns {Boolean}
   */
  checkResponseForError(resp) {
    if (super.checkResponseForError(resp)) {
      return true;
    } else if (resp.hasErrors && resp.hasOwnProperty("errors")) {
      return true;
    } else if (
      typeof resp.vlcValidationErrors === "object" &&
      Object.keys(resp.vlcValidationErrors).length > 0
    ) {
      return false;
    }

    return false;
  }
}
