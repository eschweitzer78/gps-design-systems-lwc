
import { globalObj } from "./core-global";
import type { UserConfig } from "c/sfGpsDsCookieConsent";
import { debug, getKeys, isObject, fetchCategoriesAndServices } from "./utils-general";
import { OPT_OUT_MODE } from "./utils-constants";

export const setConfig = (userConfig: UserConfig) => {
  const { _config, _state } = globalObj;

  const
    config = _config,
    state = _state,
    { cookie } = config,
    callbacks = globalObj._callbacks,
    userCookieConfig = userConfig.cookie,
    userCategories = userConfig.categories,
    allCategoryNames = getKeys(userCategories) || [],
    nav = navigator;

  cookie.domain = location.hostname;

  /**
   * Make user configuration globally available
   */
  state._userConfig = userConfig;
  state._allDefinedCategories = userCategories;
  state._allCategoryNames = allCategoryNames;

  /**
   * Save references to callback functions
   */
  callbacks._onFirstConsent = userConfig.onFirstConsent;
  callbacks._onConsent = userConfig.onConsent;
  callbacks._onChange = userConfig.onChange;

  const {
      mode,
      autoClearCookies,
      revision,
      hideFromBots,
  } = userConfig;

  if (mode === OPT_OUT_MODE)
      config.mode = mode;

  if (typeof autoClearCookies === "boolean")
      config.autoClearCookies = autoClearCookies;

  if (typeof revision === "number" && revision >= 0) {
      config.revision = revision;
      state._revisionEnabled = true;
  }

  if (hideFromBots === false)
      config.hideFromBots = false;

  if (config.hideFromBots === true && nav)
      state._botAgentDetected = (nav.userAgent && /bot|crawl|spider|slurp|teoma/i.test(nav.userAgent)) || nav.webdriver;

  if (isObject(userCookieConfig))
      config.cookie = {...cookie, ...userCookieConfig};

  debug("CookieConsent [CONFIG]: configuration:", userConfig);
  debug("CookieConsent [CONFIG]: autoClearCookies:", config.autoClearCookies);
  debug("CookieConsent [CONFIG]: revision enabled:", state._revisionEnabled);

  fetchCategoriesAndServices(allCategoryNames);
};
