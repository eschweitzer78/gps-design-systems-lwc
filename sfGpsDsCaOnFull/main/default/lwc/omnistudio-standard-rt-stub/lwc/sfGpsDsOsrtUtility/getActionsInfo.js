import { getActionsInfo } from "c/sfGpsDsOsrtSalesforceUtils";
import { namespace } from "./namespace";
import localStoreMethods from "./localStoreMethods";

let pendingActions = [];
let pendingActionList = [];
function getAllActions(disableCache = false) {
  /**
   * getActionsInfo will retrieve all 'active' vlocity actions just once.
   * Subsequent calls will get actions from the cached data unless the 'ignoreCache' flag is set
   */
  /** If disableCache is true donot get actions in sessionStorage */
  /** if sessionstorage is not supported then read the data of actions from global application state */

  var vlocityAllActions = localStoreMethods.getItem("vlocity.allActions");
  var cachedActions =
    !disableCache && vlocityAllActions
      ? typeof vlocityAllActions == "string"
        ? JSON.parse(vlocityAllActions)
        : vlocityAllActions
      : null;

  if (cachedActions != null) {
    return new Promise(function (resolve) {
      resolve(cachedActions);
    });
  }

  // Create the deffered object
  return new Promise(function (resolve, reject) {
    if (getActionsInfo) {
      if (!pendingActions.length) {
        let promise = getActionsInfo().then(
          (actions) => {
            localStoreMethods.setItem(
              "vlocity.allActions",
              JSON.stringify(actions)
            );

            cachedActions = actions;

            return cachedActions;
          },
          function (error) {
            console.error("getActionsInfo retrieval error:" + error);
            cachedActions = [];
            reject(new Error("getActionsInfo retrieval error: " + error));
          }
        );
        pendingActions.push(promise);
      }
      resolve(pendingActions[0]);
    }
  });
}

function getActions(disableCache = false) {
  return new Promise(function (resolve) {
    /** If disableCache is true donot get actions in sessionStorage */

    const allActions = JSON.parse(
      localStoreMethods.getItem("vlocity.actionList")
    );
    var cachedActionList =
      allActions && !disableCache
        ? typeof allActions == "string"
          ? JSON.parse(allActions)
          : allActions
        : null;
    if (!cachedActionList || !Object.keys(cachedActionList).length) {
      if (!pendingActionList.length) {
        let actionList = getAllActions(disableCache).then(
          function (actions) {
            let updatedCachedActionList = actions.reduce(function (
              obj,
              action
            ) {
              let actionObj = Object.assign({}, action);
              actionObj[namespace + "Url__c"] =
                actionObj[namespace + "Url__c"] ||
                actionObj[namespace + "URL__c"];
              obj[action.Name] = Object.assign(
                {
                  displayName: action[namespace + "DisplayLabel__c"],
                  openMode:
                    action[namespace + "OpenUrlMode__c"] ||
                    action[namespace + "OpenURLMode__c"] ||
                    action.openUrlIn,
                  vlocityIcon: action[namespace + "VlocityIcon__c"]
                },
                actionObj
              );
              // Maintain the displayName and vlocityIcon as it's used in templates
              // as part of old getActions implemenetation
              //action.displayName = action[getNameSpacePrefix() + 'DisplayLabel__c'];
              //action.vlocityIcon = action[getNameSpacePrefix() + 'VlocityIcon__c'];
              return obj;
            }, {});

            localStoreMethods.setItem(
              "vlocity.actionList",
              JSON.stringify(updatedCachedActionList)
            );

            return updatedCachedActionList;
          },
          function (err) {
            console.error("getActionsInfoAsMap error ", err);
            return err;
          }
        );
        pendingActionList.push(actionList);
      }
      resolve(pendingActionList[0]);
    } else {
      resolve(cachedActionList);
    }
  });
}
export { getActions, getAllActions };
