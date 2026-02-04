/**
 * This method is used to identify whether the user is in a community page or not.
 */
import { isCommunity } from "c/sfGpsDsOsrtSalesforceUtils";
import localStoreMethods from "./localStoreMethods";

let pendingPromise = [];

function isCommunityPage() {
  var stored = localStoreMethods.getItem("vlocity.isCommunityPage");

  try {
    let cachedResponse =
      stored && typeof stored === "string" ? JSON.parse(stored) : null;
    if (cachedResponse != null) {
      return new Promise(function (resolve) {
        resolve(cachedResponse);
      });
    }
  } catch (e) {
    (() => {})();
  }

  return new Promise(function (resolve) {
    if (!pendingPromise.length) {
      let promise = isCommunity().then((result) => {
        localStoreMethods.setItem(
          "vlocity.isCommunityPage",
          JSON.stringify(result)
        );
        return result;
      });

      pendingPromise.push(promise);
    }

    resolve(pendingPromise[0]);
  });
}

export default isCommunityPage;
