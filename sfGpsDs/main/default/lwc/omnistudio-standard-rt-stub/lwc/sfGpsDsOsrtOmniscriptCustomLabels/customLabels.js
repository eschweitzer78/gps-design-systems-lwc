import { CustomLabels } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { namespace } from "c/sfGpsDsOsrtNamespaceUtils";
import { mergeWith } from "c/sfGpsDsOsrtLodash";

const labelsAllowedToBeEmpty = ["failureNextLabel", "failureGoBackLabel"];

/**
 * Object containing all Salesforce custom labels
 */
export const allCustomLabels = {
  ...CustomLabels
};

export const ootbLabelMap = {
  "Calculation Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "DataRaptor Extract Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "DataRaptor Post Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "DataRaptor Transform Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "DataRaptor Turbo Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Delete Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "remoteConfirmMsg",
    "cancelLabel",
    "subLabel"
  ],
  "DocuSign Envelope Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "DocuSign Signature Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Email Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Integration Procedure Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Matrix Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "PDF Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default",
    "popupBlocked"
  ],
  "Post to Object Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Remote Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Rest Action": [
    "failureNextLabel",
    "failureGoBackLabel",
    "inProgressMessage",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],

  "Done Action": [
    "consoleTabLabel",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Navigate Action": [""],
  "Cancel Action": ["cancelMessage"],
  "Review Action": [
    "nextLabel",
    "previousLabel",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  Submit: [
    "summaryLabel",
    "submitLabel",
    "reviseLabel",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],

  Headline: ["labelKey"],
  "Text Block": ["textKey"],
  Validation: ["messages|n:text"],

  "Filter Block": ["buttonLabel"],
  "Radio Group": ["options|n:value", "radioLabels|n:value", "helpText"],
  "Edit Block": ["newLabel", "editLabel", "deleteLabel"],
  Step: [
    "previousLabel",
    "nextLabel",
    "cancelLabel",
    "saveLabel",
    "saveMessage",
    "instructionKey",
    "chartLabel",
    "errorMessage:custom|n:message",
    "errorMessage:default"
  ],
  "Type Ahead": ["taAction", "newItemLabel", "helpText"],
  "Type Ahead Block": ["newItemLabel", "helpText"],
  "Places Typeahead": ["helpText"],
  Checkbox: ["checkLabel", "helpText"],
  Currency: ["helpText"],
  Date: ["helpText"],
  "Date/Time (Local)": ["helpText"],
  Disclosure: ["checkLabel", "textKey"],
  Email: ["ptrnErrText", "helpText"],
  File: ["errorMessage:custom|n:message", "errorMessage:default", "helpText"],
  Image: ["errorMessage:custom|n:message", "errorMessage:default", "helpText"],
  Lookup: ["errorMessage:custom|n:message", "errorMessage:default", "helpText"],
  "Multi-select": ["options|n:value", "helpText"],
  Number: ["ptrnErrText", "helpText"],
  Password: ["ptrnErrText", "helpText"],
  Radio: ["options|n:value", "helpText"],
  Range: ["helpText"],
  Script: [
    "persistentComponent|n:label",
    "consoleTabTitle",
    "errorMessage:custom|n:message"
  ],
  Select: ["options|n:value", "helpText"],
  Telephone: ["ptrnErrText", "helpText"],
  Text: ["ptrnErrText", "helpText"],
  Time: ["helpText"],
  "Text Area": ["ptrnErrText", "helpText"],
  URL: ["ptrnErrText", "helpText"]
};

export const ootbLabelMapExtra = {
  "Edit Block": ["actions", "gActions", "newAction", "editAction", "delAction"]
};

export const ootbLabelMapOld = {
  Step: ["completeLabel", "cancelMessage", "completeMessage"],
  "Calculation Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "DataRaptor Extract Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "DataRaptor Post Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "DataRaptor Transform Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Delete Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "DocuSign Envelope Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "DocuSign Signature Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Email Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Integration Procedure Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Matrix Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "PDF Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Post to Object Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Remote Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ],
  "Rest Action": [
    "failureAbortLabel",
    "failureAbortMessage",
    "redirectNextLabel",
    "redirectPreviousLabel"
  ]
};

export const ootbLabelMapFull = mergeWith(
  ootbLabelMapExtra,
  ootbLabelMap,
  // eslint-disable-next-line consistent-return
  function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }
);

