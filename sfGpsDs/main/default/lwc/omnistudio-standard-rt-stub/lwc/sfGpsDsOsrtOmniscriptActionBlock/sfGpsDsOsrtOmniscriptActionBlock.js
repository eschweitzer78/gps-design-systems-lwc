import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { initializeAction } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import { sendHttpDataToDebugConsole } from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * @module ns/omniscriptActionBlock
 * @extends OmniscriptBaseAction
 * @typicalname omniscriptActionBlock
 */
export default class OmniscriptActionBlock extends OmniscriptBaseAction {
  initCompVariables() {
    super.initCompVariables();
    this._isActionBlock = true;
  }

  /**
   * @scope private
   * @description Overwrites inherited processAction. Handles asynchronous processing for the Action Block. Requests
   *            are independent of each other.
   * @param {Object} element
   * @returns {Promise}
   */
  processAction(element) {
    let numHidden = 0;

    // processes action when actions are present inside of the action block
    if (
      element &&
      element.propSetMap &&
      element.propSetMap.actions &&
      element.propSetMap.actions.length > 0
    ) {
      // stores an array of executed action promises
      const actionPromises = element.propSetMap.actions.map((action) => {
        const omniShowAction = this.evalConditionUtil(
          action,
          "show",
          this,
          true
        );

        // show/hide is valid and continues executing action
        if (omniShowAction) {
          let actionType = action.type;

          // instantiates action based on type
          const actionInstance = initializeAction(actionType, action);

          return actionInstance
            .executeAction(null, null, this, null, null)
            .catch((error) => {
              // pass through error to be handled once all actions are resolved
              return error;
            });
        }

        // increment the number of hidden actions
        numHidden++;

        // Skips executing action and resolves a promise indicating that there is no error for that specific
        // action since show/hide is not valid
        return Promise.resolve({ error: false });
      });

      // execute since there are actions that are not hidden
      if (numHidden < actionPromises.length) {
        return Promise.all(actionPromises)
          .then((resp) => {
            let combinedResp = {};

            // turns off spinner once response is received
            this.evaluateSpinner(false, element);

            if (resp) {
              // construct the combined response from all actions
              for (let i = 0; i < resp.length; i++) {
                // stores and persists any error boolean value
                combinedResp.error = combinedResp.error || resp[i].error;

                // handles errors in each executed action
                if (resp[i].error) {
                  // stores and combines all error messages from errored actions
                  combinedResp.errorMsg = combinedResp.errorMsg
                    ? `${combinedResp.errorMsg} <br> ${resp[i].source} : ${resp[i].errorMsg}`
                    : `${resp[i].source} : ${resp[i].errorMsg}`;
                } else {
                  // combines raw response from result node from successful actions and stores it in the
                  // result node of the combined response
                  combinedResp.result = {
                    ...combinedResp.result,
                    ...resp[i].result
                  };
                }
              }
            }

            return this.handleResponse(combinedResp, element);
          })
          .catch((error) => {
            return this.handleError(element, error);
          });
      }
    }

    // when action block is empty or if there are no 'show' actions, throw OmniNoActionsError error
    return this.handleError(element, {
      errorMsg: this.allCustomLabelsUtil.OmniNoActionsError
    });
  }

  /**
   * @scope private
   * @description Overwrites inherited handleResponseError. Determines if Action Block is to apply successful
   *            responses despite having errored responses present.
   * @param {Object} resp
   * @param {Object} element
   * @returns {Object|Void}
   */
  handleResponseError(resp, element) {
    // Error modal will have the Continue/Go Back actions only when configured to prevent applying response to the
    // data json as the user should be able to access if they need to go back to the previous step. Otherwise, error
    // modal will display 'OK' actions and will progress to the next step.
    this.sendErrorModalUtil(
      resp.errorMsg,
      this._isBtn === true ||
        (this._isBtn === false && element.propSetMap.applyIfError),
      element,
      this.scriptHeaderDef,
      this
    );

    // Applies response from successful actions back to the data json
    if (element.propSetMap.applyIfError) {
      if (this._isBtn) {
        this.dispatchOmniEventUtil(
          this,
          { apiResponse: resp.result },
          "omniactionbtn"
        );
      } else {
        // Clears the error node and so that result node can be applied downstream for action block in between
        // steps
        resp.error = false;
      }
    }

    return resp;
  }

  /**
   * @scope private
   * @description Handles common errors present in the Action Block.
   * @param {Object} element
   * @param {Object} error
   * @returns {Promise}
   */
  handleError(element, error) {
    // dispatch an error modal with error message
    this.sendErrorModalUtil(
      error.errorMsg,
      this._isBtn,
      element,
      this.scriptHeaderDef,
      this
    );

    // turn off spinner when error is thrown
    this.evaluateSpinner(false, element);

    return Promise.resolve({ systemFailure: true });
  }

  getBoundsForDesigner() {
    const container = this.template.querySelector(
      ".omni-designer-action-container"
    );
    const outerWrapper = this.getBoundingClientRect();
    if (container) {
      const computedStyle = getComputedStyle(container);
      const boundingRect = container.getBoundingClientRect();
      return Object.assign({}, JSON.parse(JSON.stringify(outerWrapper)), {
        containerBounds: boundingRect,
        paddingLeft: this.safeParseStyleToNumber(computedStyle.paddingLeft),
        paddingRight: this.safeParseStyleToNumber(computedStyle.paddingRight),
        paddingTop: this.safeParseStyleToNumber(computedStyle.paddingTop),
        paddingBottom: this.safeParseStyleToNumber(computedStyle.paddingBottom)
      });
    }
    return this.getBoundingClientRect();
  }

  /**
   * @scope private
   * @description Overwrites inherited sendDataToDebugConsole. Sends data to the Debug Console event handler.
   * @param {Object} params
   * @param {Object} resp
   * @param {String} label
   * @param {Object} [element]
   * @returns {void}
   */
  sendDataToDebugConsole(params, resp, label, element) {
    if (element && element.type === "Rest Action") {
      sendHttpDataToDebugConsole(
        this,
        params,
        resp,
        label,
        element,
        "omniactiondebug"
      );
    } else {
      super.sendDataToDebugConsole(params, resp, label, element);
    }
  }
}
