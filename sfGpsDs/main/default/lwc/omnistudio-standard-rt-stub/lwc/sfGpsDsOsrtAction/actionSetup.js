import {
  interpolateContextId,
  getSObjectType,
  properties,
  uniqueKey
} from "./actionUtils.js";
import {
  namespace,
  interpolate,
  getActions,
  pageReferenceTypes,
  getCommunityPrefix
} from "c/sfGpsDsOsrtUtility";
import { setExtraParams } from "./setParams.js";
import { isSalesforcePlatform } from "c/sfGpsDsOsrtSdkUtility";
import { setPageReferenceType } from "./pageRefHelper.js";
import { find } from "c/sfGpsDsOsrtLodash";

let stateObj, urlParams, userProfile, isCommunity;

/**
 * To initialize variables
 */
const init = () => {
  let data = { ...properties };
  isCommunity = data.isCommunity;
  stateObj = data.stateObj;
  urlParams = data.param;
  userProfile = data.userProfile;
};

/**
 *
 * Method to set Vlocity Action Object
 * @param {Object} action
 * @param {Boolean} disableCache
 * @memberof Action
 */
const setVlocityAction = (action, disableCache) => {
  init();
  return new Promise((resolve, reject) => {
    if (isSalesforcePlatform === false) {
      reject("Off Platform");
    }
    //let device = typeof ionic !== 'undefined' && ionic.Platform ? 'Mobile' : 'Web Client'; // Pending
    getActions(disableCache)
      .then((allActions) => {
        let selectedAction = allActions[action.name] || allActions[action.id];
        if (selectedAction) {
          selectedAction[namespace + "Url__c"] =
            selectedAction[namespace + "Url__c"] ||
            selectedAction[namespace + "URL__c"];
          let actionDef = { ...selectedAction };
          let device = "Web Client";
          let displayOnFlag;
          let customIcon;
          actionDef.description =
            actionDef.description || actionDef[namespace + "Description__c"];
          actionDef.keyword =
            actionDef.keyword || actionDef[namespace + "Keyword__c"];
          let clonedAction = {
            ...actionDef,
            keyId: actionDef.Id
              ? actionDef.Id + "-action-" + uniqueKey()
              : "action-" + uniqueKey(),
            replace:
              actionDef.openMode && actionDef.openMode.indexOf("New") === -1
                ? true
                : false,
            openUrl: "Current Window",
            iconName:
              actionDef.vlocityIcon && !/^icon-/.test(actionDef.vlocityIcon)
                ? actionDef.vlocityIcon.replace("-", ":")
                : actionDef.vlocityIcon
                  ? "utility:forward_up"
                  : "",
            inputMap: action[namespace + "InvokeClassName__c"]
              ? action.inputMap
              : "",
            optionsMap: action[namespace + "InvokeClassName__c"]
              ? action.optionsMap
              : "",
            hasExtraParams: action.hasExtraParams
              ? action.hasExtraParams
              : false,
            extraParams: action.extraParams ? action.extraParams : {}
          };
          displayOnFlag = clonedAction[namespace + "DisplayOn__c"];
          if (clonedAction.Attachments && clonedAction.Attachments.length > 0) {
            clonedAction.imageRef =
              (isCommunity ? getCommunityPrefix() : "") +
              "/servlet/servlet.FileDownload?file=" +
              clonedAction.Attachments[0].Id;
          } else if (
            clonedAction.ContentDocumentLinks &&
            clonedAction.ContentDocumentLinks.length > 0
          ) {
            customIcon = find(clonedAction.ContentDocumentLinks, {
              ContentDocument: { Title: clonedAction.vlocityIcon }
            });
            clonedAction.imageRef =
              customIcon &&
              (isCommunity ? getCommunityPrefix() : "") +
                "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId=" +
                customIcon.ContentDocument.LatestPublishedVersionId;
          }
          clonedAction.hasIcon =
            clonedAction.iconName || clonedAction.imageRef ? true : false;
          let objType = getSObjectType() ? getSObjectType() : "All";
          //this will match the applicable obj type to match the objType of the card or 'All'
          let actionApplicableTypes =
            clonedAction[namespace + "ApplicableTypes__c"];
          let objMatchesFlag =
            objType === "All" ||
            (actionApplicableTypes &&
              (actionApplicableTypes.indexOf(objType) > -1 ||
                actionApplicableTypes.indexOf("All") > -1));
          if (
            (displayOnFlag === "All" || displayOnFlag === device) &&
            objMatchesFlag
          ) {
            resolve(clonedAction);
          } else {
            reject(
              clonedAction.displayName + " vlocity action cannot be accessed"
            );
          }
        } else {
          reject(`"${action.name}" vlocity action is not present`);
        }
      })
      .catch((e) => {
        reject(`Error in "${action.name}" : ${e}`);
      });
  });
};

