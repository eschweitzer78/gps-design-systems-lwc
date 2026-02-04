import { AcceptType, CookieValue } from "c/sfGpsDsCookieConsent";
import { globalObj } from "./core-global";

/**
 * Helper console.log function
 * @param {any} [params]
 */
export const debug = (...params: any[]) => {
  console.debug(...params);
};

export const indexOf = <T>(el: T[] | string, value: T | string) => typeof el === "string" 
  ? el.indexOf(value as string) 
  : el.indexOf(value as T);

/**
 * Returns true if el. (array or string) contains the specified value
 * @param {any[]|string} el
 */
export const elContains = <T>(el: T[] | string, value: T | string) => indexOf(el, value) !== -1;
export const isArray = (el: any) => Array.isArray(el);
export const isString = (el: any) => typeof el === "string";
export const isObject = (el: any) => !!el && typeof el === "object" && !isArray(el);
export const isFunction = (el: any) => typeof el === "function";
export const getKeys = (obj: object) => Object.keys(obj);

/**
 * Return array without duplicates
 */
export const unique = <T>(arr: T[]) => Array.from(new Set(arr));

export const deepCopy = (el: any) => {
  if (typeof el !== "object" )
    return el;

  if (el instanceof Date)
    return new Date(el.getTime());

  let clone = Array.isArray(el) ? [] : {};

  // eslint-disable-next-line guard-for-in
  for (let key in el) {
    let value = el[key];
    clone[key] = deepCopy(value);
  }

  return clone;
};

/**
 * Symmetric difference between 2 arrays
 */
export const arrayDiff = (arr1: any[], arr2: any[]) => {
  const a = arr1 || [];
  const b = arr2 || [];

  return a
    .filter(x => !elContains(b, x))
    .concat(b.filter(x => !elContains(a, x)));
};

/**
 * Store categories and services" config. details
 */
export const fetchCategoriesAndServices = (allCategoryNames: string[]) => {
  const {
    _allDefinedCategories,
    _allDefinedServices,
    _acceptedServices,
    _enabledServices,
    _readOnlyCategories
  } = globalObj._state;

  for (let categoryName of allCategoryNames) {

    const currCategory = _allDefinedCategories[categoryName];
    const services = currCategory.services || {};
    const serviceNames = isObject(services) && getKeys(services) || [];

    _allDefinedServices[categoryName] = {};
    _acceptedServices[categoryName] = [];
    _enabledServices[categoryName] = [];

    /**
     * Keep track of readOnly categories
     */
    if (currCategory.readOnly) {
      _readOnlyCategories.push(categoryName);
      _acceptedServices[categoryName] = serviceNames;
    }

    for (let serviceName of serviceNames) {
      const service = services[serviceName];
      // TODO service._enabled = false;
      _allDefinedServices[categoryName][serviceName] = service;
    }
  }
};

/**
 * Calculate rejected services (all services - enabled services)
 */
export const retrieveRejectedServices = (): Record<string, string[]> => {
  const rejectedServices = {};

  const {
    _allCategoryNames,
    _allDefinedServices,
    _acceptedServices
  } = globalObj._state;

  for (const categoryName of _allCategoryNames) {
    rejectedServices[categoryName] = arrayDiff(
      _acceptedServices[categoryName],
      getKeys(_allDefinedServices[categoryName])
    );
  }

  return rejectedServices;
};

export const resolveEnabledServices = (relativeCategory?: string) => {
  const state = globalObj._state;

  const {
    _enabledServices,
    _readOnlyCategories,
    _acceptedServices,
    _allDefinedServices,
    _allCategoryNames
  } = state;

  const categoriesToConsider = relativeCategory
    ? [relativeCategory]
    : _allCategoryNames;

  /**
   * Save previously enabled services to calculate later on which of them was changed
   */
  state._lastEnabledServices = deepCopy(_acceptedServices);

  for (const categoryName of categoriesToConsider) {
    const services = _allDefinedServices[categoryName];
    const serviceNames = getKeys(services);
    const customServicesSelection = _enabledServices[categoryName] && _enabledServices[categoryName].length > 0;
    const readOnlyCategory = elContains(_readOnlyCategories, categoryName);

    /**
     * Stop here if there are no services
     */
    if (serviceNames.length === 0)
      continue;

    // Empty (previously) enabled services
    _acceptedServices[categoryName] = [];

    // If category is marked as readOnly enable all its services
    if (readOnlyCategory) {
      _acceptedServices[categoryName].push(...serviceNames);
    } else {
      if (customServicesSelection) {
        const selectedServices = _enabledServices[categoryName];
        _acceptedServices[categoryName].push(...selectedServices);
      } else {
        _acceptedServices[categoryName] = state._enabledServices[categoryName];
      }
    }

    /**
     * Make sure there are no duplicates inside array
     */
    _acceptedServices[categoryName] = unique(_acceptedServices[categoryName]);
  }
};

/**
 * Generate RFC4122-compliant UUIDs.
 * https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid?page=1&tab=votes#tab-top
 */
