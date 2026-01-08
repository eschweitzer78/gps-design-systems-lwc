import {
  debug,
  getCurrentCategoriesState,
  elContains,
  setAcceptedCategories,
  isString,
  retrieveRejectedServices,
  isArray,
  resolveEnabledCategories,
  resolveEnabledServices,
  getKeys,
  deepCopy,
  fireEvent
} from "./utils-general";
import { 
  retrieveEnabledCategoriesAndServices 
} from "./utils-scripts";
import {
  setCookie,
  eraseCookiesHelper,
  saveCookiePreferences,
  getSingleCookie,
  getPluginCookie,
  getAllCookies
} from "./utils-cookies";
import {
  OPT_OUT_MODE,
} from "./utils-constants";
import { 
  localStorageManager 
} from "./utils-localstorage";
import {
  globalObj,
  GlobalState
} from "./core-global";
import { 
  setConfig 
} from "./core-config-init";
import type { 
  UserConfig, 
  UserPreferences 
} from "c/sfGpsDsCookieConsent";

/**
 * Accept API
 */
export const acceptCategory = (
  categories?: string[] | string, 
  excludedCategories: string[] = []
) => {
  resolveEnabledCategories(categories, excludedCategories);
  resolveEnabledServices();
  saveCookiePreferences();
};

/**
 * Returns true if cookie category is accepted
 */
export const acceptedCategory = (
  category: string
) => {

  const acceptedCategories = !globalObj._state._invalidConsent
    ? globalObj._state._acceptedCategories
    : [];

  return elContains(acceptedCategories, category);
};

/**
 * Accept one or multiple services under a specific category
 */
export const acceptService = (
  service: string | string[], 
  category: string
) => {
  const { _allCategoryNames, _allDefinedServices,  } = globalObj._state;

  if (
    !service
    || !category
    || !isString(category)
    || !elContains(_allCategoryNames, category)
    || getKeys(_allDefinedServices[category]).length === 0
  ) {
    return false;
  }

  acceptCategory();
  return true;
};

/**
 * Returns true if the service in the specified
 * category is accepted/enabled
 */
export const acceptedService = (
  service: string, 
  category: string
) => {
  const acceptedServices = !globalObj._state._invalidConsent
    ? (globalObj._state._acceptedServices[category] || [])
    : [];

  return elContains(acceptedServices, service);
};

/**
 * Returns true if cookie was found and has valid value (not an empty string)
 */
export const validCookie = (cookieName: string) => getSingleCookie(cookieName, true) !== "";

/**
 * Erase cookies API
 */
export const eraseCookies = (
  cookies: (string|RegExp|(string|RegExp)[]), 
  path: string, 
  domain: string
) => {
  let allCookies = [];

  /**
   * Add cookie to allCookies array if it exists
   */
  const addCookieIfExists = (cookieName: string | RegExp) => {
    if (isString(cookieName)) {
      let name = getSingleCookie(cookieName);
      name !== "" && allCookies.push(name);
    } else {
      allCookies.push(...getAllCookies(cookieName));
    }
  };

  if (isArray(cookies)) {
    for (let cookie of cookies) {
      addCookieIfExists(cookie);
    }
  } else {
    addCookieIfExists(cookies);
  }

  eraseCookiesHelper(allCookies, path, domain);
};

/**
 * Retrieve current user preferences (summary)
 */
export const getUserPreferences = (): UserPreferences => {
  const { _acceptType, _acceptedServices } = globalObj._state;
  const { accepted, rejected } = getCurrentCategoriesState();

  return deepCopy({
    acceptType: _acceptType,
    acceptedCategories: accepted,
    rejectedCategories: rejected,
    acceptedServices: _acceptedServices,
    rejectedServices: retrieveRejectedServices()
  });
};

/**
 * Save custom data inside cookie
 */
export const setCookieData = (
  props: {
    value: any,
    mode: string
  }
): boolean => {
  let newData = props.value,
    mode = props.mode,
    set = false,
    cookieData: any;

  const state = globalObj._state;

  /**
   * If mode is "update":
   * add/update only the specified props.
   */
  if (mode === "update") {
    state._cookieData = cookieData = getCookie("data");
    const sameType = typeof cookieData === typeof newData;

    if (sameType && typeof cookieData === "object") {
      !cookieData && (cookieData = {});

      for (let prop in newData) {
        if (cookieData[prop] !== newData[prop]) {
          cookieData[prop] = newData[prop];
          set = true;
        }
      }
    } else if ((sameType || !cookieData) && cookieData !== newData) {
      cookieData = newData;
      set = true;
    }
  } else {
    cookieData = newData;
    set = true;
  }

  if (set) {
    state._cookieData = cookieData;
    state._savedCookieContent.data = cookieData;
    setCookie(true);
  }

  return set;
};

