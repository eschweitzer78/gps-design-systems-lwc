import { properties } from "./actionUtils.js";

let actionDetails, actionUrl;
const init = () => {
  let data = { ...properties };
  actionDetails = { ...data.actionDetails };
  actionUrl = data.actionUrl;
};

/**
 *
 *
 * @param {*} key
 * @param {*} obj
 * @return {*}
 * @memberof Action
 */
const fetchActionEvtObject = (key, obj) => {
  return new Promise((resolve) => {
    init();
    let actionEventObj = {};
    if (actionDetails.displayName)
      actionEventObj.name = actionDetails.displayName;
    switch (key) {
      case "PubSub":
        actionEventObj.title = "Pubsub";
        actionEventObj.channel = actionDetails.eventName;
        actionEventObj.event = actionDetails.message;
        actionEventObj.inputMap = obj;
        break;
      case "Custom":
        actionEventObj.title = "Custom";
        actionEventObj.inputMap = obj;
        actionEventObj.event = actionDetails.eventName;
        break;
      case "Flyout":
        actionEventObj.title = "Flyout";
        actionEventObj.flyoutType = actionDetails.flyoutType;
        actionEventObj.flyoutName = actionDetails.flyoutLwc;
        actionEventObj.openFlyoutInMode = actionDetails.openFlyoutIn;
        if (actionDetails.flyoutParams) {
          actionEventObj.attributes = { ...actionDetails.flyoutParams };
        }
        break;
      case "updateOmniScript":
        actionEventObj.title = "Update Omniscript";
        actionEventObj.inputMap = obj;
        if (actionDetails.elementId)
          actionEventObj.parentNode = actionDetails.elementId;
        break;
      case "OmniScript":
        actionEventObj = {
          title: "OmniScript",
          config: obj,
          targetUrl: actionDetails.targetName,
          ...actionEventObj
        };
        if (actionDetails.hasExtraParams) {
          actionEventObj.inputMap = { ...actionDetails.extraParams };
        }
        break;
      case "Navigate Action":
        actionEventObj = {
          title: "Navigate Action",
          config: obj ? { ...obj } : {},
          ...actionEventObj
        };
        break;
      case "Vlocity Action":
        actionEventObj = {
          title: "Vlocity Action",
          sObject: actionDetails.sObjType ? actionDetails.sObjType : "",
          contextId: actionDetails.contextId ? actionDetails.contextId : "",
          ...actionEventObj
        };
        if (actionDetails.extraParams)
          actionEventObj.inputMap = {
            ...actionDetails.extraParams
          };
        actionEventObj.targetUrl = actionUrl;
        break;
      default:
    }
    resolve(actionEventObj);
  });
};

export { fetchActionEvtObject };
