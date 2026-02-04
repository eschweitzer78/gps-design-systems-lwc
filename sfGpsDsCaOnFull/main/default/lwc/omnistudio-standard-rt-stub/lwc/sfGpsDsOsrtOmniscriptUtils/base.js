import pubsub from "c/sfGpsDsOsrtPubsub";
import {
  handleMergeField,
  isRepeatNotation,
  mergeJSONLogic
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { mergeWith } from "c/sfGpsDsOsrtLodash";
import { getCommonTrackingData } from "c/sfGpsDsOsrtOmniscriptTrackingServiceUtils";
import vtag from "c/sfGpsDsOsrtOaVtag";
import { safePostMessage } from "c/sfGpsDsOsrtSalesforceUtils";

const API = "api";
const VALIDREPEATTYPE = { "Edit Block": "", Block: "" };

/**
 * Use this function to apply the data JSON to the component
 * data = remote api call response, client-side json data etc.
 * @param {*} data
 * @param {omniElement} comp
 * @param {boolean} bApi
 * @param {boolean} bValidation
 */
export function applyCallRespBase(data, comp, bApi, bValidation) {
  // For Group Element, we ignore the null value
  if (data == null || data.constructor !== Object || !comp) {
    return null;
  }

  let leftOverJson = {};
  let remainder = {};
  let cacheJson = {};
  const uiElements =
    (comp.scriptHeaderDef && comp.scriptHeaderDef.labelMap) || {};
  const acUiElements =
    (comp.scriptHeaderDef && comp.scriptHeaderDef.acUiElements) || {};
  const apiUiElements =
    (comp.scriptHeaderDef && comp.scriptHeaderDef.apiUiElements) || {};

  Object.keys(data).forEach(function (item) {
    // uiElements contains all OmniScript elements configured in the designer
    // acUiElements contains all OmniScript elements of the active step
    // (1) if acUiElements is set, we should only query the DOM for these elements
    // (2) in case uiElements is not set, then we have no choice to query all
    if (uiElements.hasOwnProperty(item)) {
      // only query the current step, this can potentially save lots of DOM queries
      // depending on the api response shape
      if (acUiElements.hasOwnProperty(item)) {
        const childCompList = queryOmniComp(comp, item, true);
        if (childCompList && childCompList.length > 0) {
          if (
            comp.scriptHeaderDef.allowOverwrite === true &&
            VALIDREPEATTYPE.hasOwnProperty(childCompList[0].jsonDef.type)
          ) {
            const compListEmpty =
              typeof childCompList[0].isEmpty === "function" &&
              childCompList[0].isEmpty();
            const bDataArray = Array.isArray(data[item]);
            const incomingElementCount = !bDataArray ? 1 : data[item].length;
            const valueIsNull = data[item] === null;
            if (!valueIsNull) {
              //remove
              if (incomingElementCount < childCompList.length) {
                //incoming data has less elements than json data's current data
                // -> remove until matching

                //incoming data is an object and json data's current data is an array
                // -> remove until last one

                // incoming data is null
                // -> remove everything (handled under update)

                // remove backwards (LIFO)
                for (
                  let i = childCompList.length - 1;
                  i >= incomingElementCount;
                  i--
                ) {
                  childCompList[i].handleRemove(API);
                }
              }
              //add
              else if (incomingElementCount >= childCompList.length) {
                // also needs to add backwards using the last element

                // There will always be 1 component in childCompList, even if edit block has no children
                // This requires compListEmpty to be checked first.
                if (compListEmpty) {
                  childCompList[0].handleAdd(
                    API,
                    !bDataArray ? data[item] : data[item][0]
                  );
                }

                // childCompList.length is always > 0
                const componentIndexToPerformAdd = childCompList.length - 1;
                for (
                  let i = incomingElementCount - 1;
                  i >= childCompList.length;
                  i--
                ) {
                  childCompList[componentIndexToPerformAdd].handleAdd(
                    API,
                    data[item][i]
                  );
                }
              }
            }

            //update
            if (!bDataArray) {
              // Edit Block and Block as an object, also handles value as null
              if (!compListEmpty) {
                childCompList[0].applyCallResp(data[item], bApi, bValidation);
              }
            } else {
              // Edit Block and Block as an array
              // removing elements mean that compChildList's length will be incorrect
              let maxUpdateCount = Math.min(
                incomingElementCount,
                childCompList.length
              );

              for (let i = 0; i < maxUpdateCount; i++) {
                childCompList[i].applyCallResp(
                  data[item][i],
                  bApi,
                  bValidation
                );
              }
            }
          }

          // repeat elements - TBD check server code
          else if (
            childCompList[0].jsonDef.propSetMap.repeat ||
            VALIDREPEATTYPE.hasOwnProperty(childCompList[0].jsonDef.type)
          ) {
            // we are not going to create new component for now
            let compSize = childCompList.length;
            const compListEmpty =
              typeof childCompList[0].isEmpty === "function" &&
              childCompList[0].isEmpty();
            const bDataArray = Array.isArray(data[item]);
            let dataSize = bDataArray ? data[item].length : 1;
            if (childCompList[0].jsonDef.propSetMap.repeatLimit != null) {
              dataSize = Math.min(
                dataSize,
                childCompList[0].jsonDef.propSetMap.repeatLimit + 1
              );
            }
            let maxEditSize = Math.min(dataSize, compSize);
            if (!bDataArray) {
              if (maxEditSize === 1) {
                const valueIsNull = data[item] === null;
                if (!valueIsNull) {
                  // Edit Block case
                  if (compListEmpty) {
                    childCompList[0].handleAdd(API, data[item]);
                  } else {
                    childCompList[0].applyCallResp(
                      data[item],
                      bApi,
                      bValidation
                    );
                  }
                } else {
                  if (!compListEmpty) {
                    childCompList[0].applyCallResp(
                      data[item],
                      bApi,
                      bValidation
                    );
                  }
                }
              }
            } else {
              // Edit portion
              for (let i = 0; i < maxEditSize; i++) {
                if (i === 0 && compListEmpty) {
                  childCompList[0].handleAdd(API, data[item][0]);
                } else {
                  childCompList[i].applyCallResp(
                    data[item][i],
                    bApi,
                    bValidation
                  );
                }
              }
              // Add portion - start index = maxEditSize
              for (let i = dataSize - 1; i >= maxEditSize; i--) {
                childCompList[maxEditSize - 1].handleAdd(API, data[item][i]);
              }
            }
          } else {
            childCompList[0].applyCallResp(data[item], bApi, bValidation);
          }
        } else {
          // ideally it should never come here
          // because within the current step, all elements should be in the DOM
          // even the hide element (it's only ui hide)
        }
      } else {
        if (apiUiElements.hasOwnProperty(item)) {
          if (bValidation) {
            cacheJson.vlcValidationErrors = Object.assign(
              {},
              cacheJson.vlcValidationErrors,
              {
                [item]: data[item]
              }
            );
          }
          // for one step render, this will be cacheJson instead of remainder
          else {
            cacheJson = Object.assign({}, cacheJson, {
              [item]: data[item]
            });
          }
        } else {
          remainder = Object.assign({}, remainder, {
            [item]: data[item]
          });
        }
      }
    } else {
      // no UI component match, merge in the json
      remainder = Object.assign({}, remainder, {
        [item]: data[item]
      });
    }
  });

  leftOverJson.remainder = remainder;
  leftOverJson.cacheJson = cacheJson;
  return leftOverJson;
}

/**
 * Use this function to add OmniScript path to API response
 * data = remote api call response, client-side json data etc.
 * @param {*} data
 * Example: {"random":"random value","Block1":{"key01":"key01 has been changed by Set Values - mod"},"key14":"key14 has been changed by Set Values"
 * @param {pathObj} comp
 * Example: {"key14":"Step1:Block2:Block3:key14","Block3":"Step1:Block2:Block3","key01":"Step1:Block1:key01","Block2":"Step1:Block2","Block1":"Step1:Block1","key13":"Step1:key13","SetValuesKey14":"Step1:SetValuesKey14","SetValuesKey13":"Step1:SetValuesKey13","SetValuesKey01":"Step1:SetValuesKey01","Step1":"Step1"}
 * The function will return
 * {"random":"random value","Step1":{"Block1":{"key01":"key01 has been changed by Set Values - mod"},"Block2":{"Block3":{"key14":"key14 has been changed by Set Values"}}}}
 * This is only needed by OmniScript generic preview component because of the level of LWCs
 */
export function addPathToAPIJson(data, pathObj) {
  if (!data || !pathObj) {
    return null;
  } else if (Array.isArray(data)) {
    return data;
  }

  let outputData = {};

  Object.keys(data).forEach(function (item) {
    let eachOutputData = {};
    if (pathObj.hasOwnProperty(item)) {
      let levelObj = eachOutputData;
      let path = pathObj[item];
      let pathArray = path.split(":");
      for (let i = 0; i < pathArray.length; i++) {
        if (!levelObj.hasOwnProperty(pathArray[i])) {
          levelObj[pathArray[i]] = i === pathArray.length - 1 ? data[item] : {};
        }
        levelObj = levelObj[pathArray[i]];
      }
    } else {
      outputData[item] = data[item];
    }
    mergeWith(outputData, eachOutputData, mergeJSONLogic);
  });

  return outputData;
}

/**
 * Use this function to query an OmniScript component by using the data-omni-key
 * @param {LightningElement} comp - component
 * @param {string} omnikey - the value of data-omni-key
 * @param {boolean} bMulti - Call query selector all.
 */
export function queryOmniComp(comp, omniKey, bMulti) {
  let returnComp = null;
  if (!bMulti) {
    // want to track DOM query
    returnComp = comp.template.querySelector(
      '[data-omni-key="' + omniKey + '"]'
    );
    window.console.log("omni queryselector1 " + omniKey);
    if (!returnComp) {
      comp.querySelector('[data-omni-key="' + omniKey + '"]');
      window.console.log("omni queryselector2 " + omniKey);
    }
  } else {
    // re-visit;
    let compList = comp.querySelectorAll('[data-omni-key="' + omniKey + '"]');
    window.console.log("omni queryselector3 " + omniKey);
    if (compList.length === 0) {
      compList = comp.template.querySelectorAll(
        '[data-omni-key="' + omniKey + '"]'
      );
      window.console.log("omni queryselector4 " + omniKey);
    }
    if (compList.length === 0) {
      // we should not need the code below if lwc fixed the bug observed before
      // const component =
      //     comp.querySelector('[data-omni-key="' + omniKey + '"]') ||
      //     comp.template.querySelector('[data-omni-key="' + omniKey + '"]');
      // if (component) {
      //     returnComp = [component];
      // }
    } else {
      returnComp = compList;
    }
  }

  return returnComp;
}

/**
 * Use this function to send an aggregate event
 * @param comp - component
 * @param data - data for the event
 */
export function dispatchOmniEvent(comp, data, eventName) {
  const myEvent = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: data
  });

  comp.dispatchEvent(myEvent);
}

