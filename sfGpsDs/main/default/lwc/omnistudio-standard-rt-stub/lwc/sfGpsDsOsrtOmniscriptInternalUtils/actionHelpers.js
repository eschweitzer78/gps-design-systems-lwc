import { handleMergeField, isRepeatNotation } from "./scriptHelpers";
import { mergeWith } from "c/sfGpsDsOsrtLodash";
import { isOffPlatform, isCommunityURL } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { mergeJSONLogic } from "./mergeJSONLogic";
import { getNamespaceDotNotation } from "./namespaceHandler";

/**
 * Serializes an object into a formatted string to be used as a REST GET
 * parameter.
 * @param {object} obj
 * @returns {string}
 */
export const serializeObj = (obj) => {
  let str = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
  }

  return str.join("&");
};

/**
 * Issues HTTP requests utilizing XMLHttpRequest. Pass in an object that has the
 * required XMLHttpRequest properties. Returns a response promise.
 * @param {object} obj - properties url and headers are required
 * @returns {void}
 */
export const sendRequest = (obj, comp) => {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    const url = obj.params
      ? `${obj.url}${obj.url.includes("?") ? "&" : "?"}${serializeObj(obj.params)}`
      : obj.url;

    xhr.open(obj.method || "GET", url, obj.async || true);
    xhr.withCredentials = obj.withCredentials || false;

    if (Object.keys(obj.headers).length > 0) {
      Object.keys(obj.headers).forEach((key) => {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    } else {
      // defaults to accept all request types
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        res(xhr.response);
      } else {
        rej("Error in HTTP request");
      }
    };

    xhr.ontimeout = () => {
      rej(
        comp.scriptHeaderDef.allCustomLabels
          ? comp.scriptHeaderDef.allCustomLabels.OmniRemoteCallTimeout
          : "OmniRemoteCallTimeout"
      );
    };

    xhr.onerror = () => {
      rej("Error in HTTP request");
    };

    xhr.send(JSON.stringify(obj.data) || null);
  });
};

/**
 * Evaluates spinner conditions depending on action invoke mode type.
 * @param {object} element
 * @returns {boolean}
 */
export const evalSpinnerCond = (element) => {
  const noSpinnerConditions = ["fireAndForget", "noBlock"];
  const invokeMode = element.propSetMap.invokeMode;

  if (
    !invokeMode ||
    (invokeMode && noSpinnerConditions.indexOf(invokeMode) === -1)
  ) {
    return true;
  }

  return false;
};

/**
 * @description Sets the spinner action message.
 * @param {object} element
 * @returns {string}
 */
export const setSpinnerActionMessage = (element) => {
  if (
    element.propSetMap.enableActionMessage &&
    element.propSetMap.inProgressMessage
  ) {
    return element.propSetMap.inProgressMessage;
  }

  return "";
};

export function setHttpDebugData(params, resp, label, element) {
  let path, method, input, options, type;

  switch (element.propSetMap.type) {
    case "Apex":
      // eslint-disable-next-line no-case-declarations
      const parsedOptions = JSON.parse(params.options);
      path = parsedOptions.restOptions.restPath;
      method = parsedOptions.restOptions.type || "GET";
      input = params.input;
      options = params.options;
      type = element.propSetMap.type.toLowerCase();
      break;
    case "Web":
      path = params.restOptions.restPath;
      method = params.restOptions.restMethod;
      input = {
        params: params.restOptions.params,
        headers: params.restOptions.headers
      };
      type = element.propSetMap.type.toLowerCase();
      break;
    default:
      path = params.sClassName;
      method = params.sMethodName;
      input = params.input;
      options = params.options;
  }

  const debugParams = {
    sClassName: path,
    sMethodName: method,
    options: options,
    input: input
  };
  const debugData = {
    params: debugParams,
    response: resp,
    element: { label: label, type: type }
  };

  return debugData;
}

/**
 * @description Dispatches debug events for HTTP/REST actions
 * @param {*} comp
 * @param {Object} params
 * @param {Object} response
 * @param {String} label
 * @param {Object} element
 * @param {String} eventName
 * @returns {void}
 */
export function sendHttpDataToDebugConsole(
  comp,
  params,
  response,
  label,
  element,
  eventName
) {
  const debugData = setHttpDebugData(params, response, label, element);

  if (comp && comp.dispatchOmniEventUtil) {
    comp.dispatchOmniEventUtil(comp, debugData, eventName);
  }
}

/**
 * @description Handles extra payloads for omniscript elements
 * @param {object} payloadProp
 * @param {object} input
 * @param {*} comp
 * @param {object} [compJsonData] - nonproxy jsonData
 * @returns {object}
 */
export function handleExtraPayload(payloadProp, input, comp, compJsonData) {
  let payloadPropStr = JSON.stringify(payloadProp);
  payloadPropStr = handleMergeField(
    payloadPropStr,
    compJsonData || JSON.parse(comp.jsonDataStr),
    comp?.scriptHeaderDef?.labelMap || compJsonData.labelMap,
    isRepeatNotation(payloadPropStr) ? comp.jsonDef.JSONPath : null
  );
  const payloadObj = JSON.parse(payloadPropStr);
  return mergeWith(input, payloadObj, mergeJSONLogic);
}

/**
 * @description Gets the URL path.
 * @param {String} page
 * @returns {String}
 */
export function getUrl(page) {
  if (isOffPlatform()) {
    return Promise.resolve(window.location.origin + "/" + page + ".html");
  }
  const ns = getNamespaceDotNotation();
  return isCommunityURL().then((isCommunity) => {
    const pathName = isCommunity
      ? "/" +
        document.location.pathname.replace(/(^\/?)/, "/").split("/")[1] +
        "/"
      : document.location.pathname.substring(
          0,
          document.location.pathname.indexOf("/apex")
        ) + "/apex/";
    const url = `${pathName}${ns.substring(0, ns.indexOf("."))}__${page}`;
    return `${document.location.protocol}//${document.location.host}${url}`;
  });
}
