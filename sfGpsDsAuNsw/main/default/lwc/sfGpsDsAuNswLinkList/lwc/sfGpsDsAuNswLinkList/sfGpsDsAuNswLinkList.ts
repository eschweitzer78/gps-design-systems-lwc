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

import type { 
  Link, DecoratedLink 
} from "c/sfGpsDsAuNswLinkList";
import { isExternalUrl, uniqueId } from "c/sfGpsDsHelpers";

const FIRSTCHILD_DEFAULT = false;
const HIGHLIGHTEXTERNAL_DEFAULT = false;

const I18N = {
  opensInNewWindow: "opens in new window"
}

export default 
class SfGpsDsAuNswLinkList 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  links?: Link[];
  
  // @ts-ignore
  @api 
  highlightExternal?: boolean;
  _highlightExternal = this.defineBooleanProperty("highlightExternal", {
    defaultValue: HIGHLIGHTEXTERNAL_DEFAULT
  });  

  // @ts-ignore
  @api 
  className?: string;


  // @ts-ignore
  @api 
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-link-list": true,
      [this.className || ""]: !!this.className
    };
  }

  get decoratedList(): DecoratedLink[] {
    const highlightExternal = this._highlightExternal.value;

    return this.links.map((item) => ({
      ...item,
      _isExternalUrl: highlightExternal && isExternalUrl(item.url)
    }));
  }

  _describedById?: string;

  get computedAriaDescribedById(): string {
    if (this._describedById === undefined) {
      this._describedById = uniqueId("sf-gps-ds-au-nsw-link__description");
    }

    return this._describedById;
  }

  get i18n(): Record<string, string> {
    return I18N;
  }
}
