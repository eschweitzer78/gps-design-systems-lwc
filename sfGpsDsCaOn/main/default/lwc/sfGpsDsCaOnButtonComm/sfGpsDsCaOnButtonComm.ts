/*
 * Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  NavigationMixin 
} from "lightning/navigation";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnButtonComm";

export default 
class SfGpsDsCaOnButtonComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  // @ts-ignore
  @api 
  ariaLabelText?: string;

  // @ts-ignore
  @api 
  elementId?: string;

  // @ts-ignore
  @api 
  htmlType?: string;

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  type?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClick(_event: MouseEvent): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleClick");

    if (this.url) {
      if (this.url.startsWith("#")) {
        // eslint-disable-next-line no-restricted-globals
        location.hash = this.url;
      } else {
        // @ts-ignore
        this[NavigationMixin.Navigate]({
          type: "standard__webPage",
          attributes: {
            url: this.url
          }
        });
      }
      
      if (DEBUG) console.debug(CLASS_NAME, "< handleClick", this.url);
    } else if (DEBUG) console.debug(CLASS_NAME, "< handleClick");

  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
