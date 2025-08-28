import { sendRequest } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";
import { getHttpRemoteOptions } from "./httpActionHelpers";

export class OmniscriptHttpWebActionUtil extends OmniscriptBaseActionUtil {
  // this._element is passed from the constructor

  _httpWebRequestParams = {};

  /**
   * @description Performs preprocessing of the parameters prior to invokeAction. This method was overwritten to
   *              handle specific preprocessing needed for HTTP Web actions. Returning object will be passed into the
   *              invokeAction where then it will getConfigForActionService.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    const remoteOptions = getHttpRemoteOptions(
      comp,
      this._element,
      this.getCompJsonData(comp)
    );
    params = {
      method: this._element.propSetMap.restMethod || "GET",
      url: remoteOptions.restOptions.restPath,
      data: this.getSendResponseJSONUtil(
        payload ? payload : this.getCompJsonData(comp),
        this._element.propSetMap.sendJSONPath,
        this._element.propSetMap.sendJSONNode,
        this._element.JSONPath,
        comp.scriptHeaderDef.labelMap,
        this._element.propSetMap.sendOnlyExtraPayload
      ),
      headers:
        typeof remoteOptions.restOptions.headers === "object" &&
        Object.keys(remoteOptions.restOptions.headers).length > 0
          ? remoteOptions.restOptions.headers
          : { Accept: "application/json, text/plain, */*" },
      params: remoteOptions.restOptions.params,
      uriEncode: this._element.propSetMap.restOptions.URIEncode,
      withCredentials:
        this._element.propSetMap.restOptions &&
        this._element.propSetMap.restOptions.withCredentials != null
          ? this._element.propSetMap.restOptions.withCredentials
          : false,
      async: true
    };

    this._httpWebRequestParams = Object.assign({}, remoteOptions);

    if (this._httpWebRequestParams.restOptions) {
      this._httpWebRequestParams.restOptions.headers = params.headers;
      this._httpWebRequestParams.restOptions.params = params.params;
    }

    return params;
  }

  /**
   * @description Gets the configuration for callActionService. This method is called in the invokeAction after data
   *              has been preprocessed. Returned object will be fed into the callActionService.
   * @param {Object} data
   * @returns {Object}
   */
  getConfigForActionService(data) {
    // Store the entire data input into a params key to be used in the callActionService.
    return {
      params: data
    };
  }

  /**
   * @description Calls the action service which will issue HTTP requests. This method was overwritten from
   *              omniscriptActionCommonUtil. This method will return a Promise where the response in the success and
   *              failure blocks will be processed downstream in postProcess/postProcessHelper.
   * @param {Object} config
   * @param {*} comp
   * @returns {Promise}
   */
  callActionService(config, comp) {
    return sendRequest(config.params, comp);
  }

  /**
   * @description Handles action events once response is obtained from remote call. Can be configured for sending
   *              events to Omniscript Designer Debug console. Configured for sending pubsub events.
   * @param {*} comp
   * @param {Object} resp
   * @param {Object} params
   * @param {Object} [element]
   */
  handleActionEvents(comp, resp, params, element) {
    // Call the inherited handleActionEvents with the Web parameters
    super.handleActionEvents(comp, resp, this._httpWebRequestParams, element);
  }

  /**
   * @description Performs specific postprocessing of the executed action's response. This method was overwritten from
   *              omniscriptBaseActionUtil. This method is called within the postProcess. This method only handles
   *              success responses. Failure responses get terminated prior to reaching this method.
   * @param {Object} resp
   * @param {Object} element
   * @param {*} comp
   * @returns {Object}
   */
  postProcessHelper(resp, element, comp) {
    return super.postProcessHelper({ data: resp }, element, comp);
  }
}