export const getCookie = (
  field: string, 
  cookieName?: string
): any => {
  if (cookieName == null) {
    cookieName = field;
    field = null;
  }

  const cookie = getPluginCookie(cookieName);

  return field
    ? cookie[field]
    : cookie;
};

/**
 * Return configuration object or just one of its fields.
 */
export const getConfig = (
  field: string
): any => {
  const config = globalObj._config;
  const userConfig = globalObj._state._userConfig;

  return field
    ? config[field] || userConfig[field]
    : {...config, ...userConfig, cookie:{...config.cookie}};
};

/**
 * Returns true if consent is valid
 */
export const validConsent = (): boolean => !globalObj._state._invalidConsent;

const retrieveState = (config: UserConfig = globalObj._config) => {
  const state = globalObj._state;
  //const config = globalObj._config;

  const cookieValue = getPluginCookie();

  const {
    categories,
    services,
    consentId,
    consentTimestamp,
    lastConsentTimestamp,
    data,
    revision
  } = cookieValue;

  const validCategories = isArray(categories);

  state._savedCookieContent = cookieValue;
  state._consentId = consentId;

  // If "_consentId" is present => assume that consent was previously given
  const validConsentId = !!consentId && isString(consentId);

  // Retrieve "_consentTimestamp"
  state._consentTimestamp = consentTimestamp ? new Date(consentTimestamp) : null;

  // Retrieve "_lastConsentTimestamp"
  state._lastConsentTimestamp = lastConsentTimestamp ? new Date(lastConsentTimestamp) : null;

  // Retrieve "data"
  state._cookieData = typeof data !== "undefined"
    ? data
    : null;

  // If revision is enabled and current value !== saved value inside the cookie => revision is not valid
  if (state._revisionEnabled && validConsentId && revision !== config.revision)
    state._validRevision = false;

  state._invalidConsent = !validConsentId
    || !state._validRevision
    || !state._consentTimestamp
    || !state._lastConsentTimestamp
    || !validCategories;

  /**
   * If localStorage is enabled, also check the stored `expirationTime`
   */
  if (config.cookie.useLocalStorage && !state._invalidConsent) {
    state._invalidConsent = new Date().getTime() > (cookieValue.expirationTime || 0);

    if (state._invalidConsent)
      localStorageManager._removeItem(config.cookie.name);
  }

  debug("CookieConsent [STATUS] valid consent:", !state._invalidConsent);
  retrieveEnabledCategoriesAndServices();

  /**
   * Retrieve last accepted categories from cookie
   * and calculate acceptType
   */
  if (!state._invalidConsent) {
    state._acceptedServices = {
      ...state._acceptedServices,
      ...services
    };

    state._enabledServices = {...state._acceptedServices};

    setAcceptedCategories([
      ...state._readOnlyCategories,
      ...categories
    ]);
  } else {
    if (config.mode === OPT_OUT_MODE) {
      state._acceptedCategories = [
        ...state._defaultEnabledCategories
      ];
    }
  }
};

/**
 * Will run once and only if modals do not exist.
 */
export const run = async (userConfig: UserConfig) => {
  const {
    _state,
    _config,
    _customEvents
  } = globalObj;

  const win = window;

  // @ts-ignore
  if (!win._ccRun) {
    // @ts-ignore
    win._ccRun = true;

    setConfig(userConfig);

    if (_state._botAgentDetected)
      return;

    retrieveState(); //userConfig);

    const consentIsValid = validConsent();

    if (consentIsValid) {
      // TODO manageExistingScripts();
      return fireEvent(_customEvents._onConsent);
    }

    if (_config.mode === OPT_OUT_MODE) {
      // TODO manageExistingScripts(_state._defaultEnabledCategories);
    }
  }
};

/**
 * Reset cookieconsent
 */
export const reset = (deleteCookie: boolean) => {
  const { name, path, domain, useLocalStorage } = globalObj._config.cookie;

  if (deleteCookie) {
    if (useLocalStorage) {
      localStorageManager._removeItem(name);
    } else {
      eraseCookies(name, path, domain);
    }
  }

  /**
   * Remove data-cc event listeners
   */
  /*
  for (const {_element, _event, _listener} of globalObj._state._dataEventListeners) {
    _element.removeEventListener(_event, _listener);
  }
  */

  const newGlobal = new GlobalState();

  /**
   * Reset all global state props.
   */
  for (const key in globalObj) {
    globalObj[key] = newGlobal[key];
  }

  // @ts-ignore
  window._ccRun = false;
};