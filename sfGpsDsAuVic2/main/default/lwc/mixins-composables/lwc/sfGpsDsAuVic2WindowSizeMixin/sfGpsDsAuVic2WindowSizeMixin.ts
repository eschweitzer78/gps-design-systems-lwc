import { LightningElement, track } from "lwc";

import type { 
  WindowSize, 
  WindowSizeItf 
} from "c/sfGpsDsAuVic2WindowSizeMixin";

const HANDLE_WINDOW_RESIZE = Symbol("_handleWindowResize");

export default 
function WindowSizeMixin<T extends LightningElement>(
  base: new (...args: any[]) => LightningElement
): new (...args: any[]) => WindowSizeItf & T {
  // @ts-ignore
  return class WindowSizeMixin extends base {
    //@ts-ignore
    @track 
    _windowSize?: WindowSize;

    [HANDLE_WINDOW_RESIZE] = () => {
      this._windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    connectedCallback() {
      super.connectedCallback?.();

      this[HANDLE_WINDOW_RESIZE]();
      window.addEventListener("resize", this[HANDLE_WINDOW_RESIZE]);
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this[HANDLE_WINDOW_RESIZE]);
      super.disconnectedCallback?.();
    }
  };
}