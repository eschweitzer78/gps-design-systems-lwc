import {
  invokeApexMethod,
  sendOmniPubsubEvent,
  handleMessaging
} from "c/sfGpsDsOsrtOmniscriptUtils";
import {
  getNamespaceDotNotation,
  RUN_MODES
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { delay } from "c/sfGpsDsOsrtAsyncUtils";
import { GenericInvoke2 } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { GenericInvoke2NoCont } from "c/sfGpsDsOsrtOmniscriptRestApi";
import pubsub from "c/sfGpsDsOsrtPubsub";
//import { useCoreOmniStudioComponents } from 'c/platformObjectMappings';
//import { LABELS } from './omniscriptActionUtilLabels.js';

export class OmniscriptActionCommonUtil {
  //#region utilities
  invokeApexMethodUtil = invokeApexMethod;
  sendOmniPubsubEventUtil = sendOmniPubsubEvent;
  handleMessagingUtil = handleMessaging;
  //#endregion

  //#region privateVariables
  _ns = getNamespaceDotNotation();
  _element = {};
  _readyTime; // Time when the action execution starts
  _stopTime; // Time when the action execution ends
  _executedAsChainable = false;
  _executedAsQueueable = false;
  //#endregion

  constructor(element) {
    this._element = element;
  }

  /**
   * @description Invokes the action. This method should NOT be overwritten. Hooks like getConfigForActionService,
   *              callActionService, handlePromiseDuringInvoke, and handleActionEvents are provided to provide
   *              customizability for new actions.
   * @param {Object} data - parameters for server call || data that is in a promise to be resolved downstream that
   *                 does not require server call
   * @param {*} comp
   * @param {Object} [payload]
   * @returns {Promise}
   */
  invokeAction(data, comp, payload) {
    // Stores the readyTime (execution start time)
    // - On the initial invoke, _executedAsChainable and _executedAsQueueable will be false and ready time will be
    //   stored
    // - On the subsequent invokes, the stored _executedAsChainable and _executedAsQueueable from the
    //   parseRawResponse will be evaluated. If any of these values are true, ready time should not be overwritten
    //   as the same action process is still in the process of being executed
    // - Ready time should also be null to indicate that it is a new action invocation
    if (
      comp &&
      comp._timeTrackingEnabled &&
      this._executedAsChainable === false &&
      this._executedAsQueueable === false &&
      this._readyTime == null
    ) {
      this._readyTime = Date.now();
    }

    // When the preprocessed data is a Promise or if data has an error node, handle using handlePromiseDuringInvoke
    if (data.error || data instanceof Promise) {
      return this.handlePromiseDuringInvoke(
        data.error ? Promise.resolve(data) : data,
        comp,
        payload
      );
    }

    // Get configuration parameters for the action service
    const callConfig = this.getConfigForActionService(data);
    const params = callConfig.params;

    // Calls the action service and handles responses downstream
    return new Promise((resolve, reject) => {
      this.callActionService(callConfig, this)
        .then((resp) => {
          const respObj = this.parseRawResponse(comp, resp);
          this.handleActionEvents(comp, respObj, params, this._element);

          // _executedAsQueuable is set in parseRawResponse
          if (this._executedAsQueueable) {
            // Provides Queueable support. Restarts the action flow until resp no longer has a responseId
            // node
            resolve(
              this.executeAction(params, respObj.responseId, comp, payload)
            );
          } else {
            if (
              comp &&
              comp.handleToastCompletion &&
              typeof comp.handleToastCompletion === "function" &&
              comp._toastTitle &&
              comp._toastMessage
            ) {
              const toastTitle = comp._toastTitle,
                toastMessage = comp._toastMessage;

              comp.handleToastCompletion(toastTitle, toastMessage);
            }

            const processedResp = this.postProcess(
              respObj,
              this._element,
              comp
            );

            // chainable support
            if (
              processedResp &&
              processedResp.result &&
              typeof processedResp.result.then === "function"
            ) {
              resolve(
                processedResp.result.then((vlcParams) => {
                  const chainableParams = {
                    sClassName: params.sClassName,
                    sMethodName: params.sMethodName
                  };

                  return this.executeAction(
                    chainableParams,
                    null,
                    comp,
                    payload,
                    vlcParams
                  );
                })
              );
            }

            resolve(processedResp);
          }
        })
        .catch((error) => {
          const errorObj = this.parseRawResponse(comp, error);
          this.handleActionEvents(comp, errorObj, params, this._element);

          return reject(this.postProcess(errorObj, this._element, comp, true));
        });
    });
  }

  /**
   * @description Parses the action's raw response. Returns parsed response object. This method is called immediately
   *              after the response is received from the server. If overwriting this method in extended utilities, it
   *              is recommended that the super.parseRawResponse is called first to ensure that action stop time is
   *              captured correctly.
   * @param {*} comp
   * @param {*} rawResponse
   * @returns {*} Primarily will return an object but can return other data types except for Strings
   */
  parseRawResponse(comp, rawResponse) {
    // Stores the stopTime (execution stop time)
    if (comp && comp._timeTrackingEnabled) {
      this._stopTime = Date.now();
    }

    let parsedResponse;

    // Parse the raw response, if possible or just return the raw response
    try {
      parsedResponse = JSON.parse(rawResponse);
    } catch (error) {
      parsedResponse = rawResponse;
    }

    this._executedAsChainable =
      (parsedResponse.IPResult &&
        parsedResponse.IPResult.hasOwnProperty("vlcIPData") &&
        parsedResponse.IPResult.hasOwnProperty("vlcStatus") &&
        parsedResponse.IPResult.vlcStatus === "InProgress") === true;
    this._executedAsQueueable = parsedResponse.responseId != null;

    return parsedResponse;
  }

  /**
   * @description Handles preprocessed data that is a Promise. By default, returns the promise input. This method is
   *              called in the invokeAction after data has been preprocessed.
   * @param {Promise} data
   * @param {*} comp
   * @param {Object} payload
   * @returns {Promise}
   */
  // eslint-disable-next-line no-unused-vars
  handlePromiseDuringInvoke(data, comp, payload) {
    // Pass the promise through the parseRawResponse to get a stopTime
    const resp = this.parseRawResponse(comp, data);

    // Fires messaging events
    this.handleActionMessagingEvents(comp);

    return resp;
  }

  /**
   * @description Gets the configuration for callActionService. By default, it wil return in the following format
   *              { params: object, apexMethod: apex_method }. This method is called in the invokeAction after data has
   *              been preprocessed. Returned object will be fed into the callActionService.
   * @param {Object} data
   * @returns {Object} - Returning object should include a params key as the params key is used downstream.
   */
  getConfigForActionService(data) {
    /**
     * Note: By default, GenericInvoke2NoCont is the apex method used to make remote calls. If continuation is defined
     * via options.useContinuation = true, this will set up the GenericInvoke2 as the apex method to make remote calls.
     * GenericInvoke2 apex method has the (continuation=true) annotation. GenericInvoke2NoCont will not. Using
     * GenericInvoke2NoCont will allow remote calls to run in parallel if called asynchronously in accordance with
     * https://docs.pushtechnology.com/cloud/latest/manual/html/designguide/solution/support/connection_limitations.html
     */
    return {
      params: {
        input:
          typeof data.input === "string"
            ? data.input
            : JSON.stringify(data.input),
        options:
          typeof data.options === "string"
            ? data.options
            : JSON.stringify(data.options),
        sClassName: data.sClassName,
        sMethodName: data.sMethodName
      },
      apexMethod:
        data.options && data.options.useContinuation === true
          ? GenericInvoke2
          : GenericInvoke2NoCont
    };
  }

  /**
   * @description Hook for calling the action service. By default, it will invoke the Apex backend in accordance with
   *              the apex method and params provided. This method is called in the invokeAction after the data has
   *              been preprocessed.
   * @param {Object} config
   * @param {*} comp
   * @returns {Promise}
   */
  // eslint-disable-next-line no-unused-vars
  callActionService(config, comp) {
    return this.invokeApexMethodUtil(config.apexMethod, config.params);
  }

  /**
   * @description Handles action events once response is obtained from remote call. Can be configured for sending
   *              events to Omniscript Designer Debug console. Configured for sending pubsub events. This method is
   *              called in the invokeAction after the response has been received.
   * @param {*} comp
   * @param {Object} resp
   * @param {Object} params
   * @param {Object} [element]
   */
  handleActionEvents(comp, resp, params, element) {
    // triggers event to send data to debug console
    if (
      params &&
      resp &&
      comp &&
      comp.sendDataToDebugConsole &&
      typeof comp.sendDataToDebugConsole === "function" &&
      comp.runMode === RUN_MODES.DEBUG
    ) {
      let debugLabel = "";

      if (element && element.propSetMap) {
        debugLabel = element.propSetMap.label;
      } else if (comp && comp._propSetMap) {
        debugLabel = comp._propSetMap.label;
      } else {
        debugLabel = comp._debugLabel;
      }

      comp.sendDataToDebugConsole(params, resp, debugLabel, element);
    }

    // Handle the action's messaging events
    this.handleActionMessagingEvents(comp, resp, params);
  }

  /**
   * @description Handles messaging for Actions. Messaging includes both Vlocity Tracking Entries and Omni-Analytics.
   * @param {*} comp
   * @param {Object} [resp]
   * @param {Object} [params]
   */
  handleActionMessagingEvents(comp, resp, params) {
    if (
      this._executedAsChainable === false &&
      this._executedAsQueueable === false
    ) {
      const eventData = {
        ReadyTime: this._readyTime,
        ElapsedTime: this._stopTime - this._readyTime,
        StopTime: this._stopTime,
        Resume: comp && comp.resume
      };

      // Calculate the response size and insert into the event data to send, if the action is a server action
      if (resp) {
        eventData.ResponseSize = JSON.stringify(resp).length;
      }

      // Calculate the request size and insert into the event data to send, if the action is a server action
      if (params) {
        eventData.RequestSize = JSON.stringify(params).length;
      }

      // Fire event to the Header component to create Time Tracking entries for actions that are at the root level
      // or are action embedded in an Action Block which is at the root level
      if (comp && comp._timeTrackingEnabled && comp.jsonDef.level === 0) {
        pubsub.fire(
          `${comp.scriptHeaderDef.uuid}omnitimetrackingdata`,
          "timeTrackingData",
          {
            component: comp,
            element: this._element,
            data: eventData
          }
        );
      }

      // Fires messaging for UI Action
      if ((comp && comp.jsonDef) || this._element) {
        // Processes messaging framework after a delay to ensure response is available for messaging merge fields
        delay(100).then(() =>
          this.handleMessagingUtil(
            comp,
            "omniscript_action",
            eventData,
            this._element,
            "UI Action"
          )
        );
      }

      // Reset ready and stop times for actions since the event has already been fired
      this._readyTime = null;
      this._stopTime = null;
    }
  }

  /**
   * @description Performs preprocessing of the remote call parameters prior to invoking action. This method is called
   *              in the executeAction prior to invokeAction. This method may be overwritten in child classes if
   *              specific preprocessing is needed.
   * @param {Object} params
   * @param {String} queueableRespId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Object}
   */
  // eslint-disable-next-line no-unused-vars
  preProcess(params, queueableRespId, comp, payload, vlcParams) {
    // queueable support
    if (queueableRespId) {
      params.sMethodName = "actionFunctionResult";
      const optionObj = JSON.parse(params.options);

      // ensures vlcClass/vlcMethod are available for queueable
      if (!optionObj.vlcClass || !optionObj.vlcMethod) {
        const parsedOptions = JSON.parse(optionObj.options);
        optionObj.vlcClass = optionObj.vlcClass || parsedOptions.vlcClass;
        optionObj.vlcMethod = optionObj.vlcMethod || parsedOptions.vlcMethod;
      }

      optionObj.stagingId = queueableRespId;
      params.input = "{}";
      params.options = JSON.stringify(optionObj);
    }

    // chainable support
    if (vlcParams) {
      params.options = vlcParams.options;
      params.input = vlcParams.input;
    }

    return params;
  }

  /**
   * @description Executes action flow. Starting point for the action flow. This method should NOT be overwritten.
   *              Hooks are present throughout the action flow that can be used as an alternative.
   * @param {Object} params
   * @param {String} queueableId
   * @param {*} comp
   * @param {Object} payload
   * @param {Object} vlcParams
   * @returns {Promise}
   */
  executeAction(params, queueableId, comp, payload, vlcParams) {
    try {
      params = this.preProcess(params, queueableId, comp, payload, vlcParams);
      return this.invokeAction(params, comp, payload);
    } catch (error) {}
  }

  /**
   * @description Performs postprocessing for remote call response for both successful and failure remote calls. This
   *              method is called in the invokeAction once the repsonse is received. This method should NOT be
   *              overwritten.
   * @param {Object} resp
   * @param {Object} element
   * @param {*} comp
   * @param {Boolean} [failure]
   * @returns {Object} Postprocessed response. Returns object with nodes result (stores the remote call's raw
   *                   response) and error (boolean).
   */
  // eslint-disable-next-line no-unused-vars
  postProcess(resp, element, comp, failure) {
    // checks to see if there is a system failure or if generic invoke has failed
    if (failure || (resp && resp.error !== "OK")) {
      return {
        result: resp,
        error: true
      };
    }

    if (
      resp.IPResult &&
      resp.IPResult.hasOwnProperty("vlcIPData") &&
      resp.IPResult.hasOwnProperty("vlcStatus") &&
      resp.IPResult.vlcStatus === "InProgress"
    ) {
      return {
        result: Promise.resolve({
          options: JSON.stringify(resp.IPResult),
          input: "{}"
        })
      };
    }

    // returns raw response in result node. error is set to false as generic invoke and system failure errors do not
    // exist. errors in the actual response will need to be handled downstream in the results node.
    return {
      result: resp,
      error: false
    };
  }
}
