import { handleData } from "c/sfGpsDsOsrtSalesforceUtils";
import {
  getDatahandlerOut,
  isSalesforcePlatform
} from "c/sfGpsDsOsrtSdkUtility";

function getDataHandler(requestData) {
  //Check if it is running on off-platform
  if (isSalesforcePlatform === false) {
    //Calling the off-platform data handler which uses SDK.
    return getDatahandlerOut(requestData);
  }

  if (requestData) {
    let requestObj =
      typeof requestData === "string" ? JSON.parse(requestData) : requestData;

    //Condition to handle all scenario when data not in expected format
    if (requestObj && requestObj.value) {
      if (
        requestObj.value.inputMap &&
        typeof requestObj.value.inputMap !== "string"
      ) {
        requestObj.value.inputMap = JSON.stringify(requestObj.value.inputMap);
      }
      if (
        requestObj.value.optionsMap &&
        typeof requestObj.value.optionsMap !== "string"
      ) {
        requestObj.value.optionsMap = JSON.stringify(
          requestObj.value.optionsMap
        );
      }
      if (
        requestObj.value.headers &&
        typeof requestObj.value.headers !== "string"
      ) {
        requestObj.value.headers = JSON.stringify(requestObj.value.headers);
      }
    }
    requestData = JSON.stringify(requestObj);

    if (
      requestObj.value &&
      requestObj.value.vlocityAsync &&
      (requestObj.type.toLowerCase() === "integrationprocedures" ||
        requestObj.type.toLowerCase() === "apexremote")
    ) {
      let promise = new Promise((resolve, reject) => {
        handleAsynCall(requestData, resolve, reject);
      });
      return promise;
    }
    if (requestObj.type.toLowerCase() === "integrationprocedures") {
      return handleData({
        dataSourceMap: requestData
      })
        .then((res) => {
          return handleOptions(requestData, res);
        })
        .catch((error) => {
          throw error; //handled on cards
        });
    }
    return handleData({
      dataSourceMap: requestData
    });
  }
  return false;
}

function handleAsynCall(requestData, resolve, reject) {
  let requestObj =
    typeof requestData === "string" ? JSON.parse(requestData) : requestData;

  handleData({
    dataSourceMap: requestData
  })
    .then((res) => {
      if (res.result === "WAIT") {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          requestObj.value.stagingObjectId = res.responseId;
          handleAsynCall(JSON.stringify(requestObj), resolve, reject);
        }, requestObj.value.vlocityAsyncTimeout || 1000);
      } else {
        let asynRes = JSON.parse(res.result);
        if (asynRes.error && asynRes.error !== "OK") {
          reject(res.result);
        } else {
          resolve(res.result);
        }
      }
    })
    .catch((error) => {
      reject(error);
    });
}
function handleOptions(requestData, res) {
  const respObj = JSON.parse(res);
  const processedResp = handleQueueableChainable(respObj);
  // chainable support
  if (
    processedResp &&
    processedResp.result &&
    typeof processedResp.result.then === "function"
  ) {
    return processedResp.result.then((vlcParams) => {
      let reqData = JSON.parse(requestData);
      if (vlcParams) {
        reqData.value.inputMap = vlcParams.input;
        reqData.value.optionsMap = vlcParams.options;
      }
      return getDataHandler(JSON.stringify(reqData));
    });
  }
  return res;
}
function handleQueueableChainable(resp) {
  if (
    resp.IPResult &&
    resp.IPResult.hasOwnProperty("vlcIPData") &&
    resp.IPResult.hasOwnProperty("vlcStatus") &&
    resp.IPResult.vlcStatus === "InProgress"
  ) {
    return {
      result: Promise.resolve({
        options: JSON.stringify(resp.IPResult),
        input: "{}"
      })
    };
  }
  return resp;
}

export default getDataHandler;
