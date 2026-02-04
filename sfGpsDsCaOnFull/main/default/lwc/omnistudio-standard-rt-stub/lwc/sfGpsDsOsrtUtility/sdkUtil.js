import { fetchUserContext } from "c/sfGpsDsOsrtSalesforceUtils";

let singletonSDKMap = {};
let retryCounter = 3;
let defaultNamespace = "vlocity_cmt";
let currentCounter = retryCounter;
let apiUrl = "";
let customSalesforceUrl = null;
let isSDKLoadingStarted = false;
let promiseInstance = null;

export function getSDKInstance(namespace, sdkObject) {
  if (!namespace) namespace = defaultNamespace;
  if (singletonSDKMap[namespace] && singletonSDKMap[namespace][sdkObject]) {
    return Promise.resolve(singletonSDKMap[namespace][sdkObject]);
  }
  if (!isSDKLoadingStarted) {
    isSDKLoadingStarted = true;
    promiseInstance = initiateSDKInstance(namespace, sdkObject).then(
      (sdkInstance) => {
        isSDKLoadingStarted = false;
        currentCounter = retryCounter;
        return sdkInstance;
      }
    );
  }
  return promiseInstance;
}

export function isSDKInstanceAvailable(namespace, sdkObject) {
  if (!namespace) namespace = defaultNamespace;
  if (singletonSDKMap[namespace] && singletonSDKMap[namespace][sdkObject]) {
    return singletonSDKMap[namespace][sdkObject] ? true : false;
  }
  return false;
}

function initiateSDKInstance(namespace, sdkObject) {
  return (
    fetchUserDetails()
      .then((response) => {
        let sdkConfig = null;
        if (response && response.sessionId !== "") {
          // login user
          if (sdkObject) {
            if (!apiUrl) {
              response.salesforceURL =
                customSalesforceUrl || response.salesforceURL;
              sdkConfig = window.VlocitySDK[sdkObject].createConfigForLoginUser(
                response.salesforceURL,
                response.sessionId
              );
            }
            if (!singletonSDKMap[namespace]) {
              singletonSDKMap[namespace] = {};
            }
            singletonSDKMap[namespace][sdkObject] =
              window.VlocitySDK[sdkObject].getInstance(sdkConfig);
            let re = /__$/;
            response.namespacePrefix = response.namespacePrefix.replace(re, "");
            singletonSDKMap[namespace][sdkObject].apiURL = apiUrl || "";
            singletonSDKMap[namespace][sdkObject].namespace =
              response.namespacePrefix;
          } else {
            return Promise.reject("sdk entry is required");
          }
        }
        return singletonSDKMap[namespace][sdkObject];
      })
      // eslint-disable-next-line consistent-return
      .catch((e) => {
        if (currentCounter === 0) {
          currentCounter = retryCounter;
          return Promise.reject(e);
        }
        currentCounter--;
        initiateSDKInstance(namespace, sdkObject)
          .then(Promise.resolve)
          .catch(Promise.reject);
      })
  );
}

function fetchUserDetails() {
  return fetchUserContext().then((response) => {
    if (!response) {
      return null;
    }
    return JSON.parse(response);
  });
}