/**
 * @description Gets default properties for Messaging Framework.
 * @param {*} comp
 * @param {Object} element
 * @returns {Object}
 */
function getDefaultMessagingProperties(comp, element) {
  if (element) {
    return {
      wpm: element.propSetMap.wpm,
      ssm: element.propSetMap.ssm,
      pubsub: element.propSetMap.pubsub,
      message: element.propSetMap.message,
      oaEnabled:
        comp.scriptHeaderDef && comp.scriptHeaderDef.omniAnalyticsEnabled
    };
  }

  // Gets properties for Header
  if (comp.jsonDef.sOmniScriptId) {
    return {
      wpm: comp.scriptHeaderDef.propSetMap.wpm,
      ssm: comp.scriptHeaderDef.propSetMap.ssm,
      pubsub: comp.scriptHeaderDef.propSetMap.pubsub,
      message: comp.scriptHeaderDef.propSetMap.message,
      oaEnabled:
        comp.scriptHeaderDef && comp.scriptHeaderDef.omniAnalyticsEnabled
    };
  }

  return {
    wpm: comp.jsonDef.propSetMap.wpm,
    ssm: comp.jsonDef.propSetMap.ssm,
    pubsub: comp.jsonDef.propSetMap.pubsub,
    message: comp.jsonDef.propSetMap.message,
    oaEnabled: comp.scriptHeaderDef && comp.scriptHeaderDef.omniAnalyticsEnabled
  };
}

