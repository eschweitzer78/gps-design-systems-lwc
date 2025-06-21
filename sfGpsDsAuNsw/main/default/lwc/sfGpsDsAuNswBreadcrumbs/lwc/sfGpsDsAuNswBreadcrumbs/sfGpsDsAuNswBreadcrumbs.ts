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
  isArray 
} from "c/sfGpsDsHelpers";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";
import type {
  DecoratedLink
} from "c/sfGpsDsAuNswBreadcrumbs";

export default 
class sfGpsDsAuNswBreadcrumbs
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  label: string = "breadcrumbs";

  // @ts-ignore
  @api 
  items: Link[] = [];

  // @ts-ignore
  @api 
  containerClassName: string = "nsw-p-bottom-xs nsw-m-bottom-sm";

  // @ts-ignore
  @api 
  className: string = "";

  // @ts-ignore
  @track 
  _showMore: boolean = false;
  _moreToggleKey: string = "more-toggle";

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-breadcrumbs": true,
      [this.className]: this.className
    };
  }

  get computedOlClassName(): any {
    return {
      "nsw-breadcrumbs__show-all": this._showMore
    };
  }

  get decoratedItems(): DecoratedLink[] {
    if (!isArray(this.items)) {
      return [];
    }

    const length = this.items.length;
    return this.items.map((item, index) => ({
      ...item,
      _isSecond: index === 1 && length > 3
    }));
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handleMoreToggle(_event: MouseEvent): void {
    this._showMore = true;
  }
}
