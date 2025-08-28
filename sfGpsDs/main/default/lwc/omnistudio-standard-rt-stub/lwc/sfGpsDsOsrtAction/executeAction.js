import {
  getSORecord,
  getSObjectType,
  getCommunityName,
  properties
} from "./actionUtils.js";
import { fetchPageReferenceType } from "./pageRefHelper.js";
import { setExtraParams } from "./setParams.js";
import { namespace } from "c/sfGpsDsOsrtNamespaceUtils";
import { getUrlForAction } from "c/sfGpsDsOsrtActionUtility";
let actionDetails,
  actionUrl,
  stateObj,
  hasExtraParams,
  extraParams,
  contextId,
  isCommunity;

/**
 * To initialize variables
 */
const init = () => {
  let data = { ...properties };
  actionDetails = { ...data.actionDetails };
  stateObj = data.stateObj;
  contextId = data.contextId;
  actionUrl = data.actionUrl;
  hasExtraParams = actionDetails.hasExtraParams;
  extraParams = actionDetails.extraParams;
  isCommunity = data.isCommunity;
};

const getResult = () => {
  return {
    data: actionDetails,
    status: "Success"
  };
};

const configPageRef = () => {
  //support extra parameters for Vlocity Actions
  if (actionDetails.hasExtraParams) {
    let seperator = actionUrl.indexOf("?") === -1 ? "?" : "&";
    actionUrl += seperator + setExtraParams(actionDetails.extraParams);
  }
  actionDetails = fetchPageReferenceType(actionUrl, actionDetails);
};

const fireCustomAction = () => {
  return new Promise((resolve) => {
    init();
    configPageRef();
    let result = getResult();
    resolve(result);
  });
};

/**
 * To fire Vlocity Action
 */
