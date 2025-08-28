import { getNewportUrl } from "c/sfGpsDsOsrtSalesforceUtils";
let ndsPromise;
function getCustomNewportUrl() {
  if (ndsPromise) {
    return ndsPromise;
  }
  ndsPromise = new Promise((resolve) => {
    getNewportUrl().then((url) => {
      resolve(url);
    });
  });
  return ndsPromise;
}

export default getCustomNewportUrl;