/**
 *
 * Method to set custom action Object
 * @param {Object} action Custom Action Object
 * @return {Object} Updated Action Object
 */

const setCustomAction = (action) => {
  init();
  let clonedCustomAction = {
    ...action,
    openUrl: "Current Window",
    replace:
      action.openUrlIn &&
      action.openUrlIn.indexOf("New") === -1 &&
      action.openUrlIn !== "_blank"
        ? true
        : false,
    keyId: action.Id
      ? action.Id + "-custom-action-" + uniqueKey()
      : "custom-action-" + uniqueKey(),
    iconName:
      action.vlocityIcon && !/^icon-/.test(action.vlocityIcon)
        ? action.vlocityIcon.replace("-", ":")
        : action.vlocityIcon
          ? "utility:forward_up"
          : ""
  };

  clonedCustomAction.hasIcon = clonedCustomAction.iconName ? true : false;
  if (clonedCustomAction.targetType) {
    clonedCustomAction = setPageReferenceType(
      action,
      clonedCustomAction,
      stateObj
    );
    let data = {
      isPageRefSet: "true",
      action: clonedCustomAction
    };
    return data;
  }
  let actionUrl = action.url ? action.url : "";
  let re = /\{([^}]+)\}}/g;
  let paramsArr = actionUrl ? actionUrl.match(re) : [];
  if (paramsArr) {
    paramsArr.forEach((val) => {
      let data = val.replace(/[{}]/g, "");
      data = data.slice(data.indexOf(".") + 1, data.length);
      data = stateObj[data];
      if (data) {
        actionUrl = actionUrl.replace(val, data);
      }
    });
  }
  if (action.hasExtraParams) {
    let extraParams = setExtraParams(action.extraParams);
    if (extraParams) {
      let seperator = actionUrl.indexOf("?") === -1 ? "?" : "&";
      actionUrl = actionUrl + seperator + extraParams;
    }
  }
  //method to resolve {{params}}
  let urlObj = {
    url: actionUrl
  };
  if (actionUrl.indexOf("params") !== -1) {
    urlObj = interpolate(urlObj, {
      params: urlParams
    });
    actionUrl = urlObj.url;
  }
  if (actionUrl.indexOf("$root.vlocity") !== -1) {
    urlObj = interpolate(urlObj, userProfile);
    actionUrl = urlObj.url;
  }

  let data = {
    actionUrl: actionUrl,
    action: clonedCustomAction
  };
  return data;
};

/**
 *
 * Method to set OS action Object
 * @param {Object} action OS Action Object
 * @return {Object}
 */
const setOsAction = (action) => {
  init();
  let clonedOSAction = {
    ...action,
    openUrl: "Current Window",
    replace:
      action.openUrlIn &&
      action.openUrlIn.indexOf("New") === -1 &&
      action.openUrlIn !== "_blank"
        ? true
        : false,
    keyId: action.Id
      ? action.Id + "-custom-action-" + uniqueKey()
      : "custom-action-" + uniqueKey(),
    targetType: pageReferenceTypes.WEB_PAGE,
    iconName:
      action.vlocityIcon && !/^icon-/.test(action.vlocityIcon)
        ? action.vlocityIcon.replace("-", ":")
        : action.vlocityIcon
          ? "utility:forward_up"
          : ""
  };
  clonedOSAction.hasIcon = clonedOSAction.iconName ? true : false;
  if (
    clonedOSAction.ContextId &&
    typeof clonedOSAction.ContextId === "string"
  ) {
    clonedOSAction.ContextId = interpolateContextId(clonedOSAction.ContextId);
  }
  return clonedOSAction;
};

/**
 *
 * Method to set Event Action Object
 * @param {Object} action Event Action Object
 * @return {Object}
 */
const setEventAction = (action) => {
  init();
  let clonedAction = {
    ...action,
    iconName:
      action.vlocityIcon && !/^icon-/.test(action.vlocityIcon)
        ? action.vlocityIcon.replace("-", ":")
        : action.vlocityIcon
          ? "utility:forward_up"
          : ""
  };
  clonedAction.hasIcon = clonedAction.iconName ? true : false;
  return clonedAction;
};

export { setVlocityAction, setCustomAction, setOsAction, setEventAction };