export const uuidv4 = (): string => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string, ...args: any[]) => {
    return (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16);
  });
};

/**
 * Helper function to retrieve cookie duration
 */
export const getExpiresAfterDaysValue = (): number => {
  const expiresAfterDays = globalObj._config.cookie.expiresAfterDays;

  return isFunction(expiresAfterDays)
    ? (expiresAfterDays as (acceptType: AcceptType) => number)(globalObj._state._acceptType)
    : expiresAfterDays as number;
};

/**
 * Calculate the existing cookie"s remaining time until expiration (in milliseconds)
 */
export const 
getRemainingExpirationTimeMS = () => {
  const lastTimestamp = globalObj._state._lastConsentTimestamp;

  const elapsedTimeMilliseconds = lastTimestamp
    ? new Date().valueOf() - lastTimestamp.valueOf()
    : 0;

  return getExpiresAfterDaysValue()*86400000 - elapsedTimeMilliseconds;
};

/**
 * Calculate "accept type"
 */
export const 
resolveAcceptType = (): "all" | "custom"| "necessary" => {
  let type: "all" | "custom"| "necessary" = "custom";

  const { _acceptedCategories, _allCategoryNames, _readOnlyCategories } = globalObj._state;
  const nAcceptedCategories = _acceptedCategories.length;

  if (nAcceptedCategories === _allCategoryNames.length)
    type = "all";
  else if (nAcceptedCategories === _readOnlyCategories.length)
    type = "necessary";

  return type;
};

/**
 * Note: getUserPreferences() depends on "acceptType"
 */
export const 
setAcceptedCategories = (
  acceptedCategories: string[]
) => {
  globalObj._state._acceptedCategories = unique(acceptedCategories);
  globalObj._state._acceptType = resolveAcceptType();
};

/**
 * Obtain accepted and rejected categories
 */
export const 
getCurrentCategoriesState = (): { 
  accepted: string[], 
  rejected: string[] 
} => {
  const {
    _invalidConsent,
    _acceptedCategories,
    _allCategoryNames
  } = globalObj._state;

  return {
    accepted: _acceptedCategories,
    rejected: _invalidConsent
      ? []
      : _allCategoryNames.filter(category =>
        !elContains(_acceptedCategories, category)
      )
  };
};

const dispatchPluginEvent = (
  eventName: string, 
  data: any
) => dispatchEvent(new CustomEvent(eventName, {detail: data}));

export const fireEvent = (
  eventName: string
) => {
  const {
    _onChange,
    _onConsent,
    _onFirstConsent
  } = globalObj._callbacks;

  const events = globalObj._customEvents;

  const params: {
    cookie: CookieValue,
    changedCategories: string[],
    changedServices: Record<string, string[]>
  } = {
      cookie: globalObj._state._savedCookieContent,
      changedCategories: [],
      changedServices: {}
  };

  if (eventName === events._onFirstConsent) {
    if (isFunction(_onFirstConsent))
      _onFirstConsent(deepCopy(params));
  } else if (eventName === events._onConsent) {
    if (isFunction(_onConsent))
      _onConsent(deepCopy(params));
  } else {
    params.changedCategories = globalObj._state._lastChangedCategoryNames;
    params.changedServices = globalObj._state._lastChangedServices;

    if (isFunction(_onChange))
      _onChange(deepCopy(params));
  }

  dispatchPluginEvent(eventName, deepCopy(params));
}

export const 
safeRun = (
  fn: Function, 
  hideError?: boolean
) => {
  try {
  return fn();
  } catch (e) {
  if (!hideError) console.warn("CookieConsent:", e);
  return false;
  }
};

export const 
resolveEnabledCategories = (
  categories: string[] | string, 
  excludedCategories: string[]
) => {
  const {
    _allCategoryNames,
    _acceptedCategories,
    _readOnlyCategories,
    _enabledServices,
    _defaultEnabledCategories,
    _allDefinedServices
  } = globalObj._state;

  let enabledCategories: string[] = [];

  if (!categories) {
    enabledCategories = [..._acceptedCategories, ..._defaultEnabledCategories];
  } else {
    if (isArray(categories)) {
      enabledCategories.push(...categories);
    } else if (isString(categories)) {
      enabledCategories = categories === "all"
        ? _allCategoryNames
        : [categories];
    }

    /**
     * If there are services, turn them all on or off
     */
    for (const categoryName of _allCategoryNames) {
      _enabledServices[categoryName] = elContains(enabledCategories, categoryName)
        ? getKeys(_allDefinedServices[categoryName])
        : [];
    }
  }

  // Remove invalid and excluded categories
  enabledCategories = enabledCategories.filter(category =>
    !elContains(_allCategoryNames, category) ||
    !elContains(excludedCategories, category)
  );

  // Add back all the categories set as "readonly/required"
  enabledCategories.push(..._readOnlyCategories);

  setAcceptedCategories(enabledCategories);
};
