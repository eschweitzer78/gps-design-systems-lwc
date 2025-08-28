import { setExtraParams } from "./setParams.js";
import { pageReferenceTypes } from "c/sfGpsDsOsrtNavigationUtils";
import { namespace } from "c/sfGpsDsOsrtNamespaceUtils";
import { get } from "c/sfGpsDsOsrtLodash";

/**
 *
 * Method to set the page reference details inside action Object
 * @param {String} url Action Url
 * @param {Object} clonedAction Action Object
 * @return {Object}
 */
const fetchPageInfo = (url, clonedAction) => {
  if (url.indexOf("?") !== -1) {
    clonedAction.targetParams = url.match(/\?(.*)/)
      ? url.match(/\?(.*)/)[1]
      : "";
    url = url.replace("?" + clonedAction.targetParams, "");
  }
  let urlArr = url.split("/");
  if (urlArr) {
    let arrLen = urlArr.length;
    const fetchRelationshipInfo = () => {
      let relationshipArr = urlArr.splice(urlArr.indexOf("related"));
      arrLen = urlArr.length;
      clonedAction = {
        ...clonedAction,
        targetName: arrLen > 3 ? urlArr[2] : "",
        targetId: arrLen > 3 ? urlArr[3] : urlArr[2],
        targetRelationship: relationshipArr[1] ? relationshipArr[1] : "",
        targetAction: relationshipArr[2] ? relationshipArr[2] : ""
      };
    };
    if (arrLen > 3) {
      switch (clonedAction.targetType) {
        case "Record":
          clonedAction = {
            ...clonedAction,
            targetName: arrLen > 4 ? urlArr[2] : null,
            targetId: arrLen > 4 ? urlArr[3] : urlArr[2],
            targetAction: arrLen > 4 ? urlArr[4] : urlArr[3]
          };
          break;
        case "Record Relationship":
          fetchRelationshipInfo();
          break;
        case "Knowledge Article":
          clonedAction.targetArticleType = urlArr[2];
          clonedAction.targetName = urlArr[3];
          break;
        default:
          clonedAction.targetName = urlArr[2];
          clonedAction.targetParams =
            urlArr[3] + "?" + clonedAction.targetParams;
          break;
      }
    } else clonedAction.targetName = urlArr[2];
  }
  clonedAction.targetName = clonedAction.targetName.replace("c__", namespace);
  return clonedAction;
};

/**
 *
 *
 * @param {String} val
 * @return {String}
 */
const getFieldValue = (val, stateObj) => {
  let re = /\{([^}]+)\}}/g;
  if (val.charAt(0) === "[") {
    val = get(stateObj, val) || "";
  } else if (val.match(re) && stateObj) {
    let data = val.replace(/[{}]/g, "");
    data = data.slice(data.indexOf(".") + 1, data.length);
    data = stateObj[data];
    val = data ? data : "";
  }
  return val;
};

/**
 *
 * Method to fetch the page reference details from action url
 * @param {String} url Action Url
 * @param {Object} clonedAction Action Object
 * @return {Object}
 */

const fetchPageReferenceType = (url, clonedAction) => {
  if (!url) return clonedAction;
  let urlCopy = url.replace(/^.*\/\/[^/]+/, "");
  let key = urlCopy.match(/^\/([^/]*)\//)
    ? urlCopy.match(/^\/([^/]*)\//)[1]
    : "";
  switch (key) {
    case "cmp":
      clonedAction.targetType = pageReferenceTypes.COMPONENT;
      break;
    case "articles":
      clonedAction.targetType = pageReferenceTypes.KNOWLEDGE_ARTICLE;
      break;
    case "page":
      clonedAction.targetType = pageReferenceTypes.NAMED_PAGE;
      break;
    case "n":
      clonedAction.targetType = pageReferenceTypes.NAVIGATION_ITEM;
      break;
    case "o":
      clonedAction.targetType = pageReferenceTypes.OBJECT;
      break;
    case "r":
      clonedAction.targetType =
        url.indexOf("/related") !== -1
          ? pageReferenceTypes.RELATIONSHIP
          : pageReferenceTypes.RECORD;
      break;
    default:
      clonedAction.targetType = pageReferenceTypes.WEB_PAGE;
      break;
  }
  if (clonedAction.targetType !== pageReferenceTypes.WEB_PAGE) {
    clonedAction = { ...fetchPageInfo(urlCopy, clonedAction) };
    return clonedAction;
  }
  clonedAction.targetName = url;
  return { ...clonedAction };
};

/**
 *
 *
 * @param {Object} action Custom Action Details
 * @param {Object} clonedAction Updated Action Object
 * @return {Object}
 */
const setPageReferenceType = (action, clonedAction, stateObj) => {
  let targetTypeVal = action.targetType;
  clonedAction.targetType = action.targetType ? action.targetType : "";
  if (action[targetTypeVal]) {
    let target = action[targetTypeVal];
    if (target.targetName) {
      clonedAction.targetName = getFieldValue(target.targetName, stateObj);
    }
    if (action.targetType === "App") {
      if (target.appPageRefType) {
        let obj = {};
        obj.type = target.appPageRefType;
        if (target.targetAttrApiName) {
          obj.attributes = {};
          obj.attributes.apiName = target.targetAttrApiName;
        }
        if (target.targetAttrRecordId) {
          obj.attributes = obj.attributes ? obj.attributes : {};
          obj.attributes.recordId = target.targetAttrRecordId;
        }
        if (target.targetAttrActionName && obj.attributes) {
          obj.attributes.actionName = target.targetAttrActionName;
        }
        clonedAction.targetParams = obj;
      }
    } else {
      if (target.targetArticleType) {
        clonedAction.targetArticleType = getFieldValue(
          target.targetArticleType,
          stateObj
        );
      }
      if (target.targetAction) {
        clonedAction.targetAction = getFieldValue(
          target.targetAction,
          stateObj
        );
      }
      if (target.targetId) {
        clonedAction.targetId = getFieldValue(target.targetId, stateObj);
      }
      if (target.targetRelationship) {
        clonedAction.targetRelationship = getFieldValue(
          target.targetRelationship,
          stateObj
        );
      }
    }
  }
  if (clonedAction.targetName) {
    clonedAction.targetName =
      clonedAction.targetType &&
      !["Component", "App"].includes(clonedAction.targetType)
        ? clonedAction.targetName.replace("c__", namespace)
        : clonedAction.targetName;
  }
  //support target parameters for Vlocity Actions
  if (action.targetParams && action.targetType !== "App") {
    clonedAction.targetParams = setExtraParams(action.targetParams);
  }
  return clonedAction;
};

export { fetchPageReferenceType, fetchPageInfo, setPageReferenceType };
