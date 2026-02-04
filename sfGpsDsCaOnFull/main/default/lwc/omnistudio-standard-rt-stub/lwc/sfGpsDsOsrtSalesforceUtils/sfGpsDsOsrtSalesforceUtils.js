import maxSafeInt from "@salesforce/label/c.sfGpsDsOsrtMaxSafeInt";
import * as alertLabels from "./alertLabels";
import * as checkboxGroupLabels from "./checkboxGroupLabels";
import * as componentConstraintApiLabels from "./componentConstraintApiLabels";
import * as inputLabels from "./inputLabels";
import * as pillLabels from "./pillLabels";
import * as progressBarLabels from "./progressBarLabels";
import * as textareaLabels from "./textareaLabels";
import * as typeaheadLabels from "./typeaheadLabels";
import * as datePickerLabels from "./datePickerLabels";
import * as datetimePickerLabels from "./datetimePickerLabels";
import * as timePickerLabels from "./timePickerLabels";
import * as dataTableLabels from "./dataTableLabels";
import * as wizardLabels from "./wizardLabels";
import * as listLabels from "./listLabels";
import * as treeListSelectorLabels from "./treeListSelectorLabels";
import { safePostMessage } from "./postMessage.js";

export {
  handleData,
  getCustomLabels,
  getCustomSettings,
  LOCALE,
  CURRENCY,
  fetchUserContext,
  getResourceUrl,
  isCommunity,
  getCommunityName,
  getCommunityPrefixIfNeeded,
  isInsidePckg,
  trackVlocityInteraction,
  getCustomPermissionsForUser,
  getNewportUrl,
  LANG,
  TIMEZONE,
  shortDateFormat,
  datetimeFormat,
  getInteractionObject,
  getUserProfile,
  handleDataCards,
  doGenericInvokeWithCont,
  getAllSupportedSObjects
} from "./api";

const SLDS_ASSETS_PATH = "/_slds/";

function getSldsResourcesUrl() {
  return SLDS_ASSETS_PATH;
}

export {
  maxSafeInt,
  SLDS_ASSETS_PATH,
  alertLabels,
  checkboxGroupLabels,
  componentConstraintApiLabels,
  datePickerLabels,
  datetimePickerLabels,
  inputLabels,
  pillLabels,
  progressBarLabels,
  textareaLabels,
  typeaheadLabels,
  timePickerLabels,
  dataTableLabels,
  wizardLabels,
  listLabels,
  treeListSelectorLabels,
  getSldsResourcesUrl,
  safePostMessage
};
