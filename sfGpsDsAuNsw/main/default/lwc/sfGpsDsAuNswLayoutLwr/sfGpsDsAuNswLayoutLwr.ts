import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type {
  Mode
} from "c/sfGpsDsAuNswLayoutLwr";

/**
 * @slot Main
 * @slot Sidebar
 */
export default 
class sfGpsDsAuNswLayoutLwr
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  mode?: Mode;

  // @ts-ignore
  @api 
  sidebarClassName?: string;

  // @ts-ignore
  @api 
  mainClassName?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedShowSidebarLeft(): boolean {
    return this.mode ? this.mode.startsWith("Sidebar Left") : false;
  }

  get computedShowSidebarRight(): boolean {
    return this.mode ? this.mode.startsWith("Sidebar Right") : false;
  }

  get computedClassName(): any {
    return {
      "nsw-layout": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedMainClassName(): any {
    return {
      "nsw-layout__main": true,
      [this.mainClassName || ""]: !!this.mainClassName
    };
  }

  get computedSidebarClassName(): any {
    const sidebar = this.mode ? this.mode.startsWith("Sidebar") : false;
    const desktop = this.mode ? this.mode.endsWith("Desktop") : false;

    return {
      "nsw-layout__sidebar": sidebar,
      "nsw-layout__sidebar--desktop": desktop,
      [this.sidebarClassName || ""]: !!this.sidebarClassName
    };
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
