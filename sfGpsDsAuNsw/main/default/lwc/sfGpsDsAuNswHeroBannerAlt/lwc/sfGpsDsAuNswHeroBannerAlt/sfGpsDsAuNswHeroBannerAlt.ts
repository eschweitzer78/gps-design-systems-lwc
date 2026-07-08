/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  api
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

const TITLEPREVENTDEFAULT_DEFAULT = false;

export default 
class SfGpsDsAuNswHeroBannerAlt
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  titleUrl?: string;

  // @ts-ignore
  @api 
  titleLabel?: string;

  // @ts-ignore
  @api 
  imageSrc?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;
  
  // @ts-ignore
  @api
  wrapperClassName?: string;

  // @ts-ignore
  @api
  className?: string;

  // @ts-ignore
  @api
  titlePreventDefault?: boolean;
  _titlePreventDefault = this.defineBooleanProperty("titlePreventDefault", {
    defaultValue: TITLEPREVENTDEFAULT_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-hero-banner-alt": true,
      [this.className || ""]: !!this.className
    };
  }

  /* event management */

  handleTitleClick(
    event: MouseEvent
  ): void {
    if (this._titlePreventDefault.value) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { 
        detail: (event.target as HTMLAnchorElement).href 
      })
    );
  }
}
