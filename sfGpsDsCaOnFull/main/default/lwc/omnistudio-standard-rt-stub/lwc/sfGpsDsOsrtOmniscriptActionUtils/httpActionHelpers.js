import {
  handleMergeField,
  isRepeatNotation
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * @description Gets remote options for HTTP.
 * @param {*} comp
 * @param {Object} element
 * @param {Object} compJsonData
 * @returns {Object}
 */
export function getHttpRemoteOptions(comp, element, compJsonData) {
  let path = element.propSetMap.restPath,
    restOptions = element.propSetMap.restOptions || {};

  // mergefield support for the REST path
  path = handleMergeField(
    path,
    compJsonData,
    comp.scriptHeaderDef.labelMap,
    isRepeatNotation(path) ? element.JSONPath : null
  );

  if (restOptions.URIEncode) {
    // encodes path
    path = encodeURI(path);
  }

  const remoteOptions = {
    restOptions: {
      ...restOptions,
      type: element.propSetMap.restMethod,
      restPath: path,
      namedCredential: element.propSetMap.namedCredential,
      restMethod: element.propSetMap.restMethod,
      xmlPreTransformBundle: element.propSetMap.xmlPreTransformBundle,
      xmlPostTransformBundle: element.propSetMap.xmlPostTransformBundle,
      body: ""
    }
  };

  if (element.propSetMap.type !== "Apex") {
    let restHeaders = remoteOptions.restOptions.headers;
    let restParams = remoteOptions.restOptions.params;
    let tempStr;

    if (Object.keys(restHeaders).length > 0) {
      tempStr = JSON.stringify(restHeaders);
      restHeaders = JSON.parse(
        handleMergeField(
          tempStr,
          compJsonData,
          comp.scriptHeaderDef.labelMap,
          isRepeatNotation(tempStr) ? element.JSONPath : null
        )
      );
    }

    if (Object.keys(restParams).length > 0) {
      tempStr = JSON.stringify(restParams);
      restParams = JSON.parse(
        handleMergeField(
          tempStr,
          compJsonData,
          comp.scriptHeaderDef.labelMap,
          isRepeatNotation(tempStr) ? element.JSONPath : null
        )
      );

      if (element.propSetMap.restOptions.URIEncode) {
        for (let key in restParams) {
          if (restParams.hasOwnProperty(key)) {
            restParams[key] = encodeURI(restParams[key]);
          }
        }
      }
    }

    remoteOptions.restOptions.headers = restHeaders;
    remoteOptions.restOptions.params = restParams;
  }

  return remoteOptions;
}
