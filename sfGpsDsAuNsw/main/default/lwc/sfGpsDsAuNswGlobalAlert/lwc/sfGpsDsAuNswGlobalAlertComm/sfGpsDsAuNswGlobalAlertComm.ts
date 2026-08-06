/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  AlertType, 
  CtaStyle 
} from "c/sfGpsDsAuNswGlobalAlert";


export default 
class SfGpsDsAuNswGlobalAlertComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  alertId?: string;

  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  copy?: string;

  // @ts-ignore
  @api 
  as: AlertType = "default";

  // @ts-ignore
  @api 
  ctaStyle: CtaStyle = "link";

  // @ts-ignore
  @api
  cta?: string;
  _cta = this.defineMarkdownFirstLinkProperty("cta", {
    errorCode: "CT-MD",
    errorText: "Error while parsing Call to action markdown."
  });

  _closedCookieName?: string;
  _closedCookie?: string;

  // @ts-ignore
  @api
  get closedCookie() {
    return this._closedCookie;
  }

  set closedCookie(value) {
    this._closedCookie = value;
    this._closedCookieName = value?.substring(0, value.indexOf("="));
  }

  // @ts-ignore
  @api 
  className?: string;

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClose(
    _event: MouseEvent
  ): void {
    if (this.closedCookie) {
      document.cookie = this.closedCookie;
    }
  }

  get isClosed() {
    return this._closedCookieName && !!this.getCookie(this._closedCookieName);
  }

  get isOpen() {
    return !this.isClosed;
  }

  /* methods */

  getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';');
  
    for (let cookie of cookies) {
      // Remove leading/trailing spaces
      const [cookieName, cookieValue] = cookie.trim().split('=');
    
      // If the name matches, return the decoded value
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return undefined;  
  };

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
