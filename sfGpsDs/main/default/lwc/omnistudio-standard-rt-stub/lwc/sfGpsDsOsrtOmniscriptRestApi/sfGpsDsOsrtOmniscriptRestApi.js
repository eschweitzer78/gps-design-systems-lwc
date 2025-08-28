import omniscriptRestApiUtilsForCore from "c/sfGpsDsOsrtOmniscriptRestApiUtilsForCore";
// how many times does this get called??
const omniRestApi = new omniscriptRestApiUtilsForCore();

import CustomLabels from "./customLabels";

function logOmniScriptMetrics() {
  return Promise.resolve(null);
}

function getCommunityBaseUrl() {
  return Promise.resolve(null);
}

function logUsageInteractionEvent() {
  return Promise.resolve(null);
}

function isCommunity() {
  return omniRestApi.isCommunity();
}

function getCommunityName() {
  return Promise.resolve(null);
}

function DeleteOSContentDocument(config) {
  return omniRestApi.deleteOSContentDocument(config);
}

function LinkContentDocument(config) {
  return omniRestApi.linkContentDocument(config);
}

function VlocityTrack(config) {
  return omniRestApi.vlocityTrack(config);
}

function SaveBP() {
  return Promise.resolve(null);
}

function GenericInvoke2NoCont(config) {
  return omniRestApi.genericInvoke2NoCont(config);
}

function GenericInvoke2(config) {
  return omniRestApi.genericInvoke2(config);
}

function getCurrentBaseUrl(networkPath) {
  return `${window.location.protocol}//${window.location.hostname}/${networkPath}`;
}

function isOffPlatform() {
  return false;
}

/**
 * @description Replaces URL host.
 * @param {String} imageStr
 * @param {Boolean} bCommunity
 * @param {String | null} communityName - null, if not in Communities
 * @param {String | null} communityBaseUrl - null, if not in Communities
 * @returns {String}
 */
function replaceUrlHost(
  originalUrl,
  bCommunity,
  communityName,
  communityBaseUrl
) {
  let type = "resource";
  let url = originalUrl;

  if (url.search("servlet") >= 0) {
    type = "servlet";
    url = url.replace(/\.\.\/servlet/g, "/servlet");
  }

  // For non-activated Communities preview page
  if (
    bCommunity &&
    (/livepreview/.test(window.location.host) ||
      /live-preview/.test(window.location.host))
  ) {
    return url.replaceAll(`/${type}/`, `/sfsites/c/${type}/`);
  }

  // For activated Communities page with path's
  if (bCommunity && url) {
    if (communityBaseUrl) {
      return url.replaceAll(`/${type}/`, `${communityBaseUrl}/${type}/`);
    } else if (communityName) {
      return url.replaceAll(`/${type}/`, `/${communityName}/${type}/`);
    }
  }

  // For non-Communities or Communities at root, no need to transform url
  return url;
}

let isCommunityLwcValue = null;
export function isCommunityURL() {
  if (isCommunityLwcValue === null) {
    return isCommunity().then((result) => {
      isCommunityLwcValue = result;
      return isCommunityLwcValue;
    });
  }
  return Promise.resolve(isCommunityLwcValue);
}

export {
  GenericInvoke2,
  GenericInvoke2NoCont,
  SaveBP,
  isCommunity,
  VlocityTrack,
  LinkContentDocument,
  DeleteOSContentDocument,
  CustomLabels,
  getCurrentBaseUrl,
  getCommunityName,
  getCommunityBaseUrl,
  replaceUrlHost,
  logUsageInteractionEvent,
  logOmniScriptMetrics,
  isOffPlatform
};
