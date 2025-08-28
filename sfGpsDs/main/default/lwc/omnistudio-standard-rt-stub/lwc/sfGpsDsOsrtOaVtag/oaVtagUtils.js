import LANG from "@salesforce/i18n/lang";
import FORMFACTOR from "@salesforce/client/formFactor";
import { setCookie, getCookie } from "c/sfGpsDsOsrtOaUtils";

/**
 * getUniqueId
 * Generates a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx, where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 * @returns String UUIDV4
 * Reference:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * https://gist.github.com/jed/982883
 */
const getUniqueId = () => {
  // uuid v4
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    // browser
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  // older browsers and node
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * getBrowserInfo
 * @returns browser name and version
 * eg: {name: Chrome, version: 81 }
 */
const getBrowserInfo = () => {
  const userAgent = window.navigator.userAgent;
  let match =
    userAgent.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
    ) || [];
  let temp;
  if (/trident/i.test(match[1])) {
    temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return {
      name: "IE",
      version: temp[1] || ""
    };
  }
  if (match[1] === "Chrome") {
    temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
    if (temp != null) {
      const info = temp.slice(1).join(",").replace("OPR", "Opera");
      return { name: info.split(",")[0], version: info.split(",")[1] };
    }
  }
  match = match[2]
    ? [match[1], match[2]]
    : [navigator.appName, navigator.appVersion, "-?"];
  if ((temp = userAgent.match(/version\/(\d+)/i)) != null)
    match.splice(1, 1, temp[1]);
  return { name: match[0], version: match[1] };
};

/**
 * getChannel
 * @returns type of device used for browsing
 */
const getChannel = () => {
  const channelMap = {
    Small: "Mobile",
    Medium: "Tablet",
    Large: "Desktop"
  };
  return channelMap[FORMFACTOR];
};

/**
 * getTrackingSessionKey
 * @returns unique key per user session
 */
const getTrackingSessionKey = () => {
  const sessionKeyApiName = "OmniAnalyticsSessionKey";
  let trackingSessionKey = "";
  //Session storage support
  if (window.sessionStorage) {
    trackingSessionKey = window.sessionStorage.getItem(sessionKeyApiName);
    if (!trackingSessionKey) {
      trackingSessionKey = getUniqueId();
      window.sessionStorage.setItem(sessionKeyApiName, trackingSessionKey);
    }
  }
  //Cookie support incase of private browsing mode or if session storage is not available
  else {
    trackingSessionKey = getCookie(sessionKeyApiName);
    if (!trackingSessionKey) {
      trackingSessionKey = getUniqueId();
      setCookie(sessionKeyApiName, trackingSessionKey);
    }
  }
  return trackingSessionKey;
};

/********* Added for future usage *******/
/**
 * getWindowProfile
 * @returns an object with window height, width and scroll height
 * Reference:
 * https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
 */
// eslint-disable-next-line no-unused-vars
const getWindowProfile = () => {
  if (typeof document === "undefined") return {};
  const body = document.body || {};
  const html = document.documentElement || {};
  return {
    Domain: window.location.hostname,
    QueryString: window.location.search,
    PageHeight: Math.max(html.clientHeight || 0, window.innerHeight || 0),
    PageWidth: Math.max(html.clientWidth || 0, window.innerWidth || 0),
    PageScrollHeight:
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) || null,
    ScreenHeight: window.screen.availHeight,
    ScreenWidth: window.screen.availWidth,
    PageTitle: document.title,
    PageUrl: window.location.href,
    PathName: window.location.pathname
  };
};

/**
 * getSessionInfo
 * @returns an object with session info
 */
const getSessionInfo = () => {
  const browserInfo = getBrowserInfo();
  return {
    AcceptLanguage: LANG,
    BrowserVersion: browserInfo.version,
    BrowserVendor: browserInfo.name,
    Channel: getChannel(),
    FormFactor: FORMFACTOR,
    ReferrerUrl: document.referrer,
    UserAgentString: window.navigator.userAgent
  };
};

/**
 * getSessionDefaults - singleton
 * @returns an object with all session properties for tracking
 */
const getSessionDefaults = (() => {
  let sessionDefaults;
  return {
    getInstance: () => {
      if (!sessionDefaults) {
        sessionDefaults = getSessionInfo();
      }
      //Generate session key if it is not available in Session Storage
      sessionDefaults.SessionKey = getTrackingSessionKey();
      return sessionDefaults;
    }
  };
})();

export { getSessionDefaults };
