import { SaveBP, isOffPlatform } from "c/sfGpsDsOsrtOmniscriptRestApi";
import { handleMergeField } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import {
  getNameSpacePrefix,
  isInsidePckg
} from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { parseParams } from "c/sfGpsDsOsrtNavigationUtils";
import { handleTimeTracking } from "./trackingUtils";
import { handleMessaging } from "./base";

export function saveForLater(
  cmp,
  jsonDef,
  filesMap,
  layout,
  isPreview,
  bSflAuto,
  langCode,
  inCommunities
) {
  return new Promise((resolve, reject) => {
    // Copy definition
    const bpTree = JSON.parse(JSON.stringify(jsonDef));

    // Preview mode
    bpTree.previewMode = isPreview;

    // Save for later URL
    let namespace = (getNameSpacePrefix() || "").slice(0, -2),
      componentNs =
        isInsidePckg === "true" || isInsidePckg === true
          ? "c"
          : namespace || "c",
      componentName = isPreview
        ? (namespace || "c") + ":omniscriptPreview"
        : componentNs +
          ":" +
          getLwcName(jsonDef.bpType, jsonDef.bpSubType, jsonDef.bpLang);

    if (isOffPlatform() || inCommunities) {
      const params = parseParams(window.location.search);
      delete params.c__instanceId;
      delete params.c__mls;
      delete params.c__LanguageCode;
      delete params.LanguageCode;
      params.c__sfl = true;

      const reqParams = [];
      Object.keys(params).forEach((key) => {
        if (params.hasOwnProperty(key)) {
          reqParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });

      bpTree.saveURL =
        location.origin +
        (location.pathname || "/") +
        "?" +
        reqParams.join("&");
    } else {
      bpTree.saveURL =
        location.origin +
        "/lightning/cmp/" +
        (namespace || "c") +
        "__vlocityLWCOmniWrapper?c__target=" +
        componentName +
        "&c__layout=" +
        layout;
    }

    if (jsonDef.bpLang === "Multi-Language") {
      bpTree.saveURL += "&c__mls=true";
      if (langCode) {
        bpTree.saveURL += "&c__LanguageCode=" + langCode;
      }
    }

    // Let the backend know we are on LWC
    bpTree.isLwcInstance = true;
    bpTree.lwcName = componentName;

    if (bpTree.propSetMap.saveNameTemplate && !bpTree.bpInstanceName) {
      bpTree.bpInstanceName = handleMergeField(
        bpTree.propSetMap.saveNameTemplate,
        bpTree.response,
        bpTree.labelMap,
        null
      );
    }

    if (
      bpTree.propSetMap.saveObjectId === undefined ||
      bpTree.propSetMap.saveObjectId === null
    ) {
      bpTree.propSetMap.saveObjectId = "%ContextId%";
    }

    bpTree.saveObjectId = handleMergeField(
      bpTree.propSetMap.saveObjectId,
      bpTree.response,
      bpTree.labelMap,
      null
    );

    if (bpTree.asIndex === undefined || bpTree.asIndex === null) {
      bpTree.activeRootIndex = 0;
    }

    if (!bSflAuto) {
      // Creates time tracking entry for Save for Later. elapsedTime is the time between the current active step's
      // start time and when SFL is selected.
      handleTimeTracking(cmp, jsonDef.children[jsonDef.asIndex], "Outcome", {
        outcome: "Save",
        elapsedTime: Date.now() - jsonDef.children[jsonDef.asIndex].st
      });
    }

    // SaveForLaterDuration is the difference between when the OmniScript is first loaded into the DOM and when the
    // user selects to proceed with sfl. cmp._startTime is defined in the Header component and stores the time when
    // the OS is first loaded
    if (cmp.scriptHeaderMessagingEnabled === true) {
      // Fire messaging for OS Save For Later for both sflAuto and manual sfl
      handleMessaging(
        cmp,
        "omniscript_save_for_later",
        {
          StartTime: cmp._startTime,
          SaveForLaterMinutes: Math.ceil((Date.now() - cmp._startTime) / 60000), // Convert to minutes and round up
          Resume: cmp.resume
        },
        null,
        "OS Save For Later"
      );
    }

    // Start saving...
    return SaveBP({
      bpTree: JSON.stringify(bpTree),
      files: JSON.stringify(filesMap)
    })
      .then((response) => {
        const remoteResp = JSON.parse(response);

        // If any error, reject
        if (remoteResp.error !== "OK") {
          reject({
            message: remoteResp.error,
            type: remoteResp.errorType
          });
          return;
        }

        // Create the event/resolve data
        // Event is required as the header will update the jsonDef
        const data = {
          saveUrl: bpTree.saveURL,
          instanceId: remoteResp.instanceId,
          sflTimestamp: remoteResp.sflTimestamp,
          previewMode: isPreview
        };

        cmp.dispatchEvent(
          new CustomEvent("omnisavedforlater", {
            bubbles: true,
            cancelable: false,
            composed: false,
            detail: data
          })
        );

        // Resolve with save result
        resolve(data);
      })
      .catch((e) => {
        reject({
          message: e.body?.message || "",
          type: "System.Exception"
        });
      });
  });
}

/**
 * Creates the LWC name for an OmniScript. If this is modified, modify on compilerService.js as well.
 * @param {string} type
 * @param {string} subType
 * @param {string} language
 * @returns {string} The LWC name
 */
function getLwcName(type, subType, language) {
  const cpType = type ? type.charAt(0).toLowerCase() + type.slice(1) : type;
  const cpSubType = subType
    ? subType.charAt(0).toUpperCase() + subType.slice(1)
    : subType;
  const cpLanguage = language ? language.replace(/[\s()-]+/gi, "") : language;
  return cpType + cpSubType + cpLanguage;
}
