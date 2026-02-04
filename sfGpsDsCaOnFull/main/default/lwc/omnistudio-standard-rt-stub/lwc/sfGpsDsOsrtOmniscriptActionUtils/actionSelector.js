import { OmniscriptRemoteActionUtil } from "./omniscriptRemoteActionUtil";
import { OmniscriptIpActionUtil } from "./omniscriptIpActionUtil";
import { OmniscriptDrExtractActionUtil } from "./omniscriptDrExtractActionUtil";
import { OmniscriptDrTransformActionUtil } from "./omniscriptDrTransformActionUtil";
import { OmniscriptDrPostActionUtil } from "./omniscriptDrPostActionUtil";
import { OmniscriptHttpActionUtil } from "./omniscriptHttpActionUtil";
import { OmniscriptEmailActionUtil } from "./omniscriptEmailActionUtil";
import { OmniscriptDocusignEnvelopeActionUtil } from "./omniscriptDocusignEnvelopeActionUtil";
import { OmniscriptDeleteActionUtil } from "./omniscriptDeleteActionUtil";

/**
 * @description Returns initialized javascript class from action framework in accordance with the action type.
 * @param {String} actionType
 * @param {Object} actionDef
 * @returns {*} Instantiated javascript class from action framework
 */
export function initializeAction(actionType, actionDef) {
  let actionUtilClass;

  switch (actionType) {
    case "Calculation Action": // Bleed through and use Remote
    case "Remote Action":
      actionUtilClass = new OmniscriptRemoteActionUtil(actionDef);
      break;
    case "Integration Procedure Action":
      actionUtilClass = new OmniscriptIpActionUtil(actionDef);
      break;
    case "DataRaptor Turbo Action": // Bleed through and use DR Extract
    case "DataRaptor Extract Action":
      actionUtilClass = new OmniscriptDrExtractActionUtil(actionDef);
      break;
    case "DataRaptor Transform Action":
      actionUtilClass = new OmniscriptDrTransformActionUtil(actionDef);
      break;
    case "DataRaptor Post Action":
      actionUtilClass = new OmniscriptDrPostActionUtil(actionDef);
      break;
    case "Email Action":
      actionUtilClass = new OmniscriptEmailActionUtil(actionDef);
      break;
    case "DocuSign Envelope Action":
      actionUtilClass = new OmniscriptDocusignEnvelopeActionUtil(actionDef);
      break;
    case "Rest Action":
      actionUtilClass = new OmniscriptHttpActionUtil(actionDef);
      break;
    case "Delete Action":
      actionUtilClass = new OmniscriptDeleteActionUtil(actionDef);
      break;
    default:
      actionUtilClass = null;
  }

  return actionUtilClass;
}
