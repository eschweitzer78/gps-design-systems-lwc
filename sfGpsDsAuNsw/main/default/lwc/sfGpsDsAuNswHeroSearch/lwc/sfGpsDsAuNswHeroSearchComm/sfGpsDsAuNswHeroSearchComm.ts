/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import type SfGpsDsAuNswHeroSearch from "c/sfGpsDsAuNswHeroSearch";
import type { ButtonStyle } from "c/sfGpsDsAuNswHeroSearch";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswHeroSearchComm";

export default 
class SfGpsDsAuNswHeroSearchComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  intro?: string;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  srLabel = "Search site for:";

  // @ts-ignore
  @api 
  srSearchButtonLabel = "Search";

  // @ts-ignore
  @api 
  showLabel?: boolean;
  
  // @ts-ignore
  @api 
  bStyle?: ButtonStyle;

  // @ts-ignore
  @api
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Links markdown"
  });

  /* computed */

  get computedStyle(): string {
    return `background-image: url(${this.image})`;
  }

  /* event management */

  handleSearch(
    event: CustomEvent
  ): void {
    // Navigate to search page using lightning/navigation API:
    // https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation
    // @ts-ignore
    this[NavigationMixin.Navigate]({
      type: "standard__search",
      state: {
        term: (event.target as unknown as SfGpsDsAuNswHeroSearch).value
      }
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
