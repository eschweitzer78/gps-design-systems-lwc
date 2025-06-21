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
import { 
  NavigationMixin 
} from "lightning/navigation";

import type { 
  Link 
} from "c/sfGpsDsMarkdown";
import { 
  Rendering,
  CStyle,
  IconStyle,
  Type
} from "c/sfGpsDsAuNswButton";

const LINK_DEFAULT: Link = { 
  text: undefined, 
  url: undefined 
};

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswButtonComm";

export default 
class SfGpsDsAuNswButtonComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  // @ts-ignore
  @api 
  type: Type;

  // @ts-ignore
  @api 
  iconName?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  cstyle?: CStyle;

  // @ts-ignore
  @api 
  iconStyle?: IconStyle;

  // @ts-ignore
  @api 
  rendering?: Rendering;

  // @ts-ignore
  @api 
  disabled: boolean = false;

  // @ts-ignore
  @api 
  mobileFullWidth: boolean = false;


  // @ts-ignore
  @api
  link?: string;
  _link = this.defineMarkdownFirstLinkProperty("link", {
    errorCode: "ML-MD",
    errorText: "Issue when parsing Link markdown"
  });

  /* computed */

  get computedIsButton(): boolean {
    return this.rendering === "button";
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClick(_event: MouseEvent): void {
    if (this._link.value?.url) {
      // @ts-ignore
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: this._link.value?.url
        }
      });
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
