/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  uniqueId, 
  computeClass 
} from "c/sfGpsDsHelpers";

const ISOPEN_DEFAULT = false;

export default 
class SfGpsDsAuNswAccordion
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  index?: string | number;

  // @ts-ignore
  @api 
  header?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* api: closed */

  // @ts-ignore
  @track 
  _isOpen = ISOPEN_DEFAULT;

  // @ts-ignore
  @api
  get closed(): boolean {
    return !this._isOpen;
  }

  set closed(value: boolean) {
    this._isOpen = !value;
  }

  /* getters */

  get computedClassName(): any {
    return {
      "nsw-accordion__title": true,
      "nsw-accordion__open": this._isOpen,
      [this.className || ""]: !!this.className
    };
  }

  get computedButtonClassName(): any {
    return {
      "nsw-accordion__button": true,
      active: this._isOpen
    };
  }

  get computedIsHidden(): string | null {
    return computeClass({
      hidden: !this._isOpen
    });
  }

  _controlsId?: string;

  get computedAriaControlsId() {
    if (!this._controlsId) {
      this._controlsId = uniqueId("sf-gps-ds-au-nsw-accordion");
    }

    return this._controlsId;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleClick(_event: MouseEvent): void {
    this.dispatchEvent(new CustomEvent(
      this._isOpen 
        ? "collapse" 
        : "expand"
    ));
    this._isOpen = !this._isOpen;
  }
}
