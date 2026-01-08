declare module "c/sfGpsDsAuNswCookieConsent" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export interface CookieConsentSection {
    title?: string;
    description?: string;
    linkedCategory?: string;
    checked?: boolean,
    readOnly?: boolean;
  }

  export interface DecoratedCookieConsentSection extends CookieConsentSection {
    _key: string;
  }

  export default 
  class SfGpsDsAuNswCookieConstent
  extends SfGpsDsElement {
    // title

    acceptAllBtn?: string;
    acceptNecessaryBtn?: string;
    showPreferencesBtn?: string;
    modalTitle?: string;
    dialogAcceptAllBtn?: string;
    dialogAcceptNecessaryBtn?: string;
    dialogSavePreferencesBtn?: string;
    dialogTab1Title?: string;
    dialogTab2Title?: string;
    dialogTab3Title?: string;
    isBannerRendered?: boolean;
    isDialogRendered?: boolean;
    isLoading?: boolean;
    isEmpty?: boolean;
    isConfirmed?: boolean;
    className?: string;
    
    get sections(): CookieConsentSection[];
    set sections(value: CookieConsentSection[]);

    showBanner(): void;
    showDialog(): void;
    
    // private

    _isBannerRendered: PropertyAccessor<boolean>;
    _isDialogRendered: PropertyAccessor<boolean>;
    _isLoading: PropertyAccessor<boolean>;
    _isEmpty: PropertyAccessor<boolean>;
    _isConfirmed: PropertyAccessor<boolean>;

    _sectionsOriginal: any;
    _sections: DecoratedCookieConsentSection[];

    _value?: string[];
    _isDialogOpen: boolean;
    _hasConfirmationMessage: boolean;
    _uid?: string;

    get i18n(): Record<string, string>;
    get uid(): string;
    get computedClassName(): any;
    get computedIsNotConfirmed(): boolean;
    get computedHasCtaButtons(): boolean;

    handleCMSlotChange(event: Event): void;
    handleBannerClick(event: MouseEvent): void;
    handleDialogClick(event: MouseEvent): void;
  }
}