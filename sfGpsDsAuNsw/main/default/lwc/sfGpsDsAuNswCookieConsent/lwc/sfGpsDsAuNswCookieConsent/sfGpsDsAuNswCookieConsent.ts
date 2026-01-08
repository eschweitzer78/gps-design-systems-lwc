import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { isArray, isObject, uniqueId } from "c/sfGpsDsHelpers";

const I18N = {
  title: "Cookie use on our website",
  acceptAllBtn: "Accept all",
  acceptNecessaryBtn: "Only necessary cookies",
  showPreferencesBtn: "Manage your preferences",
  savePreferencesBtn: "Accept current selection",
  closeThisMessage: "Close this message",
  dialogTitle: "Manage cookie preferences",
  loading: "Loading cookies preferences",
  empty: "No cookie preferences found."
}

const ISBANNERRENDERED_DEFAULT = true;
const ISDIALOGRENDERED_DEFAULT = true;
const ISCONFIRMED_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuNswCookieConsent";

import type { 
  CookieConsentSection,
  DecoratedCookieConsentSection
} from "c/sfGpsDsAuNswCookieConsent";

export default 
class SfGpsDsAuNswCookieConsent 
extends SfGpsDsElement {
  // @ts-ignore
  @api
  title: string = I18N.title;

  // @ts-ignore
  @api
  acceptAllBtn?: string = I18N.acceptAllBtn;

  // @ts-ignore
  @api
  acceptNecessaryBtn?: string = I18N.acceptNecessaryBtn

  // @ts-ignore
  @api
  showPreferencesBtn?: string = I18N.showPreferencesBtn;

  // @ts-ignore
  @api
  dialogTitle?: string = I18N.dialogTitle;

  // @ts-ignore
  @api
  dialogAcceptAllBtn?: string = I18N.acceptAllBtn;

  // @ts-ignore
  @api
  dialogAcceptNecessaryBtn?: string = I18N.acceptNecessaryBtn

  // @ts-ignore
  @api
  dialogSavePreferencesBtn?: string = I18N.savePreferencesBtn

  // @ts-ignore
  @api
  dialogTab1Title?: string;

  // @ts-ignore
  @api
  dialogTab2Title?: string;

  // @ts-ignore
  @api
  dialogTab3Title?: string;

  // @ts-ignore
  @api
  isBannerRendered?: boolean = ISBANNERRENDERED_DEFAULT;
  _isBannerRendered = this.defineBooleanProperty("isBannerRendered", {
    defaultValue: ISBANNERRENDERED_DEFAULT
  });

  // @ts-ignore
  @api
  isDialogRendered?: boolean = ISDIALOGRENDERED_DEFAULT;
  _isDialogRendered = this.defineBooleanProperty("isDialogRendered", {
    defaultValue: ISDIALOGRENDERED_DEFAULT
  });

  // @ts-ignore
  @api
  isLoading?: boolean = false;
  _isLoading = this.defineBooleanProperty("isLoading", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  isEmpty?: boolean = false;
  _isEmpty = this.defineBooleanProperty("isEmpty", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  isConfirmed?: boolean = ISCONFIRMED_DEFAULT;
  _isConfirmed = this.defineBooleanProperty("isConfirmed", {
    defaultValue: ISCONFIRMED_DEFAULT
  });

  // @ts-ignore
  @api
  className?: string;

  /* api: sections */

  _sectionsOriginal: any;
  _sections: DecoratedCookieConsentSection[] = [];

  // @ts-ignore
  @api
  get sections() {
    return this._sectionsOriginal;
  }

  set sections(value: CookieConsentSection[]) {
    if (DEBUG) console.debug(CLASS_NAME, "> set sections", JSON.stringify(value));

    this._sectionsOriginal = value;
    
    if (!isArray(value)) {
      if (!isObject(value)) {
        this._sections = [];
        if (DEBUG) console.debug(CLASS_NAME, "< set sections", "empty");
        return;
      }
      
      value = [value as any];
    }

    const uid = this.uid;
    this._sections = value.map((section, index) => ({
      ...section,
      _key: uid + `-${index + 1}`
    }));

    this._value = value
      .filter((section) => section.checked)
      .map((section) => section.linkedCategory);

    if (DEBUG) console.debug(CLASS_NAME, "< set sections", JSON.stringify(this._sections), this._value);
  }

  /* tracked */

  _value?: string[] = [];
  _isDialogOpen = false;
  _hasConfirmationMessage = false;
  _uid?: string;

  /* getters */

  get i18n(): Record<string, string> {
    return I18N;
  }

  get uid(): string {
    if (!this._uid) this._uid = uniqueId("sf-gps-ds-au-nsw-cookie-consent");
    return this._uid;
  }

  get computedClassName(): any {
    return {
      "nsw-cookie-banner": true,
      [this.className || ""]: !!this.className
    }
  }

  get computedIsNotConfirmed(): boolean {
    return !this._isConfirmed.value && this._hasConfirmationMessage;
  }

  get computedHasCtaButtons(): boolean {
    return !!this.acceptAllBtn || !!this.acceptNecessaryBtn;
  }

  /* methods */

  // @ts-ignore
  @api 
  showBanner(): void {
    this.isBannerRendered = true;
    this._isDialogOpen = false;
  }

  // @ts-ignore 
  @api 
  showDialog(): void {
    this.requestRefresh();
    this.isDialogRendered = true;
    this._isDialogOpen = true;
  }

  requestRefresh(): void {
    this.dispatchEvent(new CustomEvent("requestrefresh"));
  }

  /* event management */

  handleCMSlotChange(_event: Event): void {
    this._hasConfirmationMessage = true;
  }

  handleInputClick(_event: MouseEvent): void {
    const nodes: HTMLInputElement[] = Array.from(this.template.querySelectorAll(".nsw-form__checkbox-input"));
    if (DEBUG) console.debug(CLASS_NAME, "> handleInputClick", nodes);
    this._value = nodes.filter((node) => node.checked).map((node) => node.value);
    if (DEBUG) console.debug(CLASS_NAME, "< handleInputClick", this._value);
  }

  handleBannerClick(event: MouseEvent): void {
    const role = (event.target as HTMLElement).dataset.role;

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleClick", role);
    }

    switch (role) {
      case "open-dialog":
        this.requestRefresh();
        this.isDialogRendered = true;
        this._isDialogOpen = true;
        break;

      case "close":
        this.isBannerRendered = false;
        this.isDialogRendered = false;
        break;

      default:
        this.dispatchEvent(new CustomEvent("confirm", {
          detail: {
            role: role,
            sections: this._value
          }
        }));
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleClick");
    }
  }

  handleDialogClick(event: MouseEvent): void {
    const role = (event.target as HTMLElement).dataset.role;

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleDialogClick", role);
    }

    if (role) {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent("confirm", {
        detail: {
          role: role,
          sections: this._value
        }
      }));
    }

    this._isDialogOpen = false;

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleDialogClick");
    }
  }
}