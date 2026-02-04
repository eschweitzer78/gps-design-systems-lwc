import { parseParams, normalizeParams } from "c/sfGpsDsOsrtNavigationUtils";

function params(currentPageRef) {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to params!
  let pageParams = {};
  let query;
  // for Desktop
  if (window.location?.search) {
    if (typeof Visualforce !== "undefined") {
      query = window.location.search.substring(1);
      // for Mobile Hybrid Ionic
    } else {
      query = window.location.hash.split("?")[1];
    }
    if (!query && window.location.search) {
      query = window.location.search.substring(1);
    }
    if (query) {
      pageParams = parseParams(query);
    }
  } else if (currentPageRef?.state) {
    return { ...currentPageRef.state };
  }

  return pageParams;
}

export default params;

function getCommunityPrefix() {
  return "/sfsites/c";
}

export { parseParams, normalizeParams as removeNamespace, getCommunityPrefix };
