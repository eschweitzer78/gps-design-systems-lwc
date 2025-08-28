import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

export class OmniscriptDrTransformActionUtil extends OmniscriptBaseActionUtil {
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
    const drTransformParams = {
      sClassName: `${this._ns}DefaultDROmniScriptIntegration`,
      sMethodName: "invokeTransformDR",
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
      drTransformParams,
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
      resp.TFDRresp,
      bSendToDebugConsole,
      comp
    );
  }

  /**
   * @description Checks response for errors. Overwrites inherited checkResponseForError.
   * @param {Object} resp
   * @returns {Boolean}
   */
  checkResponseForError(resp) {
    if (super.checkResponseForError(resp)) {
      return true;
    }

    if (resp.vlcValidationErrors) {
      return true;
    }

    return false;
  }
}
