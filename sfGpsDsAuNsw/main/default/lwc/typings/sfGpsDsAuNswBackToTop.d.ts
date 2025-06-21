declare module "c/sfGpsDsAuNswBackToTop" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  
  export default 
  class sfGpsDsAuNswBackToTop 
  extends SfGpsDsElement {
    scrollOffset: number;
    className: string;

    // private

    _show?: boolean;
    _width?: number;
    _height?: number;
    _scrollPosition: number;   
    
    get _isMobile(): boolean;

    checkBackToTop(): void;
    resize(): void;

    _listenForScroll: any;
    _listenForResize: any;
  }
}
