import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

export class OmniscriptIpActionUtil extends OmniscriptBaseActionUtil {
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
    if (queueableRespId) {
      return super.preProcess(
        params,
        queueableRespId,
        comp,
        payload,
        vlcParams
      );
    }

    const ipParams = {
        sClassName: this._ns + "IPService",
        sMethodName: this._element.propSetMap.integrationProcedureKey,
        ParentInteractionToken: comp.scriptHeaderDef.uuid
      },
      input = this.getSendResponseJSONUtil(
        payload ? payload : this.getCompJsonData(comp),
        this._element.propSetMap.sendJSONPath,
        this._element.propSetMap.sendJSONNode,
        this._element.JSONPath,
        comp.scriptHeaderDef.labelMap,
        this._element.propSetMap.sendOnlyExtraPayload
      );

    return this.preProcessCommonReq(
      comp,
      this._element,
      ipParams,
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
    if (resp.IPResult && resp.IPResult.vlcStatus) {
      return {
        error: false,
        result: resp.IPResult
      };
    }

    return super.evaluateResp(
      element,
      resp.IPResult || resp,
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
    if (
      resp.hasOwnProperty("vlcIPData") &&
      resp.hasOwnProperty("vlcStatus") &&
      resp.vlcStatus === "InProgress"
    ) {
      return Promise.resolve({
        options: JSON.stringify(resp),
        input: this._vlcInput
      });
    }

    return super.postProcessHelper(resp, element, comp);
  }
}
