import { api, track } from "lwc";
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { pageReferenceTypes } from "c/sfGpsDsOsrtNavigationUtils";
import {
  getNameSpacePrefix,
  isRepeatNotation
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";

import tmpl from "./omniscriptNavigateAction_slds.html";
import tmpl_nds from "./omniscriptNavigateAction_nds.html";

/**
 * Omniscript Element that enables navigation to other views.
 * @api {string} - targetId
 */
export default class OmniscriptNavigateAction extends OmniscriptBaseAction {
  _navigateMessagingEnabled;

  /**
   * @type {Boolean} - If true, the action will render as a link.
   * @scope private
   */
  _isLink;

  /**
   * @type {NavigateAction} - Base component containing the functionality for navigating.
   * @scope private
   */
  _navigateAction;

  /**
   * @type {string} - The name space prefix.
   * @scope private
   */
  _nsPrefix = getNameSpacePrefix();

  get isActionValid() {
    return this.checkActionValidity(this.jsonDef);
  }

  /**
   * @type {string} - Represents the type of navigate action.
   * @see {@link pageReferenceTypes}
   * @scope track (private)
   */
  @track targetType;
  getTargetType() {
    if (this._propSetMap.targetType === "Vlocity OmniScript")
      return pageReferenceTypes.COMPONENT;

    return this._propSetMap.targetType
      ? this.handleMergeFieldUtil(
          this._propSetMap.targetType,
          this._jsonData,
          this.scriptHeaderDef.labelMap,
          isRepeatNotation(this._propSetMap.targetType)
            ? this.jsonDef.JSONPath
            : null
        )
      : undefined;
  }

  /**
   * @type {Id} - The 16 digit identifier associated with the target record.
   * @scope track (private)
   */
  @track targetId;
  getTargetId() {
    return this._propSetMap.targetId
      ? this.handleMergeFieldUtil(
          this._propSetMap.targetId,
          this._jsonData,
          this.scriptHeaderDef.labelMap,
          isRepeatNotation(this._propSetMap.targetId)
            ? this.jsonDef.JSONPath
            : null
        )
      : undefined;
  }

  /**
   * @type {string} - The name of the Object, Record, or KA
   * @scope track (private)
   */
  @track targetName;
  getTargetName() {
    switch (true) {
      case this.targetType === pageReferenceTypes.WEB_PAGE:
        return this._propSetMap.targetUrl
          ? this.handleMergeFieldUtil(
              this._propSetMap.targetUrl,
              this._jsonData,
              this.scriptHeaderDef.labelMap,
              isRepeatNotation(this._propSetMap.targetUrl)
                ? this.jsonDef.JSONPath
                : null
            )
          : undefined;

      case this._propSetMap.targetType === "Vlocity OmniScript":
        return `${this._nsPrefix}vlocityLWCOmniWrapper`;

      default:
        return this._propSetMap.targetName
          ? this.handleMergeFieldUtil(
              this._propSetMap.targetName,
              this._jsonData,
              this.scriptHeaderDef.labelMap,
              isRepeatNotation(this._propSetMap.targetName)
                ? this.jsonDef.JSONPath
                : null
            )
          : undefined;
    }
  }

  @track targetAction;
  getTargetAction() {
    switch (this.targetType) {
      case pageReferenceTypes.LOGIN:
        return this._propSetMap.loginAction;

      case pageReferenceTypes.OBJECT:
        return this._propSetMap.objectAction;

      case pageReferenceTypes.RECORD:
        return this._propSetMap.recordAction;

      default:
        return undefined;
    }
  }

  @track targetParams;
  getTargetParams() {
    let targetParams;

    if (this._propSetMap.targetType === "Vlocity OmniScript") {
      targetParams = this._propSetMap.targetLWCParams
        ? this.handleMergeFieldUtil(
            this._propSetMap.targetLWCParams.replace("?", ""),
            this._jsonData,
            this.scriptHeaderDef.labelMap,
            isRepeatNotation(this._propSetMap.targetLWCParams)
              ? this.jsonDef.JSONPath
              : null
          )
        : "";
      targetParams = `c__target=${this._propSetMap.targetLWC}&${targetParams}`;
    } else {
      targetParams = this._propSetMap.targetParams
        ? this.handleMergeFieldUtil(
            this._propSetMap.targetParams,
            this._jsonData,
            this.scriptHeaderDef.labelMap,
            isRepeatNotation(this._propSetMap.targetParams)
              ? this.jsonDef.JSONPath
              : null
          )
        : "";
    }

    if (this._propSetMap.targetType === pageReferenceTypes.APP) {
      try {
        targetParams = JSON.parse(targetParams);
      } catch (err) {
        console.warn(err);
      }
    }

    return targetParams;
  }

  constructor() {
    super();
    this.template.addEventListener(
      "navigate",
      this.handleNavigateTrackingEvents.bind(this)
    );
  }

  initCompVariables() {
    super.initCompVariables();
    this.stateRefresh();
    this._useNavigateAction = this.targetType !== "Restart OmniScript";
    this._isLink = this._propSetMap.variant === "link";
  }

  /**
   * @description Handles tracking events sent from the Base Component Navigate Action. stopTime, readyTime, and
   *              elapsedTime will be sent from the base component. This method should not execute when in VDS Design
   *              Mode.
   * @param {Event} event
   * @returns {void}
   */
  handleNavigateTrackingEvents(event) {
    // Events should not be handled if in VDS design mode
    if (!this._isDesignMode && event.detail) {
      const eventData = {
        ElapsedTime: event.detail.elapsedTime,
        ReadyTime: event.detail.readyTime,
        StopTime: event.detail.stopTime,
        Resume: this.resume
      };

      // Fire event to Header component to create Time Tracking entries
      if (this.jsonDef.level === 0 && this._timeTrackingEnabled) {
        pubsub.fire(
          `${this.scriptHeaderDef.uuid}omnitimetrackingdata`,
          "timeTrackingData",
          {
            component: this,
            element: this.jsonDef,
            data: eventData
          }
        );
      }

      // Cache the value determining if navigate messaging is enabled as this value will not change during the
      // lifespan of this component
      if (this._navigateMessagingEnabled == null) {
        this._navigateMessagingEnabled = this.evaluateMessagingUtil(
          this.jsonDef.propSetMap,
          this.scriptHeaderDef.omniAnalyticsEnabled
        );
      }

      // Fire messaging for UI Action for Navigate Action
      if (this._navigateMessagingEnabled) {
        this.handleMessagingUtil(
          this,
          "omniscript_action",
          eventData,
          this.jsonDef,
          "UI Action"
        );

        if (this.jsonData.vlocEvents) {
          const eventArray = this.jsonData.vlocEvents.split(",");
          if (eventArray && Array.isArray(eventArray)) {
            for (let i = 0; i < eventArray.length; i++) {
              this.handleMessagingUtil(
                this,
                eventArray[i],
                eventData,
                this.jsonDef,
                "UI Action"
              );
            }
          }
        }
      }
    }
  }

  renderedCallback() {
    if (this._initialRender) {
      this._navigateAction = this.template.querySelector(
        "[data-navigate-action]"
      );
    }

    if (typeof super.renderedCallback === "function") super.renderedCallback();
  }

  stateRefresh() {
    this.targetType = this.getTargetType();
    this.targetId = this.getTargetId();
    this.targetName = this.getTargetName();
    this.targetAction = this.getTargetAction();
    this.targetParams = this.getTargetParams();

    if (this._isLink)
      Promise.resolve().then(() => this._navigateAction?.generateUrl());
  }

  /**
   * Execute method is called when navigate is invoked between steps.
   * Otherwise, the click handler attached by the navigate action is used.
   */
  @api execute() {
    if (this.targetType === "Restart OmniScript") {
      this.dispatchOmniEventUtil(this, {}, "restartscript");
      // this.handleNavigateTrackingEvents({});
      return Promise.resolve().then(() => this.handleResponse());
    }

    return this._navigateAction.navigate().then(() => this.handleResponse());
  }

  showErrorModal() {
    // dispatches an event to Header to trigger validation
    this.dispatchOmniEventUtil(
      this,
      { triggerValidation: true },
      "omniactionbtn"
    );

    // triggers error for validation failure
    this.sendErrorModalUtil(
      this.allCustomLabelsUtil.OmniStepValidationError,
      this._isBtn,
      this.jsonDef,
      this.scriptHeaderDef,
      this
    );
  }

  handleResponse() {
    return { error: false, result: {} };
  }

  /**
   * @scope private
   * @description Overwrites the native LWC render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
}
