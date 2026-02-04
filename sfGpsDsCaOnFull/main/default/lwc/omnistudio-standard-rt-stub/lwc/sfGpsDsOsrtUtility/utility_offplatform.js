//Added dummy method to support offplatform
export function loadScript() {
  return "";
}

//Added dummy method to support offplatform
export function loadStyle() {
  return "";
}

//Added dummy variable to support offplatform
let newport = "";
let namespace = "";
let monaco = "";
let tinymce = "";
let javascriptNumberFormatter = "";
let flexipageStyle = "";
//Added hardcoded userProfile can be overidden by setting global variable userProfile
let userProfile = window.userProfile || { anlocale: "en-us", money: "USD" };

export {
  newport,
  namespace,
  monaco,
  tinymce,
  javascriptNumberFormatter,
  flexipageStyle,
  userProfile
};

export function ie11pathnameFix(urlHelper) {
  return urlHelper.pathname.replace(/(^\/?)/, "/");
}

export function getOrigin() {
  return "origin" in window.location
    ? window.location.origin
    : [
        window.location.protocol,
        "//",
        window.location.hostname,
        window.location.port ? ":" + window.location.port : ""
      ].join("");
}

// eslint-disable-next-line no-unused-vars
export function getDataHandler(requestData) {
  return new Promise((resolve) => {
    resolve([]);
  });
}

export function getUserProfile() {
  return new Promise((resolve) => {
    resolve(userProfile);
  });
}

export function formatCurrency(number) {
  // eslint-disable-next-line no-undef
  return formatNumber(number, userProfile.anlocale, {
    style: "currency",
    currency: userProfile.money
  });
}

export { default as isRtl } from "./isRtl";
export { default as formatNumber } from "./formatNumber";
export { default as makeUrl } from "./makeUrl";
export { default as textMask } from "./textMask";
export { default as inputMask } from "./inputMask";
export { default as dateMask } from "./dateMask";
export { default as dynamicSort } from "./dynamicSort";
export { default as params } from "./params";
