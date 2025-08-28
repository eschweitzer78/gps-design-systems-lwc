import { OmniscriptBaseActionUtil } from "./omniscriptBaseActionUtil";
import { getHttpRemoteOptions } from "./httpActionHelpers";

export class OmniscriptHttpSoapNcApexActionUtil extends OmniscriptBaseActionUtil {
  // this._element is passed from the constructor

  /**
   * @description Performs preprocessing of the HTTP call parameters prior to invoking action. This method is called
   *              in the inherited executeAction prior to inherited invokeAction.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    const httpParams = {
      sClassName: `${this._ns}DefaultOmniScriptNamedCredentialCallout`,
      sMethodName: "NCCallout",
      respId: queueableRespId,
      remoteOptions: getHttpRemoteOptions(
        comp,
        this._element,
        this.getCompJsonData(comp)
      )
    };

    if (this._element.propSetMap.type === "Apex") {
      httpParams.sClassName = `${this._ns}DefaultOmniscriptApexRestService`;
      httpParams.sMethodName = "generateApexRestRequest";
    }

    if (this._element.propSetMap.restOptions.sendBody) {
      payload = payload ? payload : this.getCompJsonData(comp);
    }

    const input = this.getSendResponseJSONUtil(
      payload,
      this._element.propSetMap.sendJSONPath,
      this._element.propSetMap.sendJSONNode,
      this._element.JSONPath,
      comp.scriptHeaderDef.labelMap,
      this._element.propSetMap.sendOnlyExtraPayload
    );

    return this.preProcessCommonReq(
      comp,
      this._element,
      httpParams,
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
    let httpResp;

    if (resp.responseResult) {
      try {
        resp = JSON.parse(resp.responseResult);
      } catch (error) {
        resp = resp.responseResult;
      }
    }

    if (element.propSetMap.type === "Apex") {
      httpResp = resp.result || resp;
    } else {
      httpResp = resp.NCCallresp || resp;
    }

    if (httpResp && typeof httpResp !== "object") {
      try {
        httpResp = JSON.parse(httpResp);
      } catch (error) {
        httpResp = {
          error: comp.scriptHeaderDef.allCustomLabels
            ? comp.scriptHeaderDef.allCustomLabels.OmniDesInvalidJson
            : "OmniDesInvalidJson"
        };
      }
    }

    return super.evaluateResp(element, httpResp, bSendToDebugConsole, comp);
  }

  /**
   * @description Parses the action's raw response. Returns parsed response object. This method is called immediately
   *              after the response is received from the server. Calls the inherited parseRawResponse in order to get
   *              the correct time tracking then further parses the response.
   * @param {*} comp
   * @param {*} rawResponse
   * @returns {*} Primarily will return an object but can return other data types except for Strings
   */
  parseRawResponse(comp, rawResponse) {
    let parsedResponse = super.parseRawResponse(comp, rawResponse);

    if (parsedResponse.NCCallresp) {
      try {
        parsedResponse.NCCallresp = JSON.parse(parsedResponse.NCCallresp);
      } catch (error) {
        // Do nothing, further parsing is not needed
      }
    } else if (parsedResponse.result) {
      try {
        parsedResponse.result = JSON.parse(parsedResponse.result);
      } catch (error) {
        // Do nothing, further parsing is not needed
      }
    }

    return parsedResponse;
  }
}
