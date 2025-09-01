import { get } from "c/sfGpsDsOsrtLodash";
import {
  interpolateWithRegex,
  interpolateKeyValue
} from "c/sfGpsDsOsrtUtility";
/**
 * Record Data
 * @type {Object}
 * */
let stateObj;

/**
 * Action Context Id
 * @type {String}
 * */
let contextId;

/**
 * State Object Type
 * @type {String}
 * */
let sObjectType;

/**
 * All card merge fields
 * @type {Object}
 * */
let _allMergeFields;

/**
 * To store the common action properties
 * @type {Object}
 * */
let properties = {};

/**
 * Regex to interpolate action object
 * @type {String}
 * */
let _regexPattern = /\{([a-zA-Z.0-9_]*)\}/g;

/**
 * To initialize variables
 */
const fetchProperties = (data) => {
  properties = { ...data };
  stateObj = properties.stateObj;
  contextId = properties.contextId;
  sObjectType = properties.sObjectType;
  _allMergeFields = properties._allMergeFields;
};

/**
 * @param {Object} obj State Object
 * @return {Object}
 */

const getSORecord = () => {
  if (contextId) {
    return { Id: contextId };
  } else if (stateObj) {
    if (stateObj.actionCtxId) {
      let ctxId =
        stateObj.actionCtxId.charAt(0) === "["
          ? get(stateObj, stateObj.actionCtxId) || ""
          : stateObj.actionCtxId;
      return { Id: ctxId };
    } else if (stateObj.Id) {
      return { Id: stateObj.Id };
    }
  }
  return null;
};

/**
 *
 * @return {String} Object Type
 */
const getSObjectType = () => {
  let objType = null;
  // Check if obj exists and is an sObject, otherwise use setting
  // If it fails set object type as all to get actions anyway
  if (sObjectType) {
    objType = sObjectType;
  } else if (stateObj && stateObj.attributes && stateObj.attributes.type) {
    objType = stateObj.attributes.type;
  } else if (!contextId) {
    objType = "All";
  }
  return objType;
};

/**
 * Method to fetch the community name from url
 * @return {String}
 */
const getCommunityName = () => {
  var cName = "";
  var sPageURL = window.location.href; //You get the whole decoded URL of the page.
  var aElement = document.createElement("a");
  aElement.href = sPageURL;
  cName = aElement.pathname.replace(/(^\/?)/, "/").split("/")[1];
  return cName === "s" ? "/" + cName : "/" + cName + "/s";
};

/**
 *
 * Method to interpolate the action object using record object and merge fields
 * @param {*} actionObj Action Object to be interpolated
 */
const interpolateAction = (actionObj) => {
  if (!actionObj) {
    return {};
  }
  let action = { ...actionObj };
  // To interpolate record values.
  if (stateObj) {
    _allMergeFields = _allMergeFields || {};
    let objectToInterpolate = { ..._allMergeFields, ...stateObj };
    action = interpolateWithRegex(action, objectToInterpolate, _regexPattern);
    if (action.hasExtraParams && action.extraParams) {
      action.extraParams = interpolateKeyValue(
        action.extraParams,
        objectToInterpolate,
        _regexPattern
      );
    }
  } else if (
    _allMergeFields &&
    (action.type !== "cardAction" ||
      (action.type === "cardAction" && action.eventName === "setValues"))
  ) {
    action = interpolateWithRegex(action, _allMergeFields, _regexPattern);
    if (action.hasExtraParams && action.extraParams) {
      action.extraParams = interpolateKeyValue(
        action.extraParams,
        _allMergeFields,
        _regexPattern
      );
    }
  }
  return { ...action };
};

/**
 *
 * Method to interpolate Action Context ID
 * @param {String} ctxId Action Context ID
 * @return {String}
 */
const interpolateContextId = (ctxId) => {
  if (ctxId && ctxId.indexOf("{") !== -1) {
    let ctxObj = { Id: ctxId };
    if (stateObj) {
      ctxObj = interpolateWithRegex(ctxObj, stateObj, _regexPattern);
    }
    if (_allMergeFields) {
      ctxObj = interpolateWithRegex(ctxObj, _allMergeFields, _regexPattern);
    }
    ctxId = ctxObj.Id;
  } else if (ctxId && ctxId.charAt(0) === "[" && stateObj) {
    ctxId = get(stateObj, ctxId) || "";
  }
  return ctxId;
};

/**
 * Method to validate the stringified JSON object
 * @param {String} str
 * @return {Object}
 */
const validObj = (str) => {
  try {
    if (str.charAt(0) === "\\") {
      str = str.substring(1);
    }
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};

/**
 * Method to generate a unique key
 * @return {String}
 */
const uniqueKey = () => {
  return Date.now() + "-" + Math.random();
};

/**
 * Method to interolate a field
 * @param {String} val
 * @return {String}
 */
const interpolateValue = (val) => {
  if (val && val.indexOf("{") !== -1) {
    let stringToInterpolate = val;
    return stringToInterpolate.replace(/\{(.*?)\}/g, (match, expr) => {
      let fieldValue;
      if (stateObj) {
        fieldValue = get(stateObj, expr);
      }
      if (_allMergeFields && typeof fieldValue === "undefined") {
        fieldValue = get(_allMergeFields, expr);
      }
      return typeof fieldValue !== "undefined" ? fieldValue : "";
    });
  }
  return val;
};

export {
  fetchProperties,
  properties,
  getSORecord,
  getSObjectType,
  getCommunityName,
  interpolateAction,
  interpolateContextId,
  validObj,
  uniqueKey,
  interpolateValue
};
