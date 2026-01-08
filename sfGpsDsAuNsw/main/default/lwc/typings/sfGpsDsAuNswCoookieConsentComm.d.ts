import { PropertyAccessor } from "c/sfGpsDsElement";

declare module "c/sfGpsDsAuNswCookieConsentComm" {
  import type SfGpsDsIpLwc from "c/sfGpsDsIpLwc"; 

  export default 
  class SfGpsDsAuNswCookieConstent
  extends SfGpsDsIpLwc {
    // title: string;
    description?: string;
    confirmationMessage?: string;
    acceptAllBtn?: string;
    acceptNecessaryBtn?: string;
    showPreferencesBtn?: string;
    savePreferencesBtn?: string;
    dialogTitle?: string;
    tab1Title?: string;
    tab2Title?: string;
    tab2Content?: string;
    tab3Title?: string;
    tab3Content?: string;
    isConfirmed?: boolean;
    className?: string;
    
    // private

    _descriptionHtml: PropertyAccessor<string>;
    _confirmationMessage: PropertyAccessor<string>;
    _tab2ContentHtml: PropertyAccessor<string>;
    _tab3ContentHtml: PropertyAccessor<string>;

    _isConfirmed?: boolean;

    savePreferences(action: string, value?: string[]): void;

    handleConfirmed(event: CustomEvent): void;
  }
}