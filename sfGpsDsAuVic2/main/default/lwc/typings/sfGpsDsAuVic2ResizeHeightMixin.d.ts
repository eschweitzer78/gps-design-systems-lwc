declare module "c/sfGpsDsAuVic2ResizeHeightMixin" {
  import type { LightningElement } from "lwc";

  export interface ResizeHeightItf {
    handleResizeHeight(height: number): void;
  }

  export default 
  function ResizeHeightMixin<T extends LightningElement>(
    base: new (...args: any[]) => LightningElement,
    resizeRef: string
  ): new (...args: any[]) => ResizeHeightItf & T;
}