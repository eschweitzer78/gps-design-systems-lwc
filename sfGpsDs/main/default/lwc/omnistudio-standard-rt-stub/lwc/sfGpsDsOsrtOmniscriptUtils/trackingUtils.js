/**
 * This entire utility is to be used only to write to Tracking Entries from OmniScript from a Step or an Action element.
 * These methods should only be called from the Header component as the utilities will write directly to the root JSON
 * definition.
 */

import { VlocityTrack } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { getCommonTrackingData } from "c/sfGpsDsOsrtOmniscriptTrackingServiceUtils";
import { invokeApexMethod } from "./invokeHelpers";

/**
 * @description Consolidated method that invokes handleStepTimeTracking for Steps and handleActionTimeTracking for
 *              Actions.
 * @param {comp} headerComp - Header Component
 * @param {*} stepEleOrActionComp - stepElement for Steps or actionComp for Actions
 * @param {*} eventNameOrEleJsonDef - trackingEventName for Steps or element JSON Definition for Actions
 * @param {Object} [additionalData] - additionalData
 * @param {*} [bStep=true] - Boolean value indicating if Step
 * @returns {void}
 */
export function handleTimeTracking(
  headerComp,
  stepEleOrActionComp,
  eventNameOrEleJsonDef,
  additionalData,
  bStep = true
) {
  if (bStep === true) {
    handleStepTimeTracking(
      headerComp,
      stepEleOrActionComp,
      eventNameOrEleJsonDef,
      additionalData
    );
  } else {
    handleActionTimeTracking(
      headerComp,
      stepEleOrActionComp,
      eventNameOrEleJsonDef,
      additionalData
    );
  }
}

/**
 * @description Handle Step element time tracking events.
 * @param {*} comp
 * @param {Object} stepElement
 * @param {String} [trackingEventName='StepActionTime']
 * @param {Object} [additionalData={}]
 * @returns {void}
 */
function handleStepTimeTracking(
  comp,
  stepElement,
  trackingEventName = "StepActionTime",
  additionalData = {}
) {
  // Processes time tracking logic when time tracking is enabled and processed from the Header component. This should
  // not fire when OA is enabled.
  if (
    comp.scriptHeaderDef.propSetMap.timeTracking &&
    comp.jsonDef.sOmniScriptId &&
    comp.scriptHeaderDef.omniAnalyticsEnabled !== true
  ) {
    const dataToSend = getCommonTrackingData(
      comp,
      stepElement,
      comp.scriptHeaderDef,
      comp._elementValueObj
    );

    // Create time tracking entry for Outcome events (SFL || Cancel)
    if (trackingEventName === "Outcome") {
      dataToSend.TrackingEvent = trackingEventName;

      if (additionalData.outcome) {
        dataToSend.Outcome = additionalData.outcome;
      }

      invokeApexTrack(dataToSend);
    }

    // Create time tracking entry for StepActionTime events
    if (stepElement.st && additionalData.elapsedTime) {
      dataToSend.TrackingEvent = "StepActionTime";
      dataToSend.ElapsedTime = additionalData.elapsedTime;

      invokeApexTrack(dataToSend);
      updateTrackingDataJson(
        comp._elementValueObj,
        stepElement,
        additionalData.elapsedTime,
        comp
      );

      comp.jsonDataStr = JSON.stringify(comp._elementValueObj);
      comp.jsonDef.response = comp._elementValueObj;
    }
  }
}

/**
 * @description Handles Action time tracking events. This should only be fired for actions that are at the root level or
 *              action that are embedded inside of an Action Block which is at the root level.
 * @param {*} headerComp - Header Component
 * @param {*} actionComp - Action Component
 * @param {Object} element - Element JSONDef
 * @param {Object} [additionalData = {}]
 * @returns {void}
 */
function handleActionTimeTracking(
  headerComp,
  actionComp,
  element,
  additionalData = {}
) {
  // Processes time tracking logic when time tracking is enabled and processed from the Header component. This should
  // not fire when OA is enabled
  if (
    headerComp.scriptHeaderDef.propSetMap.timeTracking &&
    headerComp.jsonDef.sOmniScriptId &&
    headerComp.scriptHeaderDef.omniAnalyticsEnabled !== true
  ) {
    const targetElement = element || actionComp.jsonDef;
    const rootIndex =
      targetElement.rootIndex >= 0
        ? targetElement.rootIndex
        : targetElement.indexInParent;
    const elementJsonDef = headerComp.jsonDef.children[rootIndex];
    const dataToSend = {
      ...getCommonTrackingData(
        actionComp,
        element,
        headerComp.scriptHeaderDef,
        headerComp._elementValueObj,
        additionalData
      ),
      TrackingEvent: "StepActionTime"
    };

    invokeApexTrack(dataToSend);

    updateTrackingDataJson(
      headerComp._elementValueObj,
      elementJsonDef,
      dataToSend.ElapsedTime,
      headerComp
    );
    headerComp.jsonDataStr = JSON.stringify(headerComp._elementValueObj);
    headerComp.jsonDef.response = headerComp._elementValueObj;
  }
}

/**
 * @description Updates the data JSON with tracking data. Data JSON will be updated with a cumulative elapsed duration.
 * @param {Object} dataJson
 * @param {Object} elementJsonDef
 * @param {Integer} elapsedTime
 * @param {*} comp
 * @returns {void}
 */
export function updateTrackingDataJson(
  dataJson,
  elementJsonDef,
  elapsedTime,
  comp
) {
  // Initializes the vlcTimeTracking node in the data JSON if it DNE
  if (!dataJson.vlcTimeTracking) {
    dataJson.vlcTimeTracking = {};
  }

  // Stores the OmniScriptSessionToken node in the data JSON if it DNE
  if (!dataJson.vlcTimeTracking.OmniScriptSessionToken) {
    dataJson.vlcTimeTracking.OmniScriptSessionToken = comp.scriptHeaderDef.uuid;
  }

  // Calculates and stores total elapsed (cumulative) time for each root element in data JSON's vlcTimeTracking node
  if (elementJsonDef) {
    if (!(dataJson.vlcTimeTracking[elementJsonDef.name] >= 0)) {
      dataJson.vlcTimeTracking[elementJsonDef.name] = 0;
    }

    dataJson.vlcTimeTracking[elementJsonDef.name] += elapsedTime;
  }

  comp.dispatchOmniEventUtil(comp, comp.createAggregateNode(), "omniaggregate");
}

/**
 * @description Invokes BusinessProcessDisplayController VlocityTrack with tracking data.
 * @param {Object} dataToSend
 * @returns {void}
 */
export function invokeApexTrack(dataToSend) {
  if (!Array.isArray(dataToSend)) {
    dataToSend = [dataToSend];
  }

  invokeApexMethod(VlocityTrack, { trackingData: dataToSend });
}
