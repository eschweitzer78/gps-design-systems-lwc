import { globalObj } from "./core-global";
import {
  debug,
  elContains,
  isString,
  isArray,
  isFunction
} from "./utils-general";

/**
 * Returns the current language code
 * @returns {string}
 */
export const getCurrentLanguageCode = (): string => {
  return globalObj._state._currentLanguageCode || globalObj._state._userConfig.language.default;
};

/**
 * Set language code
 */
export const setCurrentLanguageCode = (newLanguageCode: string) => {
  newLanguageCode && (globalObj._state._currentLanguageCode = newLanguageCode);
};

/**
 * Get current client's browser language
 * returns only the first 2 chars: en-US => en
 */
export const getBrowserLanguageCode = (): string => navigator.language;

/**
 * Get the lang attribute
 */
export const getDocumentLanguageCode = (): string => document.documentElement.lang;

/**
 * Resolve the language to use.
 */
export const resolveCurrentLanguageCode = (): string =>  {
  const autoDetect = globalObj._state._userConfig.language.autoDetect;

  if (autoDetect) {
    debug("CookieConsent [LANG]: autoDetect strategy: \"" + autoDetect + "\"");

    const detectionStrategies = {
      browser: getBrowserLanguageCode(),
      document: getDocumentLanguageCode()
    };
  }

  /**
   * Use current language
   */
  return getCurrentLanguageCode();
};