/**
 * @description Sends Pubsub Event in OmniScript.
 * @param {*} comp
 * @param {String} [eventName]
 * @param {Object} [additionalData] - additional data to be included in the message content
 * @param {Object} [element]
 * @returns {Void}
 */
export function sendOmniPubsubEvent(
  comp,
  eventName = "omniscript_event",
  additionalData,
  element
) {
  if (comp && comp.jsonDef && comp.scriptHeaderDef) {
    const properties = getDefaultMessagingProperties(comp, element);
    let msg = Object.assign({}, additionalData, properties.message);

    //let jsData = comp.sOmniScriptId ? comp._jsonData : comp.jsonData;
    if (msg && Object.keys(msg).length > 0) {
      const msgText = JSON.stringify(msg);
      msg = JSON.parse(
        handleMergeField(
          msgText,
          comp._jsonData,
          comp.scriptHeaderDef.labelMap,
          isRepeatNotation(msgText) ? comp.jsonDef.JSONPath : null
        )
      );
    } else {
      msg = {}; // overwrite read-only msg object
    }

    // Set type and name in message when pubsub is sent from an element
    if (!comp.jsonDef.sOmniScriptId && comp.jsonDef.type && comp.jsonDef.name) {
      msg.type = comp.jsonDef.type;
      msg.name = comp.jsonDef.name;
    }

    sendPubsubEvent(eventName, comp.scriptHeaderDef.omniscriptKey, msg);
  }
}

