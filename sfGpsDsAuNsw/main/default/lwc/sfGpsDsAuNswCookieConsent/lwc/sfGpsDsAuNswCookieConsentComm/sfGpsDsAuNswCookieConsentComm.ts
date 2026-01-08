import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import { 
  CookieConsentSection
} from "c/sfGpsDsAuNswCookieConsent";
import CookieConsentAPI from "c/sfGpsDsCookieConsent";
import type { UserConfig } from "c/sfGpsDsCookieConsent";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswCookieConsentComm";

/**
 * @slot Description
 * @slot ConfirmationMessage
 * @slot Tab1Content
 * @slot Tab2Content
 * @slot Tab3Content
 */
export default 
class SfGpsDsAuNswCookieConsentComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api
  title = "";

  // @ts-ignore
  @api
  description?: string;
  _descriptionHtml = this.defineMarkdownContentProperty("description", {
    errorCode: "DE-MD",
    errorText: "Issue when parsing Description markdown."
  });

  // @ts-ignore
  @api
  confirmationMessage?: string;
  _confirmationMessageHtml = this.defineMarkdownContentProperty("confirmationMessage", {
    errorCode: "CM-MD",
    errorText: "Issue when parsing Confirmation message markdown."
  });

  // @ts-ignore
  @api
  acceptAllBtn?: string;

  // @ts-ignore
  @api
  acceptNecessaryBtn?: string;

  // @ts-ignore
  @api
  showPreferencesBtn?: string;

  // @ts-ignore
  @api
  savePreferencesBtn?: string;

  // @ts-ignore
  @api
  dialogTitle?: string;
  
  // @ts-ignore
  @api
  tab1Title?: string;

  // @ts-ignore
  @api
  tab2Title?: string;

  // @ts-ignore
  @api
  tab2Content?: string;
  _tab2ContentHtml = this.defineMarkdownContentProperty("tab2Content", {
    errorCode: "T2-MD",
    errorText: "Issue when parsing Tab 2 content markdown."
  });

  // @ts-ignore
  @api
  tab3Title?: string;

  // @ts-ignore
  @api
  tab3Content?: string;
  _tab3ContentHtml = this.defineMarkdownContentProperty("tab3Content", {
    errorCode: "T3-MD",
    errorText: "Issue when parsing Tab 3 content markdown."
  });

  // @ts-ignore
  @api
  className?: string;

  /* api: sections */

  _configOriginal?: string;
  _config: UserConfig = {};

  // @ts-ignore
  @api
  get config() {
    return this._configOriginal;
  }

  set config(value: string) {
    this._configOriginal = value;

    let targetValue: UserConfig;
    try {
      targetValue = JSON.parse(value);
    } catch(e) {
      targetValue = {};
      this.addError("CO-JS", "Error while parsing the Configuration JSON.");
      console.debug(e);
    }

    const keys = Object.keys(targetValue.categories || {});
    for (let i = 0; i < keys.length; i++) {
      targetValue.categories[keys[i]].enabled = true;
    }

    this._config = targetValue;

    this.initCCAPI()
      .then(() => {
        const preferences = CookieConsentAPI.getUserPreferences();

        if (DEBUG) console.debug(CLASS_NAME, "= setConfig initCCAPI", preferences);

        if (preferences && preferences.acceptedCategories?.length > 0) {
          this._isClosed = true;
        } else {
          this.updateUserPreferences();
        }
      })
      .catch((err) => {
        console.debug(CLASS_NAME, "cookie consent API init failed", err);
      });
  }
  
  /* tracked */

  _isClosed = false;
  _isConfirmed = false;
  _isCCAPIInitialised = false;
  _sections: CookieConsentSection[];

  /* getters */

  get isEmpty(): boolean {
    return false;
  }

  get isOpen(): boolean {
    return !this._isClosed;
  }

  /* methods */


  async initCCAPI(): Promise<boolean | void> {
    if (!this._isCCAPIInitialised) {
      return CookieConsentAPI.run(this._config).then(() => {
        this._isCCAPIInitialised = true;
        this.updateUserPreferences();
        return true;
      });
    }

    return Promise.resolve(true);
  }

  updateUserPreferences() {
    if (DEBUG) console.debug(CLASS_NAME, "> updateUserPreferences");

    if (!this._isCCAPIInitialised) {
      this._sections = [];
    if (DEBUG) console.debug(CLASS_NAME, "< updateUserPreferences", "not initialised");
      return;
    }

    const config = this._config;
    const preferences = CookieConsentAPI.getUserPreferences() || { acceptedCategories: [] };
    
    this._sections = Object.keys(config.categories || {}).map((key: string) => {
      const category = config.categories[key];
      const checked = preferences.acceptedCategories.length > 0
        ? preferences.acceptedCategories.includes(key)
        : category.readOnly

      return {
        ...category,
        linkedCategory: key,
        checked
      }
    });

    if (DEBUG) console.debug(CLASS_NAME, "< updateUserPreferences", JSON.stringify(this._sections));
  }
  
  savePreferences(action: string, categories?: string[]): void {
    const allCategories = this._config ? Object.keys(this._config.categories || {}) : [];
    const excludedCategories = categories ? allCategories.filter((category) => !categories.includes(category)) : [];

    switch (action) {
      case "accept-all":
        CookieConsentAPI.acceptCategory("all");
        this.updateUserPreferences();
        break;

      case "reject-all":
        CookieConsentAPI.acceptCategory([]);
        this.updateUserPreferences();
        break;

      case "accept-selection":
        CookieConsentAPI.acceptCategory(categories, excludedCategories);
        this.updateUserPreferences();
        break;

      default:
        if (DEBUG) console.debug(CLASS_NAME, "savePreferences unhandled action", action);
    }
  }

  /* event management */

  handleConfirmed(event: CustomEvent): void {
    if (DEBUG) {
      console.debug(
        CLASS_NAME, "> handleConfirmed",
        JSON.stringify(event.detail)
      );
    }

    /* do whatever is necessary to save preferences */
    
    if (event.detail) {
      this.savePreferences(event.detail.role, event.detail.sections);
    }

    this._isConfirmed = true;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleConfirmed");
    }
  }

  handleRefresh(): void {
    this.updateUserPreferences();
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");

    const preferences = CookieConsentAPI.getUserPreferences();

    if (preferences.acceptedCategories?.length > 0) {
      this._isClosed = true;
    }


  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._descriptionHtml.value && this.refs.description) {
      replaceInnerHtml(this.refs.description, this._descriptionHtml.value);
    }

    if (this._confirmationMessageHtml.value && this.refs.confirmationMessage) {
      replaceInnerHtml(this.refs.confirmationMessage, this._confirmationMessageHtml.value);
    }

    if (this._tab2ContentHtml.value && this.refs.tab2Content) {
      replaceInnerHtml(this.refs.tab2Content, this._tab2ContentHtml.value);
    }

    if (this._tab3ContentHtml.value && this.refs.tab3Content) {
      replaceInnerHtml(this.refs.tab3Content, this._tab3ContentHtml.value);
    }
  }
}