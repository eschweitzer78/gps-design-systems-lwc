import { preprocessElementInput, getJSONNode } from "./scriptHelpers";
import { showToast } from "./notificationHelpers";

/**
 * Assesses how error messages with custom error messages should be handled
 * @param {object or string} errorMessage
 * @param {object} element
 * @param {object} scriptHeaderDef
 */
export function handleErrorReplace(errorMessage, elementProp, scriptHeaderDef) {
  // captures error message if error node is present
  if (errorMessage && errorMessage.error) {
    errorMessage = errorMessage.error;
  }

  const customError = elementProp ? elementProp.errorMessage : null;
  const headerError =
    scriptHeaderDef && scriptHeaderDef.propSetMap
      ? scriptHeaderDef.propSetMap.errorMessage
      : null;

  // Handles error messages that are objects or strings
  const error = ((err) => {
    try {
      return JSON.parse(err);
    } catch (e) {
      return err;
    }
  })(errorMessage);

  let newError = error;
  // Error messages defined in script configuration
  if (headerError) {
    newError = performErrorReplace(error, headerError.custom);
  }

  // Error messages defined in element/action level if script header
  // does not have a custom error message
  if (newError === error && customError) {
    newError = performErrorReplace(error, customError.custom);
  }

  // Default error message from element/action level if script header
  // or element propset does not have a custom error message
  if (newError === error && customError && customError.default) {
    newError = customError.default;
  }
  // If no matches are found, stringify the error
  else if (typeof newError === "object") {
    // captures error messages from Error objects
    if (newError && newError.message && newError.stack) {
      newError = newError.stack || newError.message;
    }
    // returns all other errors in string form
    else {
      newError = JSON.stringify(newError);
    }
  }

  return newError;
}

/**
 * Use this function to replace error messages with custom error messages.
 * @param {object or string} error
 * @param {object} customError - An array of objects that contains message,
 * value, path properties
 */
export function performErrorReplace(error, customError) {
  if (!customError) {
    return error;
  }

  if (typeof error === "string") {
    for (let i = 0; i < customError.length; i++) {
      if (error.trim() === customError[i].value.trim()) {
        error = customError[i].message;
        break;
      }
    }
  } else if (typeof error === "object") {
    for (let i = 0; i < customError.length; i++) {
      const path = customError[i].path;
      const propArr = preprocessElementInput(path);
      const node = getJSONNode(error, propArr) || null;

      if (node) {
        // If only path is specified, use that as the error message
        if (path && !customError[i].value && !customError[i].message) {
          error = node;
          break;
        }
        // Confirm the path's value matches then replace
        else if (node === customError[i].value) {
          error = customError[i].message;
          break;
        }
      }
    }
  }

  return error;
}

/**
 * Use this function to check if the remote call has an error
 * @param {object} resp
 * @returns {Boolean}
 */
export function checkRemoteCallError(resp) {
  // TODO: dkim - this entire method is probably not needed
  // identifies errors in queueable apex remote options
  if (resp.responseResult) {
    try {
      resp = JSON.parse(resp.responseResult);
    } catch (err) {
      resp = resp.responseResult;
    }
  }

  if (resp) {
    // scenario - has error property
    if (resp.error && resp.error !== "OK") {
      return true;
    }
    // TODO: dkim - this logic needs to be placed in the specific action elements. Evaluate if this needs to be a
    // utility method. Most likely it does not.

    // scenario - has error messages property
    else if (
      !resp.error &&
      !resp.records &&
      resp.messages &&
      Array.isArray(resp.messages) &&
      resp.messages.length > 0
    ) {
      resp.error = [];

      for (let i = 0; i < resp.messages.length; i++) {
        if (resp.messages[i].severity === "ERROR") {
          resp.error.push(resp.messages[i]);
        }
      }

      if (resp.error.length > 0) {
        return true;
      }
    }
    // scenario - has nested hasErrors property
    else {
      const errorObj = findObjIdValues(resp, "hasErrors");
      if (errorObj) {
        return errorObj.hasErrors;
      }
    }
  }

  // scenario - no errors
  return false;
}

/**
 * Use this function to return an object that has a specific nested key.
 * @param {obj} obj
 * @param {str} id
 * @returns {obj}
 */
export function findObjIdValues(obj, id) {
  if (obj && obj.hasOwnProperty(id)) {
    return obj;
  }

  let resultObj, objId;
  for (objId in obj) {
    // checks each of the object keys to see if id exists
    if (
      obj &&
      obj.hasOwnProperty(objId) &&
      typeof obj[objId] === "object" &&
      !Array.isArray(obj[objId])
    ) {
      resultObj = findObjIdValues(obj[objId], id);
      if (resultObj) {
        return resultObj;
      }
    }
  }

  return resultObj;
}

/**
 * Use this function to set up and dispatch an error modal.
 * @param {string || object} errorMessage
 * @param {boolean} bBtn
 * @param {object} element
 * @param {object} scriptHeaderJson
 * @param {integer} firstStepIndex
 * @param {*} comp
 * @returns {object}
 * */
export function sendErrorModal(
  errorMessage,
  bBtn,
  element,
  scriptHeaderJson,
  comp
) {
  let previousLabel, dismissLabel;
  let nextLabel = comp._propSetMap.failureNextLabel;

  if (
    !bBtn &&
    scriptHeaderJson.firstStepIndex &&
    element.indexInParent < scriptHeaderJson.firstStepIndex &&
    element.propSetMap.invokeMode !== "noBlock"
  ) {
    // handles situation for when errors occur prior to the first step
    previousLabel = undefined;
  } else if (bBtn || element.propSetMap.invokeMode === "noBlock") {
    // handles situations where button is to be dismissed
    previousLabel = undefined;
    dismissLabel = comp.scriptHeaderDef.allCustomLabels
      ? comp.scriptHeaderDef.allCustomLabels.OmniDesOk
      : "OmniDesOk";
    nextLabel = undefined;
  } else {
    previousLabel = comp._propSetMap.failureGoBackLabel;
  }

  const modalDetails = {
    message: errorMessage,
    header: comp._propSetMap.label,
    type: "error",
    previousLabel: previousLabel,
    nextLabel: nextLabel,
    dismissLabel: dismissLabel,
    triggeredOnStep: bBtn || element.propSetMap.invokeMode === "noBlock"
  };

  // only action block, remote action, and integration procedure actions should have the invokeMode property in its
  // property set. if action is not remote or integration procedure action or action block, modal will be dispatched.
  const isActionInvokeModePermitted =
    element.type === "Remote Action" ||
    element.type === "Integration Procedure Action" ||
    element.type === "Action Block";

  if (isActionInvokeModePermitted) {
    switch (element.propSetMap.invokeMode) {
      case "fireAndForget": {
        window.console.error(modalDetails.message + " - fireAndForget error");
        break;
      }
      case "noBlock": {
        // enables toast functionality for error messaging
        if (element.propSetMap.toastEnabled) {
          showToast(
            {
              title: comp._propSetMap.label,
              message: handleErrorReplace(
                errorMessage,
                comp._propSetMap,
                scriptHeaderJson
              ),
              variant: "error"
            },
            this
          );
        }
        // default error message is displayed in modal
        else {
          comp.dispatchOmniEventUtil(comp, modalDetails, "omnimodal");
        }

        break;
      }
      default: {
        comp.dispatchOmniEventUtil(comp, modalDetails, "omnimodal");
      }
    }
  }
  // dispatch default modal for all other actions
  else {
    comp.dispatchOmniEventUtil(comp, modalDetails, "omnimodal");
  }

  return { error: true, message: errorMessage };
}
