import {
  handleMergeField,
  getSendResponseJSON,
  isRepeatNotation,
  handleErrorReplace,
  handleExtraPayload
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import * as _ from "c/sfGpsDsOsrtLodash";
import { OmniscriptActionCommonUtil } from "./omniscriptActionCommonUtil";

export class OmniscriptBaseActionUtil extends OmniscriptActionCommonUtil {
  // utilities
  handleMergeFieldUtil = handleMergeField;
  getSendResponseJSONUtil = getSendResponseJSON;
  isRepeatNotationUtil = isRepeatNotation;
  lodashUtil = _;

  // private variables
  _compJsonData;
  _vlcInput = "{}";

  /**
   * @description Performs preprocessing of an action's request parameters.
   * @param {*} comp
   * @param {Object} element
   * @param {Object} params - predefined parameters (for remoteOptions, sClassName, and sMethodName)
   * @param {Object} input
   * @param {Object} [vlcParams] - predefined parameters from Promise filled responses
   * @param {Boolean} [bypassRemoteOptionsMf] - temporary flag to bypass remote option mergefields
   * @returns {Object}
   */
  preProcessCommonReq(
    comp,
    element,
    params,
    input,
    vlcParams,
    bypassRemoteOptionsMf = false
  ) {
    /**
     * NOTE: Mergefield logic for extraPayload is handled in this method and should not be handled separately to
     * prevent duplication.
     */

    // OWC-986 params has already run through handleMergeFieldUtil, if URIEncode = true
    // the string will contain %, therefore will fail the next handleMergeFieldUtil
    let options = element.propSetMap.remoteOptions
      ? Object.assign({}, element.propSetMap.remoteOptions)
      : params.remoteOptions || {};

    if (
      element.propSetMap.remoteClass &&
      element.propSetMap.remoteClass.indexOf(
        "DefaultOmniScriptTypeAheadLookup"
      ) >= 0 &&
      comp &&
      comp.jsonDef &&
      comp.jsonDef.type === "Type Ahead" &&
      comp.jsonDef.propSetMap &&
      !comp.jsonDef.propSetMap.enableLookup
    ) {
      options.searchString = comp.elementValue;
    }

    let sClassName =
      (params && params.sClassName) || element.propSetMap.remoteClass;
    let sMethodName =
      (params && params.sMethodName) || element.propSetMap.remoteMethod;
    input = input || {};

    if (element.propSetMap.remoteOptions && bypassRemoteOptionsMf === false) {
      // handles mergefields for remote options
      const optionsStr = JSON.stringify(options);
      const mfOptionsStr = this.handleMergeFieldUtil(
        optionsStr,
        this.getCompJsonData(comp),
        comp.scriptHeaderDef.labelMap,
        this.isRepeatNotationUtil(optionsStr) ? element.JSONPath : null
      );
      options = JSON.parse(mfOptionsStr);
    }

    if (
      element &&
      element.propSetMap.extraPayload &&
      Object.getOwnPropertyNames(element.propSetMap.extraPayload).length > 0
    ) {
      input = handleExtraPayload(
        element.propSetMap.extraPayload,
        input,
        comp,
        this.getCompJsonData(comp)
      );
    }

    options.useQueueableApexRemoting =
      options.useQueueableApexRemoting ||
      element.propSetMap.useQueueableApexRemoting === true;
    options.ignoreCache = element.propSetMap.ignoreCache === true || false;

    if (options.restOptions) {
      options.restOptions = {
        ...options.restOptions,
        timeout: undefined // Timeout is not needed in LWC
      };
    }

    // Adds vlcFilesMap in the payload, if applicable
    if (
      comp &&
      comp.scriptHeaderDef &&
      typeof comp.scriptHeaderDef.filesMap === "object" &&
      Object.keys(comp.scriptHeaderDef.filesMap).length > 0
    ) {
      options.vlcFilesMap = comp.scriptHeaderDef.filesMap;
    }

    // Adds ParentInteractionToken if ParentInteractionToken is present in request params
    if (params && params.ParentInteractionToken) {
      options.ParentInteractionToken = params.ParentInteractionToken;
    }

    // Provides Apex Queueable support
    if (options.useQueueableApexRemoting) {
      // stores current class into options to be read in the VFActionFunctionController
      options.vlcClass = sClassName;
      options.vlcMethod = sMethodName;
      sClassName =
        this._ns + "VFActionFunctionController.VFActionFunctionControllerOpen";
      sMethodName = "runActionFunction";

      // Provides the callback for Queueable support
      if (params && params.respId) {
        sMethodName = "actionFunctionResult";
        options.stagingId = params.respId;
      }

      // Adds the input and options as strings to the options to prevent serialization in Apex
      options.options = JSON.stringify(options);
      options.input = JSON.stringify(input);
    }
    // Provides continuation support
    else if (!vlcParams) {
      options.vlcClass = sClassName;
      options.useContinuation = element.propSetMap.useContinuation === true;
    }
    // Provides chainable support
    else if (vlcParams) {
      options = vlcParams.options;
      input = vlcParams.input;
    }

    // W-10489204: Chainable requires input to be passed along through each of the calls
    if (
      element.propSetMap &&
      element.propSetMap.remoteOptions &&
      element.propSetMap.remoteOptions.chainable
    ) {
      this._vlcInput = input;
    }

    return { input, options, sClassName, sMethodName };
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
    // processes response for apex queueable
    if (resp.responseResult && !this.checkResponseForError(resp)) {
      try {
        resp = JSON.parse(resp.responseResult);
      } catch (error) {
        resp = resp.responseResult;
      }
    }

    const error = this.checkResponseForError(resp);
    const errorMsg = error
      ? handleErrorReplace(resp, comp._propSetMap, comp.scriptHeaderDef)
      : null;

    return {
      error: error,
      errorMsg: errorMsg,
      result: error === true ? {} : resp,
      source: element.name
    };
  }

  /**
   * @description Overwrites inherited postProcess.
   * @param {Object} resp
   * @param {Object} element
   * @param {*} comp
   * @param {Boolean} [failure]
   * @returns {Object}
   */
  postProcess(resp, element, comp, failure) {
    if (failure) {
      const errorMessage = handleErrorReplace(
        resp,
        comp._propSetMap,
        comp.scriptHeaderDef
      );

      return {
        error: true,
        errorMsg: errorMessage,
        result: {},
        source: element.name
      };
    }

    const evaledResp = this.evaluateResp(element, resp, true, comp);

    if (evaledResp.error === true) {
      return evaledResp;
    }

    evaledResp.result = this.postProcessHelper(
      evaledResp.result,
      element,
      comp
    );

    return evaledResp;
  }

  /**
   * @description Performs post processing of the executed action's response. This method is called within the
   *              postProcess. This method only handles successful responses. Failure responses get terminated prior
   *              to reaching this method. Returning object will be returned to the component.
   * @param {Object} resp
   * @param {Object} element
   * @param {*} comp
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  postProcessHelper(resp, element, comp) {
    // deletes error node that is passed from the generic invoke
    if (resp.error) {
      delete resp.error;
    }

    // deletes errorCode node that is passed from the generic invoke
    if (resp.errorCode) {
      delete resp.errorCode;
    }

    // OWC-843, when we process responseJSONPath and responseJSONNode, we don't need
    // the last two parameters
    return this.getSendResponseJSONUtil(
      resp,
      element.propSetMap.responseJSONPath,
      element.propSetMap.responseJSONNode
    );
  }

  /**
   * @description Checks response for errors.
   * @param {object} resp
   * @returns {boolean}
   */
  checkResponseForError(resp) {
    if (resp.error) {
      return resp.error !== "OK";
    }

    return false;
  }

  /**
   * @description Executes action flow. Starting point for the omniscript base action flow. Overwrites inherited
   *              executeAction.
   * @param {Object} params
   * @param {String} queueableId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Promise}
   */
  executeAction(params, queueableId, comp, payload, vlcParams) {
    // entry point, reset
    this._compJsonData = undefined;

    return super.executeAction(params, queueableId, comp, payload, vlcParams);
  }

  /**
   * @description Gets the component's data json by parsing jsonDataStr.
   * @param {*} comp
   * @returns {Object}
   */
  getCompJsonData(comp) {
    if (this._compJsonData !== undefined) {
      return this._compJsonData;
    }

    if (comp && comp.jsonDataStr) {
      this._compJsonData = JSON.parse(comp.jsonDataStr);
    } else {
      this._compJsonData = {};
    }

    return this._compJsonData;
  }
}
