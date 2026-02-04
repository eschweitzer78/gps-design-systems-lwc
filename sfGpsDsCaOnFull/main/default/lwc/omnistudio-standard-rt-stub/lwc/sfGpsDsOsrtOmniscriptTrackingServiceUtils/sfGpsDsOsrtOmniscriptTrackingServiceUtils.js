import {
  trackedScriptHeaderMap,
  trackedTypeToJsonDefMap,
  trackedStaticMap,
  trackedDataJsonMap
} from "./trackedProperties";
import { handleExtraPayload } from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * @description Gets common tracking data for the Messaging Framework and Time Tracking Services.
 * @param {*} comp
 * @param {Object} element
 * @param {Object} scriptHeaderDef
 * @param {Object} jsonData
 * @param {Object} additionalData
 * @returns {Object}
 */
export function getCommonTrackingData(
  comp,
  element,
  scriptHeaderDef,
  jsonData,
  additionalData
) {
  /**
   * This method is used for all events whether the event is fired from the OmniScript Header or from an OmniScript
   * element.
   * - When fired from an OmniScript element, the element argument will be populated and will be used as the
   *   targetJsonDef.
   * - When fired from the OmniScript Header, the element will be null/undefined and the targetJsonDef will be the
   *   component's jsonDef (root jsonDef).
   */
  const targetJsonDef = element || comp.jsonDef;
  let trackingData = {};

  // First, get the mergefield values from the scriptHeaderDef mapping and merge it in trackingData
  handleExtraPayload(
    trackedScriptHeaderMap,
    trackingData,
    comp,
    scriptHeaderDef
  );

  // Merge the values from the ScriptHeaderMessagingData and TrackingCustomData directly into the trackingData root level
  trackingData = {
    ...trackingData,
    ...trackingData.ScriptHeaderMessagingData,
    ...trackingData.TrackingCustomData
  };

  // Delete the ScriptHeaderMessagingData and TrackingCustomData nodes from trackingData as the values of these nodes
  // have already been merged directly at the root
  delete trackingData.ScriptHeaderMessagingData;
  delete trackingData.TrackingCustomData;

  // If targetJsonDef is for an OmniScript element, merge in the element's propSetMap mergefield mappings into trackingData
  if (targetJsonDef.type != null) {
    handleExtraPayload(
      trackedTypeToJsonDefMap[targetJsonDef.type] || {},
      trackingData,
      comp,
      targetJsonDef.propSetMap
    );

    // Add the ElementStepNumber into the trackingData
    trackingData.ElementStepNumber =
      (targetJsonDef.rootIndex >= 0
        ? targetJsonDef.rootIndex
        : targetJsonDef.indexInParent) + 1;

    // Add the Element Name and Element Type into the trackingData. OmniEleName and ElementName, OmniEleType and
    // ElementType both store the element name and type, respectively, for backwards-compatibility.
    trackingData.ElementName = trackingData.OmniEleName = targetJsonDef.name;
    trackingData.ElementType = trackingData.OmniEleType = targetJsonDef.type;

    // Merge values from the MessagingData directly into the trackingData root level
    trackingData = {
      ...trackingData,
      ...trackingData.MessagingData
    };

    // Delete the MessagingData node from trackingData as the values for this node have already been merged directly
    // at the root
    delete trackingData.MessagingData;
  }

  // Get the mergefield values from the current trackingData and data JSON mappings and merge it in trackingData
  handleExtraPayload(
    { ...trackingData, ...trackedDataJsonMap },
    trackingData,
    comp,
    jsonData
  );

  // Merge in the static mapping and additionalData into the trackingData
  trackingData = {
    ...trackingData,
    ...trackedStaticMap,
    ...additionalData
  };

  return trackingData;
}

/**
 * @description Evaluates if messaging is permitted.
 * @param {Object} propSetMap
 * @param {Object} [oaEnabled]
 * @returns {Boolean}
 */
export function evaluateMessaging(propSetMap, oaEnabled) {
  return (
    propSetMap.wpm || propSetMap.ssm || propSetMap.pubsub || oaEnabled === true
  );
}
