import { OmniscriptSetValuesUtil } from "./omniscriptSetValuesUtil";

export class OmniscriptSetErrorsUtil extends OmniscriptSetValuesUtil {
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

    if (this._element.propSetMap.elementErrorMap) {
      data.result = {
        vlcValidationErrors: this.processValueMap(
          this._element.propSetMap.elementErrorMap,
          comp
        )
      };
    }

    return Promise.resolve(data);
  }
}
