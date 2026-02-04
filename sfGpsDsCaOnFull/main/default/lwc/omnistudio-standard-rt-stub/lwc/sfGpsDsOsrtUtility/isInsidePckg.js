import { isInsidePckg as isInsidePckgMethod } from "c/sfGpsDsOsrtSalesforceUtils";

let inPckg;
let inPckgPromise;

let isInsidePckgPromise = function () {
  if (inPckgPromise) {
    return inPckgPromise;
  }
  inPckgPromise = isInsidePckgMethod();
  return inPckgPromise;
};

let isInsidePckg = function () {
  if (typeof inPckg === "undefined") {
    isInsidePckgPromise().then((data) => {
      inPckg = data;
      return data;
    });
  }
  return inPckg;
};

export { isInsidePckg, isInsidePckgPromise };
