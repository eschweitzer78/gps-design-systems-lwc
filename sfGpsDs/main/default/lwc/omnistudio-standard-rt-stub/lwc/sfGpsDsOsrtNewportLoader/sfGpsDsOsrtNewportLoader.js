import { loadStyle } from "lightning/platformResourceLoader";

import omniscriptRestApiUtilsForCore from "c/sfGpsDsOsrtOmniscriptRestApiUtilsForCore";

const omniRestApi = new omniscriptRestApiUtilsForCore();

let isLoaded = false;

/**
 * Load newport stylesheet into the page (if not yet loaded). This function takes care of loading it from the custom settings
 * value in the org if it's available otherwise it'll load it from the managed package copy of Newport.
 */
export function load(component, useRTL = false) {
  if (!isLoaded) {
    isLoaded = true;
    return omniRestApi.getNewportUrl().then((url) => {
      // force rtl to be loaded
      if (useRTL) {
        url = "isRTL";
      }
      let path =
        "/assets/styles/vlocity-newport-design-system-scoped." +
        (url === "isRTL" ? "rtl." : "") +
        "min.css";
      return loadStyle(
        component,
        url && url !== "isRTL" ? url : omniRestApi.newport() + path
      );
    });
  }
  return Promise.resolve();
}
