declare module "c/sfGpsDsAuNswUtilityList" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
 
  export type ListOrientation = "vertical" | "horizontal";
  
  export interface SocialSharingInfo {
    network: string;
    title: string;
    description?: string;
    hashtags?: string;
    user?: string;
  }

  export default 
  class SfGpsDsAuNswUtilityList 
  extends SfGpsDsElement {
    printLabel: string;
    copyLabel: string;
    copiedLabel: string;
    shareLabel: string;
    shareUrl: string;
    shareConfig: SocialSharingInfo[];
    className: string;

    orientation: ListOrientation;

    // private

    _orientation: PropertyAccessor<string>;

    readonly computedClassName: any;
    readonly computedCopyClassName: any;

    readonly facebook: SocialSharingInfo;
    readonly linkedin: SocialSharingInfo;
    readonly twitter: SocialSharingInfo;
    readonly email: SocialSharingInfo;

    _socialShareId: string;
    readonly computedSocialShareId: string;

    _clipboardCopied: boolean;

    copyToClipboard(): void;
    print(): void;
    toggleShare(): void;

    handleCopyClick(): void;
    handleCopyKeyup(event: KeyboardEvent): void;
    handlePrintClick(): void;
    handlePrintKeyup(event: KeyboardEvent): void;
    handleShareClick(): void;
    handleShareKeyup(event: KeyboardEvent): void;

    anchor: HTMLElement;
  }
}