export const defaultValuesToLabelNames = {
  previousLabel: namespace + "OmnipreviousLabel",
  nextLabel: namespace + "OmninextLabel",
  cancelLabel: namespace + "OmnicancelLabel",
  saveLabel: namespace + "OmnisaveLabel",
  completeLabel: namespace + "OmnicompleteLabel",
  submitLabel: namespace + "OmnisubmitLabel",
  summaryLabel: namespace + "OmnisummaryLabel",
  reviseLabel: namespace + "OmnireviseLabel",
  failureNextLabel: namespace + "OmnifailureNextLabel",
  failureAbortLabel: namespace + "OmnifailureAbortLabel",
  failureGoBackLabel: namespace + "OmnifailureGoBackLabel",
  redirectNextLabel: namespace + "OmniredirectNextLabel",
  redirectPreviousLabel: namespace + "OmniredirectPreviousLabel",
  consoleTabLabel: namespace + "OmniconsoleTabLabel",
  newItemLabel: namespace + "OmninewItemLabel",
  newLabel: namespace + "OmninewLabel",
  editLabel: namespace + "OmnieditLabel",
  cancelMessage: namespace + "OmnicancelMessage",
  saveMessage: namespace + "OmnisaveMessage",
  completeMessage: namespace + "OmnicompleteMessage",
  inProgressMessage: namespace + "OmniinProgressMessage",
  postMessage: namespace + "OmnipostMessage",
  popupBlocked: namespace + "OmniPopupBlocked",
  failureAbortMessage: namespace + "OmnifailureAbortMessage",
  subLabel: namespace + "OmniDelete",
  remoteConfirmMsg: namespace + "OmniremoteActionConfirm"
};

export function getCustomLabel(allCustomLabelsTran, labelKey) {
  // In Multi-Language case, allCustomLabelsTran will return the Label translations
  // of all Labels imported above + Labels defined in the script header
  // In non Multi-Langugage case, allCustomLabelsTran will return the Labels of
  // Labels defined in the script header
  let allLabels = allCustomLabels;
  if (allCustomLabelsTran) {
    allLabels = Object.assign({}, allLabels, allCustomLabelsTran);
  }
  return allLabels[labelKey];
}

/**
 * Translates all of the labels inside of propSetMap in-place defined by the element type in ootbLabelMap
 * @param {String} elementType
 * @param {Object} propSetMap
 * @param {Object} labelKeyMap
 */
export function handleMultiLangLabel(elementType, propSetMap, customLabels) {
  const eleType = elementType ? elementType : "Script";
  if (eleType !== "Script") {
    // manually get label (not listed in ootbLabelMap)
    propSetMap.label = customLabels[propSetMap.label];
  }
  const eleLabelMap = ootbLabelMapFull[eleType];
  if (eleLabelMap) {
    // each label listed will have its label translated
    for (let i = 0; i < eleLabelMap.length; i++) {
      const tokenList = eleLabelMap[i].split(":");
      const node = tokenList[tokenList.length - 1];

      // check if property is array or object,
      // only checks first level and assumes the descendents need to be editable too

      let propNode = tokenList[0];
      // is Array
      if (propNode.indexOf("|") > 0) {
        propNode = propNode.split("|")[0];
        if (Array.isArray(propSetMap[propNode])) {
          propSetMap[propNode] = JSON.parse(
            JSON.stringify(propSetMap[propNode])
          );
        }
      } else if (typeof propSetMap[propNode] === "object") {
        propSetMap[propNode] = JSON.parse(JSON.stringify(propSetMap[propNode]));
      }

      let prop = getPropToUpdate(propSetMap, tokenList);

      // pipe n, an array of objects containing a prop with custom label
      if (Array.isArray(prop)) {
        for (let j = 0; j < prop.length; j++) {
          // check if element has ootb label
          // also check the property type to not overwrite any objects and arrays (see edit block, gActions above)
          if (!prop[j][node] || typeof prop[j][node] !== "object") {
            prop[j][node] = handleOotbLabel(prop[j][node], node, customLabels);
          }
        }
      } else {
        if (!prop[node] || typeof prop[node] !== "object") {
          prop[node] = handleOotbLabel(prop[node], node, customLabels);
        }
      }
    }
  }
}

export function getPropToUpdate(prop, tokenList) {
  "use strict";
  for (let ind = 0; ind < tokenList.length - 1; ind++) {
    if (tokenList[ind].indexOf("|n") >= 0) {
      tokenList[ind] = tokenList[ind].slice(0, tokenList[ind].length - 2);
    }
    let buildupArray = [];
    if (!prop) return null; //property does not exist in object
    if (Array.isArray(prop)) {
      for (let j = 0; j < prop.length; j++) {
        prop[j] = prop[j][tokenList[ind]];
        if (Array.isArray(prop[j])) {
          for (let k = 0; k < prop[j].length; k++) {
            buildupArray.push(prop[j][k]);
          }
        }
      }
    } else {
      if (prop) {
        prop = prop[tokenList[ind]];
      }
      if (Array.isArray(prop)) {
        for (let l = 0; l < prop.length; l++) {
          buildupArray.push(prop[l]);
        }
      }
    }
    if (buildupArray.length > 0) {
      prop = buildupArray;
    }
  }
  return prop;
}

/**
 *
 * @param {Object} labelValue the value of property label
 * @param {String} labelKey the name of the label
 * @param {Object} customLabels map containing all of the custom labels
 */
export function handleOotbLabel(labelValue, labelKey, customLabels) {
  // prop is blank, and has ootb label
  if (!labelValue && customLabels.hasOwnProperty("Omni" + labelKey)) {
    // For MTL, labels that are allowed to be empty will return empty string
    if (labelsAllowedToBeEmpty.includes(labelKey)) {
      return labelValue;
    }

    return customLabels["Omni" + labelKey];
  }

  return customLabels[labelValue];
}
