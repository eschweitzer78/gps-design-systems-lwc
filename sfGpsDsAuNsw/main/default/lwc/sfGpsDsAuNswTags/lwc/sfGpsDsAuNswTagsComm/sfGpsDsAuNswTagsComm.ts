/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  NavigationMixin 
} from "lightning/navigation";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  TagLink, 
  TagChangeEvent 
} from "c/sfGpsDsAuNswTags";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswTagsComm";

export default 
class SfGpsDsAuNswTagsComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  // @ts-ignore
  @api 
  asCheckboxes: boolean = false;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  links?: string;
  _links = this.defineMarkdownLinksProperty<TagLink>("links", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Links markdown"
  });

  /* event management */

  handleChange(
    event: TagChangeEvent
  ): void {
    let links = [...this._links.value];
    links[event.detail.index].checked = event.detail.checked;
    this._links.value = links;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
