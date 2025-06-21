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
import { 
  AdaptedNavigationMenuItem 
} from "c/sfGpsDsNavigation";

export default 
class SfGpsDsAuNswLowerFooter 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  items?: AdaptedNavigationMenuItem[];

  // @ts-ignore
  @api 
  statement?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-footer__lower": true,
      [this.className || ""]: !!this.className
    };
  }

  /* event management */

  handleClick(
    event: MouseEvent
  ): void {
    const target = event.currentTarget as HTMLElement;

    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("navclick", {
        detail: target.dataset.ndx
      })
    );
  }
}
