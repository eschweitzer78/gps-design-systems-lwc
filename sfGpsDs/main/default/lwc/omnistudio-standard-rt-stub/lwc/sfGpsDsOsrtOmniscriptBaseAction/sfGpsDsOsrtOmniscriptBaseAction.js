import { api } from "lwc";
import OmniscriptGroupElement from "c/sfGpsDsOsrtOmniscriptGroupElement";
import { debounce } from "c/sfGpsDsOsrtAsyncUtils";
import { showToast } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { OmniscriptBaseActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import tmpl from "./omniscriptBaseAction_slds.html";
import tmpl_nds from "./omniscriptBaseAction_nds.html";

/**
 * Omniscript Base Action component
 */
export default class OmniscriptBaseAction extends OmniscriptGroupElement {
  //#region privateVariables
  _isBtn = false;
  extraclass = "";
  _actionUtilClass;
  _timeTrackingEnabled = false;
  //#endregion

  /**
   * @scope public
   * @description Processes the logic for executing an action. This method is called from onclick attribute in
   *              component's HTML markup and in Header component.
   * @returns {Promise}
   */
  @api
  execute() {
    return this.runAction(this.jsonDef);
  }

  /**
   * @scope private
   * @description Handles the response from the action framework and interacts with the UI.
   * @param {Object} resp
   * @param {Object} element
   * @returns {Object|Void}
   */
  handleResponse(resp, element) {
    //* early termination for fireAndForget. additional response handling is not needed
    if (element.propSetMap.invokeMode === "fireAndForget") {
      return;
    }

    if (!resp.error) {
      this.handleResponseSuccess(resp, element);
    }

    if (resp.error) {
      // eslint-disable-next-line consistent-return
      return this.handleResponseError(resp, element);
    } else if (!(resp.result instanceof Promise) && this._isBtn) {
      // eslint-disable-next-line consistent-return
      return this.dispatchOmniEventUtil(
        this,
        { apiResponse: resp.result },
        "omniactionbtn"
      );
    }

    // eslint-disable-next-line consistent-return
    return resp;
  }

  /**
   * @scope private
   * @description Hook to allow specific processing of successful responses.
   * @param {Object} resp
   * @param {Object} element
   * @returns {Void}
   */
  // eslint-disable-next-line no-unused-vars
  handleResponseSuccess(resp, element) {}

  /**
   * @scope private
   * @description Handles error handling for once response is received.
   * @param {Object} resp
   * @param {Object} element
   * @returns {Void}
   */
  handleResponseError(resp, element) {
    // Show an error modal when there are no validation errors present
    if (resp.result && !resp.result.vlcValidationErrors) {
      this.sendErrorModalUtil(
        resp.errorMsg,
        this._isBtn,
        element,
        this.scriptHeaderDef,
        this
      );
    }

    return resp;
  }

  /**
   * @scope private
   * @description Overwrites the native LWC connectedCallback.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptBaseActionUtil(this.jsonDef);
    }

    // identifies if the base action component is a button
    if (this.jsonDef && this.jsonDef.level > 0) {
      this._isBtn = true;
      this.extraclass =
        this._theme +
        "-button_stretch" +
        (this._propSetMap.label ? "" : " " + this._theme + "-box");
    } else {
      // removes padding for when base action component is not a button
      this.classList.remove(this._theme + "-p-horizontal_medium");
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited initCompVariables.
   * @returns {Void}
   */
  initCompVariables() {
    super.initCompVariables();

    // initialize variables specific for actions
    this._toastTitle = "Action Completed";
    this._toastMessage = `The action ${this._propSetMap.label} has completed.`;
    this._timeTrackingEnabled =
      this.scriptHeaderDef.propSetMap.timeTracking ||
      this.evaluateMessagingUtil(
        this.jsonDef.propSetMap,
        this.scriptHeaderDef.omniAnalyticsEnabled
      );
  }

  /**
   * @scope private
   * @description Overwrites the native LWC renderedCallback.
   * @returns {Void}
   */
  renderedCallback() {
    if (!this._elementId) {
      return;
    }

    if (this._initialRender) {
      this.combinedWatch();
      this._initialRender = false;
    }

    if (this._isDesignMode) {
      this.initRemovalCallback();
      this._throttledDesignRender = debounce(
        this.dispatchDesignerRenderElementEvent.bind(this),
        250
      );
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      requestAnimationFrame(this._throttledDesignRender);
    }
  }

  /**
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }

  /**
   * @scope private
   * @description Displays toasts upon action completion. Method is utilized into the Action Framework.
   * @param {String} title
   * @param {String} message
   * @returns {Void}
   */
  handleToastCompletion(title, message) {
    if (
      this._propSetMap.toastComplete &&
      this._propSetMap.invokeMode !== "fireAndForget"
    ) {
      showToast({ title, message }, this);
    }
  }

  /**
   * @scope private
   * @description Full action flow for action execution.
   * @param {Object} element
   * @returns {*}
   */
  runAction(element) {
    // starts spinner
    this.evaluateSpinner(true, element);

    // checks action validity
    const isValid = this.checkActionValidity(element);

    // processes action
    if (isValid) {
      return this.processAction(element);
    }

    // turns off spinner
    this.evaluateSpinner(false, element);

    // dispatches an event to Header to trigger validation
    this.dispatchOmniEventUtil(
      this,
      { triggerValidation: true },
      "omniactionbtn"
    );

    // triggers error for validation failure
    return this.sendErrorModalUtil(
      this.allCustomLabelsUtil.OmniStepValidationError,
      this._isBtn,
      element,
      this.scriptHeaderDef,
      this
    );
  }

  /**
   * @scope private
   * @description Processes action and invokes the action framework.
   * @param {Object} element
   * @returns {Promise}
   */
  processAction(element) {
    return this._actionUtilClass
      .executeAction(null, null, this, null, null)
      .then((resp) => {
        this.evaluateSpinner(false, element);

        return this.handleResponse(resp, element);
      })
      .catch((error) => {
        //* invokeAction reject error handling for system failures when an error occurs immediately when action is invoked

        this.evaluateSpinner(false, element);
        this.sendErrorModalUtil(
          error.errorMsg,
          this._isBtn,
          element,
          this.scriptHeaderDef,
          this
        );

        return { systemFailure: true };
      });
  }

  /**
   * @scope private
   * @description Checks validity for executing an action.
   * @param {Object} element
   * @returns {Boolean}
   */
  checkActionValidity(element) {
    return (
      !this._isBtn ||
      element.level === 0 ||
      element.propSetMap.validationRequired !== "Step" ||
      (!this.scriptHeaderDef.hasInvalidElements &&
        element.propSetMap.validationRequired === "Step") ||
      this.skipValidation()
    );
  }

  /**
   * @scope public
   * @description Overwrites inherited applyCallResp.
   * @param {Object} json
   * @param {Boolean} [bApi=false]
   * @param {Boolean} [bValidation=false]
   * @returns {Void}
   */
  // eslint-disable-next-line no-unused-vars
  @api applyCallResp(json, bApi = false, bValidation = false) {}

  /**
   * @scope private
   * @description Defines if validation is to be skipped for a specific action. Actions can bypass validation by
   *              overwriting this method.
   * @returns {Boolean}
   */
  skipValidation() {
    return false;
  }
}
