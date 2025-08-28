import { loadScript } from "lightning/platformResourceLoader";
import { fetchUserContext, datasource } from "c/sfGpsDsOsrtSalesforceUtils";
import getDataHandler from "./dataHandler";
import { namespace } from "./namespace";

let sdkFactory = {};
let isScriptLoaded;

function getDatasourceSDK(url, sessionId, requestData) {
  let dataSourceConfig = null;
  return getDataHandler(JSON.stringify(requestData))
    .then((data) => {
      dataSourceConfig =
        window.VlocitySDK.datasource.createConfigForDatasourceUser(
          url,
          sessionId,
          data
        );
      sdkFactory[namespace] =
        window.VlocitySDK.datasource.getInstance(dataSourceConfig);
      sdkFactory[namespace].config.inPlatformData = data;
      return sdkFactory[namespace];
    })
    .catch((e) => {
      throw new Error(`Error:`, e);
    });
}

function fetchUserDetails() {
  let userContext = null;
  return fetchUserContext()
    .then((response) => {
      userContext = JSON.parse(response);
      return userContext;
    })
    .catch((e) => {
      throw new Error(`Error:`, e);
    });
}

export function getSDKInstance(requestData, context) {
  if (sdkFactory[namespace]) {
    return getDataHandler(JSON.stringify(requestData)).then((data) => {
      sdkFactory[namespace].config.inPlatformData = data;
      return sdkFactory[namespace];
    });
  }
  return loadDatasource(context).then((response) => {
    return getDatasourceSDK(response.url, response.sessionId, requestData);
  });
}

function loadDatasource(context) {
  if (!isScriptLoaded) {
    isScriptLoaded = loadScript(
      context,
      datasource + "/latest/datasource/datasource.sdk.js"
    )
      .then(() => {
        return fetchUserDetails().then((response) => {
          return Promise.resolve({
            url: response.salesforceURL,
            sessionId: response.sessionId
          });
        });
      })
      .catch((e) => {
        throw new Error(`Error:`, e);
      });
    return isScriptLoaded;
  }
  return isScriptLoaded;
}
