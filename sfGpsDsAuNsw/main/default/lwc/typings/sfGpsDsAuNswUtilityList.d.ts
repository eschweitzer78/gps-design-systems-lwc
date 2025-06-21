declare module "c/sfGpsDsAuNswUtilityList" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
 
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
    shareConfig?: SocialSharingInfo[];
    className?: string;

    orientation: ListOrientation;

    // private

    _orientation: PropertyAccessor<string>;

    get computedClassName(): any;
    get computedCopyClassName(): any;

    get facebook(): SocialSharingInfo | undefined;
    get linkedin(): SocialSharingInfo | undefined;
    get twitter(): SocialSharingInfo | undefined;
    get email(): SocialSharingInfo | undefined;

    _socialShareId?: string;
    get computedSocialShareId(): string;

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

    anchor?: HTMLElement;
  }
}
