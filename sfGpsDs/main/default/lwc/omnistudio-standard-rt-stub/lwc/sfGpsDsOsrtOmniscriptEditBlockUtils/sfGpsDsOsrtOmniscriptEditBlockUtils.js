import {
  OmniscriptRemoteActionUtil,
  OmniscriptIpActionUtil,
  OmniscriptHttpActionUtil,
  OmniscriptMatrixActionUtil
} from "c/sfGpsDsOsrtOmniscriptActionUtils";
import {
  evalSpinnerCond,
  setSpinnerActionMessage
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { dispatchOmniEvent } from "c/sfGpsDsOsrtOmniscriptUtils";

/**
 * Creates and configures the data for global actions
 * @scope private
 * @param {Object} comp component object
 * @param {Object} jsonDef json definition of the edit block component
 * @returns {void}
 */
export function createGlobalActionList(comp, gActions) {
  comp._gActions = [];
  if (gActions) {
    for (let i = 0; i < gActions.length; i++) {
      let sprite = gActions[i].propSetMap.svgSprite;
      let icon = gActions[i].propSetMap.svgIcon;
      let actionItem = {
        lwcId: i + "-action",
        label: gActions[i].propSetMap.label,
        hasIcon: sprite && icon && sprite !== "" && icon !== "",
        icon: sprite + ":" + icon,
        cls: `${comp._theme}-size_${gActions[i].propSetMap.controlWidth}-of-12`,
        handleClick: () => {
          runAction(comp, gActions[i], true).then((resp) => {
            if (resp.error) {
              displayErrorModal(comp, resp.errorMsg);
            } else {
              const detail = {
                apiResponse: resp.result
              };
              dispatchOmniEvent(comp, detail, "omniactionbtn");
            }
          });
        }
      };
      comp._gActions.push(actionItem);
    }
  }
}

/**
 * Opens up a modal to display the error message
 * @scope private
 * @param {Object} comp - Component object
 * @param {String} msg - Error message string to display
 * @returns {void}
 */
export function displayErrorModal(comp, msg) {
  return new Promise((resolve) => {
    // passing entire modal configuration and controlling when the modal closes
    const modalDetails = {
      type: "error",
      message: msg,
      buttons: [
        {
          label: comp.allCustomLabelsUtil.OmniOK,
          key: "0-Ok",
          handleClick: () => {
            resolve();
          }
        }
      ],
      closeAfterClick: true
    };
    dispatchOmniEvent(comp, modalDetails, "omnimodal");
  });
}

/**
 * Calls the action defined in the action object (Remote Action, Rest Action, and Integration Procedure Action)
 * @param {Object} action - Contains the information about which action to call
 * @param {Boolean} bGlobal - Indicates if the action is global or local
 * @scope private
 * @returns {Promise}
 */
export function runAction(comp, action, bGlobal) {
  let actionClass;
  // DefaultOmniScriptEditBlock
  if (
    action.type === "Remote Action" &&
    action.propSetMap.remoteClass === "DefaultOmniScriptEditBlock"
  ) {
    action = JSON.parse(JSON.stringify(action));
    action.propSetMap.remoteOptions.sobjectMapping =
      comp._propSetMap.sobjectMapping;
    action.propSetMap.remoteOptions.selectSobject =
      comp._propSetMap.selectSobject;
  }

  // Edit Block only supports 4 types of actions: Remote Action, Rest Action
  // Integration Procedure Action, Matrix Action
  // Matrix Action is not supported in LWC yet
  switch (action.type) {
    case "Remote Action":
      actionClass = new OmniscriptRemoteActionUtil(action);
      break;
    case "Integration Procedure Action":
      actionClass = new OmniscriptIpActionUtil(action);
      break;
    case "Rest Action":
      actionClass = new OmniscriptHttpActionUtil(action);
      break;
    case "Matrix Action":
      actionClass = new OmniscriptMatrixActionUtil(action);
      break;
    default:
      break;
  }

  evaluateSpinner(comp, true, action);
  const payload = bGlobal ? null : comp.jsonDef.response;
  return actionClass
    .executeAction(null, null, comp, payload)
    .then((resp) => {
      evaluateSpinner(comp, false, action);
      return resp;
    })
    .catch((error) => {
      evaluateSpinner(comp, false, action);
      return error;
    });
}

/**
 * Evaluates spinner according to conditions.
 * @param {boolean} value
 * @param {object} element
 * @returns {void}
 * @scope private
 */
export function evaluateSpinner(comp, value, element) {
  if (comp._isBtn || comp._isBtn === undefined) {
    if (evalSpinnerCond(element)) {
      if (value === true) {
        // sets spinner action message
        comp.spinnerActionMessage =
          comp?.allCustomLabelsUtil?.[setSpinnerActionMessage(element)] ||
          setSpinnerActionMessage(element);
      }

      comp.isPageLoading = value;
    } else {
      comp.isBtnLoading = value;
    }
  }
}
