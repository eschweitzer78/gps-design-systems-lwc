import { properties } from "./actionUtils.js";
import { interpolate } from "c/sfGpsDsOsrtUtility";
import { get } from "c/sfGpsDsOsrtLodash";

/**
 * Record Data
 * @type {Object}
 * */

let stateObj;

/**
 * Record Data
 * @type {Object} URl Query Params
 * */

let urlParams;

/**
 * Record Data
 * @type {Object} User Profile Data
 * */

let userProfile;

/**
 * To initialize variables
 */
const init = () => {
  let data = { ...properties };
  stateObj = data.stateObj;
  urlParams = data.param;
  userProfile = data.userProfile;
};

/**
 *
 *
 * @param {Object} queryStringObj Action Extra Parameters Object
 * @return {String}  Query String for action url
 */
const buildQueryString = (queryStringObj) => {
  let str = Object.keys(queryStringObj).reduce(function (queryString, key) {
    let value = queryStringObj[key];
    return (
      queryString +
      (queryString.length > 1 ? "&" : "") +
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(value)
    );
  }, "");
  return str;
};

/**
 *
 *
 * @param {Object} paramsArr
 * @param {Boolean} isCustomParam
 * @return {String}
 */
const setExtraParams = (paramsArr, isCustomParam) => {
  init();
  if (
    paramsArr &&
    typeof paramsArr === "object" &&
    Object.keys(paramsArr).length > 0
  ) {
    let checkForBracketField = /\[.*\]/;
    let re = /\{([^}]+)\}}/g;
    let extraParams = { ...paramsArr };
    let isParamSet = false;
    // eslint-disable-next-line @lwc/lwc/no-for-of
    for (const [paramKey, paramVal] of Object.entries(extraParams)) {
      let paramValType = typeof paramVal;
      if (paramVal && paramValType !== "boolean") {
        isParamSet = true;

        if (paramValType === "string" && paramVal.trim() === "{record}") {
          extraParams[paramKey] = stateObj;
        } else if (
          paramValType === "string" &&
          checkForBracketField.test(paramVal) &&
          stateObj
        ) {
          // check for undefined and return empty
          try {
            if (!get(stateObj, paramVal) && JSON.parse(paramVal)) {
              extraParams[paramKey] = paramVal;
            } else {
              extraParams[paramKey] = get(stateObj, paramVal) || "";
            }
          } catch (error) {
            extraParams[paramKey] = get(stateObj, paramVal) || "";
          }
        } else if (paramValType === "string" && paramVal.match(re)) {
          let data = paramVal;
          if (data.indexOf("obj") !== -1 && stateObj) {
            data = paramVal.replace(/[{}]/g, "");
            data = data.slice(data.indexOf(".") + 1, data.length);
            data = stateObj[data];
          } else {
            let paramObj = {
              extraParamKey: data
            };
            if (data.indexOf("params") !== -1) {
              paramObj = interpolate(paramObj, {
                params: urlParams
              });
              data = paramObj.extraParamKey;
            } else if (data.indexOf("$root.vlocity") !== -1) {
              paramObj = interpolate(paramObj, userProfile);
              data = paramObj.extraParamKey;
            }
          }
          extraParams[paramKey] = data ? data : "";
        } else {
          extraParams[paramKey] = paramVal;
        }
      } else {
        isParamSet = true;
        extraParams[paramKey] = paramVal;
      }
    }
    if (isParamSet && isCustomParam) {
      return extraParams;
    }
    if (isParamSet) {
      let extraParamsStr = buildQueryString(extraParams);
      return extraParamsStr;
    }
  }
  return null;
};

export { setExtraParams };
