declare module "c/sfGpsDsAuVic2LayoutBackToTop" {
  import type SfGpsDsElement from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuVic2LayoutBackToTop 
  extends SfGpsDsElement {
    label: string;
    topElementId: string;
    className?: string;

    // private

    scrollY: number;

    get isShown(): boolean;
    get isSticky(): boolean;
    get computedClassName(): any;
    get computedUrl(): string;

    handleScroll(): void;

    _handleScroll?: EventListener;
    _containerEl?: HTMLElement;
  }
}