const fireVlocityAction = () => {
  return new Promise((resolve, reject) => {
    init();
    if (
      actionUrl &&
      actionDetails[namespace + "UrlParameters__c"] &&
      /\{.*\}/.test(actionUrl)
    ) {
      let record = getSORecord(stateObj);
      actionDetails.contextId = contextId
        ? contextId
        : record
          ? record.Id
          : null;
      actionDetails.sObjType = getSObjectType(stateObj);
      let myparams = {
        actionId: actionDetails.Id,
        contextId: actionDetails.contextId,
        objType: actionDetails.sObjType
      };
      getUrlForAction(myparams)
        .then((url) => {
          //support extra parameters for Vlocity Actions
          if (hasExtraParams) {
            let seperator = url.indexOf("?") === -1 ? "?" : "&";
            url += seperator + setExtraParams(extraParams);
          }
          if (isCommunity) {
            if (actionDetails[namespace + "LinkType__c"] === "OmniScript")
              url =
                getCommunityName() + "/os?actionUrl=" + encodeURIComponent(url);
            else if (
              actionDetails[namespace + "LinkType__c"] === "CommunityUrl"
            )
              url = getCommunityName() + url;
          }

          actionUrl = url;
          actionDetails = fetchPageReferenceType(url, actionDetails);
          let result = getResult();
          resolve(result);
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    } else {
      resolve(fireCustomAction());
    }
  });
};
/**
 * Method to generate OS lwc name
 * @param {Array} omniscriptTypeArr It contains type, subtype & language of OS
 * @return {String}
 */
function getOmniScriptLwcName(omniscriptTypeArr) {
  let type = omniscriptTypeArr[0];
  let subType = omniscriptTypeArr[1];
  let language = omniscriptTypeArr[2];
  const cpType = type ? type.charAt(0).toLowerCase() + type.slice(1) : type;
  const cpSubType = subType
    ? subType.charAt(0).toUpperCase() + subType.slice(1)
    : subType;
  const cpLanguage = language ? language.replace(/[\s()-]+/gi, "") : language;
  return cpType + cpSubType + cpLanguage;
}

/**
 *
 * Method to trigget OS action
 */
const performOsAction = () => {
  return new Promise((resolve) => {
    init();
    // To create OS action url
    let record = getSORecord();
    let queryStringObj = {};
    let omniscriptTypeArr =
      actionDetails.omniType && actionDetails.omniType.Name
        ? actionDetails.omniType.Name.split("/")
        : [];
    if (actionDetails.isLwcOS) {
      if (omniscriptTypeArr?.length) {
        actionDetails.omniScript = actionDetails.omniScript
          ? actionDetails.omniScript
          : {};
        actionDetails.omniScript.omniScriptLwcName =
          getOmniScriptLwcName(omniscriptTypeArr);

        queryStringObj.c__target =
          (actionDetails.orgNsPrefix ? actionDetails.orgNsPrefix : "c") +
          ":" +
          actionDetails.omniScript.omniScriptLwcName;
      } else {
        queryStringObj.c__target = "";
      }
      queryStringObj.c__layout = actionDetails.layoutType
        ? actionDetails.layoutType
        : "lightning";
      let ctxId =
        actionDetails.ContextId || contextId || (record && record.Id) || "";
      if (ctxId) {
        if (/^\d+$/.test(ctxId)) {
          queryStringObj.c__ContextId = `"${ctxId}"`;
        } else {
          queryStringObj.c__ContextId = ctxId;
        }
      }
      if (actionDetails.tabIcon)
        queryStringObj.c__tabIcon = actionDetails.tabIcon;
      if (actionDetails.tabLabel)
        queryStringObj.c__tabLabel = actionDetails.tabLabel;
    } else {
      let ctxId =
        actionDetails.ContextId || contextId || (record && record.Id) || "";

      actionDetails.omniScript = actionDetails.omniScript
        ? actionDetails.omniScript
        : {};
      actionDetails.omniScript.OmniScriptType = omniscriptTypeArr[0];
      actionDetails.omniScript.OmniScriptSubType = omniscriptTypeArr[0];
      actionDetails.omniScript.OmniScriptLang = omniscriptTypeArr[0];

      queryStringObj = {
        id: record ? record.Id : null,
        ContextId: ctxId,
        OmniScriptType: omniscriptTypeArr[0],
        OmniScriptSubType: omniscriptTypeArr[1],
        OmniScriptLang: omniscriptTypeArr[2],
        layout: actionDetails.layoutType
          ? actionDetails.layoutType
          : "lightning"
      };
    }

    let actionParams = actionDetails.extraParams;

    let paramsString = Object.keys(queryStringObj).reduce(function (
      queryString,
      key
    ) {
      let value = queryStringObj[key];
      if (!actionParams || !actionParams[key]) {
        return (
          queryString +
          (queryString.length > 1 ? "&" : "") +
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(value)
        );
      }
      return queryString;
    }, "");
    if (actionDetails.isLwcOS) {
      let urlPrefix = isCommunity
        ? getCommunityName() + "/lwcos?"
        : "/lightning/cmp/" + namespace + "vlocityLWCOmniWrapper?";
      actionDetails.targetName = urlPrefix + paramsString;
    } else {
      let vForcePage = actionDetails.vForcewithNsPrefix
        ? actionDetails.vForcewithNsPrefix
        : (namespace ? namespace : "c__") + "OmniScriptUniversalPage";
      let url = "/apex/" + vForcePage + "?" + paramsString;
      if (isCommunity)
        url = getCommunityName() + "/os?actionUrl=" + encodeURIComponent(url);
      actionDetails.targetName = url;
    }
    //actionDetails.targetParams = paramsString;
    // To append extra params

    if (actionDetails.hasExtraParams) {
      extraParams = setExtraParams(actionDetails.extraParams);
      if (extraParams)
        actionDetails.targetName = actionDetails.targetName
          ? actionDetails.targetName + "&" + extraParams
          : extraParams;
    }
    let result = getResult();
    result.details = queryStringObj;
    resolve(result);
  });
};

export { fireVlocityAction, performOsAction, fireCustomAction };
