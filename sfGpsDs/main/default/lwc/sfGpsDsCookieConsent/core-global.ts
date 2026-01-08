import type { AcceptType, Category, CookieConsentConfig, UserConfig, CookieValue, Service } from "c/sfGpsDsCookieConsent";
import { 
  COOKIE_NAME, 
  OPT_IN_MODE 
} from "./utils-constants";

export class GlobalState {
  _config: CookieConsentConfig = {
    mode: OPT_IN_MODE,
    revision: 0,

    autoClearCookies: true,
    hideFromBots: true,

    cookie: {
      name: COOKIE_NAME,
      expiresAfterDays: 182,
      domain: "",
      path: "/",
      secure: true,
      sameSite: "Lax"
    }
  };

  _state: {
    _userConfig: UserConfig,
    _currentLanguageCode: string,
    _savedCookieContent: CookieValue,
    _dataEventListeners: {
      _element?: HTMLElement,
      _event: string,
      _listener: Function
    }[],
    _disablePageInteraction: boolean,
    _cookieData: any,
    _consentTimestamp?: Date
    _lastConsentTimestamp?: Date,
    _consentId: string,
    _invalidConsent: boolean,
    _revisionEnabled: boolean,
    _validRevision: boolean,
    _lastChangedCategoryNames: string[],
    _reloadPage: boolean,
    _acceptType?: AcceptType,
    _allDefinedCategories?: Record<string, Category>,
    _allCategoryNames: string[],
    _acceptedCategories: string[],
    _readOnlyCategories: string[],
    _defaultEnabledCategories: string[],
    _botAgentDetected: boolean,
    _allDefinedServices: Record<string, Service>,
    _acceptedServices: Record<string, string[]>,
    _enabledServices: Record<string, string[]>,
    _lastChangedServices: Record<string, string[]>
    _lastEnabledServices: Record<string, string[]>
  } = {
    _userConfig: {},
    _currentLanguageCode: "",
    _savedCookieContent: null,
    _dataEventListeners: [],
    _disablePageInteraction: false,
    _cookieData : null,
    _consentTimestamp: null,
    _lastConsentTimestamp: null,
    _consentId: "",
    _invalidConsent : true,
    _revisionEnabled : false,
    _validRevision : true,
    _lastChangedCategoryNames : [],
    _reloadPage : false,
    _acceptType: null,
    _allDefinedCategories: null,
    _allCategoryNames: [],
    _acceptedCategories : [],
    _readOnlyCategories : [],
    _defaultEnabledCategories : [],
    _botAgentDetected : false,
    _allDefinedServices: {},
    _acceptedServices: {},
    _enabledServices: {},
    _lastChangedServices: {},
    _lastEnabledServices: {},
  };

  _callbacks: {
    _onFirstConsent?: Function,
    _onConsent?: Function,
    _onChange?: Function
  } = {};

  _customEvents = {
    _onFirstConsent: "cc:onFirstConsent",
    _onConsent: "cc:onConsent",
    _onChange: "cc:onChange",
  };
}

export const globalObj = new GlobalState();