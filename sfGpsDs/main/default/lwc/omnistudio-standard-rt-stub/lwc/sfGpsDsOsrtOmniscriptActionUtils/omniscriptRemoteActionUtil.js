import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";

/**
 * Omniscript Remote Action Utility Class
 */
export class OmniscriptRemoteActionUtil extends OmniscriptBaseActionUtil {
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

    const input = this.getSendResponseJSONUtil(
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
      params,
      input,
      vlcParams
    );
  }
}
