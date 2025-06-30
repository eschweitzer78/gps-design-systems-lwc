declare module "c/sfGpsDsAuVic2WindowSizeMixin" {
  import type { LightningElement } from "lwc";

  interface WindowSize {
    width: number,
    height: number
  }

  interface WindowSizeItf {
    _windowSize?: WindowSize;
  }

  export default 
  function WindowSizeMixin<T extends LightningElement>(
    base: new (...args: any[]) => LightningElement
  ): new (...args: any[]) => WindowSizeItf & T;
}