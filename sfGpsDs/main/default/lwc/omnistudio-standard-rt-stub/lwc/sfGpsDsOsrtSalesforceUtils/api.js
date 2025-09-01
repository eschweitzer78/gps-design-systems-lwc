// import handleData from "@salesforce/apex/ComponentController.handleData";
// import handleDataCards from "@salesforce/apex/ComponentController.handleDataCards";
// import getCustomLabels from "@salesforce/apex/ComponentController.getCustomLabels";
// import getCustomSettings from "@salesforce/apex/ComponentController.getCustomSettings";
// import fetchUserContext from "@salesforce/apex/FetchUserDetails.fetchUserContext";
// import getResourceUrl from "@salesforce/apex/FetchStaticResourceUrl.getResourceUrl";
// import isCommunity from "@salesforce/apex/ComponentController.isCommunity";
// import getCommunityName from "@salesforce/apex/ComponentController.getCommunityName";
// import getCommunityPrefixIfNeeded from "@salesforce/apex/ComponentController.getCommunityPrefixIfNeeded";
// import isInsidePckg from "@salesforce/apex/ComponentController.isInsidePckg";
// import trackVlocityInteraction from "@salesforce/apex/ComponentController.trackVlocityInteraction";
// import getCustomPermissionsForUser from "@salesforce/apex/ComponentController.getCustomPermissionsForUser";
// import getNewportUrl from "@salesforce/apex/NewportUtilities.getNewportUrl";
// import getInteractionObject from "@salesforce/apex/ComponentController.getInteractionObject";
// import getUserProfile from "@salesforce/apex/ComponentController.getUserProfile";
// import doGenericInvokeWithCont from "@salesforce/apexContinuation/ComponentController.doGenericInvokeWithCont";
// import getAllSupportedSObjects from "@salesforce/apex/ComponentController.getAllSupportedSObjects";

// import monaco from "@salesforce/resourceUrl/monaco";
// import datasource from "@salesforce/resourceUrl/vlocitysdk";
// import newport from "@salesforce/resourceUrl/newport";
// import tinymce from "@salesforce/resourceUrl/tinymce_5";
// import flexipageStyle from "@salesforce/resourceUrl/flexipageStyle";
// import javascriptNumberFormatter from "@salesforce/resourceUrl/javascriptNumberFormatter";

import shortDateFormat from "@salesforce/i18n/dateTime.shortDateFormat";
import datetimeFormat from "@salesforce/i18n/dateTime.shortDateTimeFormat";
import LANG from "@salesforce/i18n/lang";
import TIMEZONE from "@salesforce/i18n/timeZone";
import LOCALE from "@salesforce/i18n/locale";
import CURRENCY from "@salesforce/i18n/currency";

import omniscriptRestApiUtilsForCore from "c/sfGpsDsOsrtOmniscriptRestApiUtilsForCore";
// how many times does this get called??
const omniRestApi = new omniscriptRestApiUtilsForCore();

// import { getActionsInfo } from "c/actionUtility";

function handleData() {
  return Promise.resolve(null);
}

function handleDataCards() {
  return Promise.resolve(null);
}

function getCustomLabels() {
  return Promise.resolve(null);
}

function getCustomSettings() {
  return Promise.resolve(null);
}

function getAllSupportedSObjects() {
  return Promise.resolve(null);
}

function doGenericInvokeWithCont() {
  return Promise.resolve(null);
}

function getUserProfile() {
  return Promise.resolve(null);
}

function getInteractionObject() {
  return Promise.resolve(null);
}

function getCustomPermissionsForUser() {
  return Promise.resolve(null);
}

function trackVlocityInteraction() {
  return Promise.resolve(null);
}

function isInsidePckg() {
  return Promise.resolve(false);
}

function getCommunityPrefixIfNeeded() {
  return Promise.resolve(null);
}

function getCommunityName() {
  return Promise.resolve(null);
}

function isCommunity() {
  return omniRestApi.isCommunity();
}

function fetchUserContext() {
  return Promise.resolve(null);
}

function getResourceUrl() {
  return Promise.resolve(null);
}

function getNewportUrl() {
  return omniRestApi.getNewportUrl();
}

export {
  handleData,
  getCustomLabels,
  getCustomSettings,
  LOCALE,
  CURRENCY,
  // getActionsInfo,
  fetchUserContext,
  getResourceUrl,
  // datasource,
  isCommunity,
  getCommunityName,
  getCommunityPrefixIfNeeded,
  isInsidePckg,
  // monaco,
  trackVlocityInteraction,
  getCustomPermissionsForUser,
  // newport,
  // tinymce,
  // flexipageStyle,
  // javascriptNumberFormatter,
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
};
