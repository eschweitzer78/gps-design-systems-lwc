declare module "c/sfGpsDsCookieConsent" {
  export type AcceptType = "all" | "custom" | "necessary";

  export interface CookieItem {
    /**
     * Cookie name
     */
    name: string | RegExp

    /**
     * Expected cookie path
     */
    path?: string

    /**
     * Expected cookie domain. Useful if you want to erase
     * a cookie set in the main domain, from the subdomain.
     */
    domain?: string
  }

  export interface AutoClear {
    /**
     * Array of cookies to clear.
     */
    cookies: CookieItem[]

    /**
     * Reload page after the autoClear function.
     *
     * @default false
     */
    reloadPage?: boolean
  }

  export interface Service {
    /**
     * Custom visible label (can also be html markup).
     */
    label?: string

    /**
     * Callback executed when the service is accepted.
     */
    onAccept?: () => void

    /**
     * Callback executed when the service is rejected
     * (assuming that it was previously enabled).
     */
    onReject?: () => void,

    /**
     * Array of cookies to clear.
     */
    cookies?: CookieItem[]
  }

  export interface UserPreferences {
    /**
     * - all: all categories were accepted
     * - necessary: only the necessary (if any) categories were accepted
     * - custom: a custom selection of categories was accepted
     */
    acceptType: AcceptType

    acceptedCategories: string[]
    rejectedCategories: string[]

    acceptedServices: {[key: string]: string[]}
    rejectedServices: {[key: string]: string[]}
  }

  export interface Category {
    /**
     * Mark category as enabled by default.
     *
     * If mode is set to `"opt-out"` and consent has not yet been expressed, the category
     * is automatically enabled (and scripts under this category will be executed).
     *
     * @default false
     */
    enabled?: boolean

    /**
     * Treat the category as necessary. The user won"t be able to disable the category.
     *
     * @default false
     */
    readOnly?: boolean

    /**
     * Configure individually togglable services.
     */
    services?: {[key: string]: Service}

    /**
     * Declare the cookies to erase when the user rejects the category.
     */
    autoClear?: AutoClear
  }

  export interface CookieValue {
    /**
     * All accepted categories.
     */
    categories: string[]

    /**
     * Last accepted revision number.
     *
     * @default 0
     */
    revision: number

    /**
     * Used to store custom data.
     */
    data: any

    /**
     * Unique UUIDV4 string that identifies the current user.
     */
    consentId: string

    /**
     * User's first consent timestamp.
     */
    consentTimestamp?: string

    /**
     * User's last consent update.
     */
    lastConsentTimestamp?: string

    /**
     * Language code of the consent.
     */
    languageCode: string

    /**
     * All enabled services.
     */
    services: {[key: string]: string[]}

    /**
     * Expiration time of the cookie (in case localstorage is used)
     */
    expirationTime?: number
  }

  export interface CookieOptions {
    /**
     * Cookie name.
     *
     * @default "cc_cookie"
     */
    name?: string

    /**
     * Cookie domain.
     *
     * @default location.hostname
     */
    domain?: string

    /**
     * Cookie path.
     *
     * @default "/"
     */
    path?: string

    /**
     * Cookie sameSite.
     *
     * @default "Lax"
     */
    sameSite?: "Lax" | "Strict" | "None"

    /**
     * Cookie secure flag.
     *
     * @default true
     */
    secure?: boolean

    /**
     * Cookie duration.
     *
     * @default 182
     */
    expiresAfterDays?: number | ((acceptType: AcceptType) => number)

    /**
     * Store the content of the cookie in localstorage
     *
     * @default false
     */
    useLocalStorage?: boolean
  }

  export interface CookieTable {
    /**
     * Table caption
     */
    caption?: string,

    /**
     * Define the table headers (columns).
     */
    headers: {[key: string]: string}

    /**
     * Define the table body items (rows).
     */
    body: {[key: string]: string}[]
  }

  export interface Section {
    /**
     * Section title.
     */
    title?: string

    /**
     * Section description.
     */
    description?: string

    /**
     * Name of a valid category. This will convert the current section into a "togglable" category.
     */
    linkedCategory?: string

    /**
     * Create a custom html table (generally used to clarify cookies).
     */
    cookieTable?: CookieTable
  }

  export interface CookieConsentConfig {
    /**
     * Check out the [docs](https://cookieconsent.orestbida.com/reference/configuration-reference.html#mode) for details.
     *
     * @default "opt-in"
     */
    mode?: "opt-in" | "opt-out"

    /**
     * Manage revisions. Check out the [docs](https://cookieconsent.orestbida.com/reference/configuration-reference.html#revision) for details and examples.
     *
     * @default 0
     */
    revision?: number

    /**
     * Automatically erase cookies when the user opts-out of a category.
     * Check out the [docs](https://cookieconsent.orestbida.com/reference/configuration-reference.html#categories-autoclear).
     *
     * @default true
     */
    autoClearCookies?: boolean

    /**
     * Stop the plugin's execution if a bot/crawler is detected
     * to prevent the indexing of the modal's content.
     *
     * @default true
     */
    hideFromBots?: boolean

    /**
     * Change plugin's default cookie options.
     */
    cookie?: CookieOptions

    /**
     * Callback fired on the very first consent action.
     */
    onFirstConsent?: (param: {
      cookie: CookieValue
    }) => void

    /**
     * Callback fired on the very first consent action
     * and on each page load.
     */
    onConsent?: (param: {
      cookie: CookieValue
    }) => void

    /**
     * Callback fired when categories or services are changed.
     */
    onChange?: (param: {
      cookie: CookieValue
      changedCategories: string[],
      changedServices: {[key: string]: string[]}
    }) => void

    /**
     * Configure cookie categories.
     */
    categories?: {[key: string]: Category}

    /**
     * Configure language and translations.
     */
    language?: {
      /**
       * Default language.
       *
       * E.g. "en"
       */
      default: string,

      /**
       * RTL language(s).
       */
      rtl?: string | string[]

      /**
       * Language detection strategy.
       */
      autoDetect?: "document" | "browser"
    }
  }

  export type UserConfig = CookieConsentConfig;

  const CookieConsentAPI: {
    acceptCategory: (
      categories?: string[] | string, 
      excludedCategories?: string[]
    ) => void;

    acceptedCategory: (
      category: string
    ) => boolean;

    acceptService: (
      service: string | string[], 
      category: string
    ) => boolean;

    acceptedService: (
      service: string, 
      category: string
    ) => boolean;

    eraseCookies: (
      cookies: (string|RegExp|(string|RegExp)[]), 
      path: string, 
      domain: string
    ) => void;

    getUserPreferences: () => UserPreferences;

    setCookieData: (
      props: {
        value: any,
        mode: string
      }
    ) => boolean;

    getCookie: (
      field: string, 
      cookieName?: string
    ) => any;

    getConfig: (
      field: string
    ) => any;

    evalidConsent: () => boolean;
    run: (userConfig: UserConfig) => Promise<void>;
    reset: (deleteCookie: boolean) => void;
  };

  export default CookieConsentAPI;
}