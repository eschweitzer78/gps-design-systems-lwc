import {
  newport,
  monaco,
  tinymce,
  flexipageStyle,
  javascriptNumberFormatter,
  getCommunityPrefixIfNeeded
} from "c/sfGpsDsOsrtSalesforceUtils";
import { isInsidePckg, isInsidePckgPromise } from "./isInsidePckg";
import lwcPropertyNameConversion from "./lwcPropertyNameConversion";
import getUserPermissions from "./userPermissions";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { namespace, namespaceDotNotation } from "./namespace";
import fetchCustomLabels from "./fetchCustomLabels";
import { iMaskParser, numberIMaskParser } from "./parseIMask";
import WrapperComponentConstraints from "./ComponentConstraintApi";
import { getSDKInstance } from "./getSdkInstance";
// import {
//   loadJsFromStaticResource,
//   loadCssFromStaticResource
// } from "./staticResourceLoader";
import { DatasourceInputTypes } from "./datasourceInputTypes";
import sdkDataHandler from "./sdkDataHandler";
import { getActions, getAllActions } from "./getActionsInfo";
import { groupFilter, isEditMode } from "./groupFilter";
import { subscribeEMP, unsubscribeEMP } from "./streamingChannel";
import { isMobile, mobileDateFormat } from "./mobileUtil";
import { listboxScrollUpDown } from "./listboxUtils";
var userProfile;

export {
  newport,
  loadScript,
  loadStyle,
  userProfile,
  monaco,
  tinymce,
  flexipageStyle,
  javascriptNumberFormatter,
  isInsidePckg,
  isInsidePckgPromise,
  getUserPermissions,
  namespace,
  namespaceDotNotation,
  fetchCustomLabels,
  iMaskParser,
  numberIMaskParser,
  getActions,
  getAllActions,
  WrapperComponentConstraints,
  getSDKInstance,
  // loadJsFromStaticResource,
  // loadCssFromStaticResource,
  DatasourceInputTypes,
  sdkDataHandler,
  groupFilter,
  isEditMode,
  subscribeEMP,
  unsubscribeEMP,
  lwcPropertyNameConversion,
  isMobile,
  mobileDateFormat,
  listboxScrollUpDown,
  getCommunityPrefixIfNeeded
};

/**
 * These exports can now be found in c/sfGpsDsOsrtNavigationUtils.
 * To be removed in 109.
 * @deprecated
 */
export {
  pageReferenceTypes,
  PageReference,
  AppPageReference,
  ComponentPageReference,
  KnowledgeArticlePageReference,
  LoginPageReference,
  NamedPageReference,
  CommNamedPageReference,
  NavItemPageReference,
  ObjectPageReference,
  RecordPageReference,
  RelationshipPageReference,
  WebPageReference
} from "c/sfGpsDsOsrtNavigationUtils";

/**
 * This export can now be found in c/sfGpsDsOsrtGooglePlacesService.
 * To be removed in 109.
 * @deprecated
 */
export { getCoordinates } from "c/sfGpsDsOsrtGooglePlacesService";

export function ie11pathnameFix(urlHelper) {
  return urlHelper.pathname.replace(/(^\/?)/, "/");
}

/**
 * `delay` moved to asyncUtils.
 * This alias should be removed in 109.
 * @deprecated
 */
export { delay } from "c/sfGpsDsOsrtAsyncUtils";
export { default as isRtl } from "./isRtl";
export { default as isCommunityPage } from "./isCommunity";
export { default as getDataHandler } from "./dataHandler";
export { default as getCardsDataHandler } from "./dataHandlerCards";
export { default as params } from "./params";
export { parseParams, removeNamespace, getCommunityPrefix } from "./params";
export { default as formatNumber } from "./formatNumber";
export { default as makeUrl } from "./makeUrl";
export { default as getUserProfile } from "./userProfile";
export { default as formatCurrency } from "./formatCurrency";
export { default as formatDate } from "./formatDate";
export { default as textMask } from "./textMask";
export { default as inputMask } from "./inputMask";
export { default as dateMask } from "./dateMask";
export { default as isDate } from "./isDate";
export { default as isValidDate } from "./isValidDate";
export { default as getIcon } from "./iconFactory";
export { default as dynamicSort } from "./dynamicSort";
export { default as localStoreMethods } from "./localStoreMethods";
/**
 * `debounce` moved to asyncUtils.
 * This alias should be removed in 109.
 * @deprecated
 */
export { debounce } from "c/sfGpsDsOsrtAsyncUtils";
export { default as Logger } from "./logger";
export { default as datasourceParser } from "./datasourceParser";
export { default as getCustomNewportUrl } from "./newportUrl";
export { getDateTimeLocaleFormat } from "./getDateTimeLocaleFormat";
export { default as handlePriorityCalls } from "./handlePriorityCalls";

// export {
//   initInteraction,
//   getDefaultTrackingData,
//   fieldTrackingObj,
//   actionTrackingObj
// } from "c/actionUtility";

export { getInteractionData, setInteractionData } from "./getInteractionObject";

export {
  interpolate,
  interpolateWithRegex,
  interpolateElement,
  interpolateKeyValue
} from "c/sfGpsDsOsrtDataInterpolation";
export { dateValueParser } from "./formatDate";
// export {
//   loadSDK,
//   invokeSDKMethod,
//   fetchActionRegistryData
// } from "./sdkHandlerUtil";
export { extractCardMergeFields } from "./common";