/**
 * @description Utility method that handles messaging events for wpm and ssm.
 * @param {*} comp
 * @param {String} [pubsubEventName]
 * @param {Object} [additionalData] - additional data to be included in the message content
 * @param {Object} [element]
 * @param {String} [oaEventName] Event name for the window.parentPostMessage
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
export function handleMessaging(
  comp,
  pubsubEventName,
  additionalData,
  element,
  oaEventName
) {
  const properties = getDefaultMessagingProperties(comp, element);

  if (
    comp &&
    comp.jsonDef &&
    comp._jsonData &&
    comp.scriptHeaderDef &&
    (properties.wpm ||
      properties.ssm ||
      properties.pubsub ||
      properties.oaEnabled)
  ) {
    // Gets the message payload, if the event is being fired from GroupElement for data JSON updates, do not add
    // additional keys to payload as they are not needed
    const messagePayload =
      pubsubEventName !== "omniscript_datajson"
        ? getCommonTrackingData(
            comp,
            element,
            comp.scriptHeaderDef,
            comp._jsonData,
            additionalData
          )
        : {};

    // Get the messagingKey which will store the messaging payload for wpm and ssm. URL addressable by using
    // "?messagingKey=SomeMessagingKey" to URL. By default, messagingKey = 'OmniScript-Messaging'.
    const messageKey = comp._jsonData.messagingKey || "OmniScript-Messaging";

    // Fire window post message event
    if (properties.wpm) {
      const messageData = {
        [messageKey]: messagePayload
      };

      safePostMessage(window.parent, messageData, "*");
    }

    // Fire session storage message event
    if (properties.ssm) {
      setSessionStorageMessage(messagePayload, messageKey);
    }

    // Fire pubsub event
    if (properties.pubsub) {
      sendOmniPubsubEvent(comp, pubsubEventName, messagePayload, element);
    }

    // Fire vtag only when EnableOmniAnalytics custom setting is true and when oaEventName is defined
    if (properties.oaEnabled === true && oaEventName != null) {
      vtag.track(oaEventName, messagePayload);
    }
  }
}

/**
 * @description Utility method that sets session storage
 * @param {Object} messageData
 * @param {String} [messageName='OmniScript-Messaging']
 * @returns {Void}
 */
export function setSessionStorageMessage(
  messageData,
  messageName = "OmniScript-Messaging"
) {
  if (messageData) {
    let messages = [];

    // Get existing session storage data for omniscript_messaging
    const existingDataStr = window.sessionStorage.getItem(messageName);

    try {
      // Update the messages array with existing session storage data for omniscript_messaging
      if (existingDataStr) {
        messages = JSON.parse(existingDataStr);
      }
    } catch (error) {
      messages = [];
    }

    // Update messages array with the latest message data
    messages.push(messageData);

    // Set session storage for omniscript_messaging
    window.sessionStorage.setItem(messageName, JSON.stringify(messages));
  }
}

/**
 *
 * @param {string} eventName omniscript specific event name
 * @param {object} jsonDef
 * @param {object} scriptHeaderDef
 */
export function sendPubsubEvent(eventName, omniscriptKey, data) {
  let msg = Object.assign({}, data);
  msg.OmniScript = omniscriptKey;
  pubsub.fire(eventName, "data", msg);
}

export const inputTypeMap = {
  Text: "text",
  Telephone: "tel",
  Password: "password"
};

export function copySelectedToClipboard(comp, compLabel) {
  if (!comp) {
    throw Error(`${compLabel} could not be queried`);
  }

  comp.select();
  comp.setSelectionRange(0, 99999);
  document.execCommand("copy");
}
