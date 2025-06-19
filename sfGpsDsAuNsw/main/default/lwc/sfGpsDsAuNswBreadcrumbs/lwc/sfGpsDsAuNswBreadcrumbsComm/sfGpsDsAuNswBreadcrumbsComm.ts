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

const ITEMS_DEFAULT = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswBreadcrumbsComm";

export default 
class sfGpsDsAuNswBreadcrumbsComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label: string = "Breadcrumb";

  // @ts-ignore
  @api 
  linkComponent: string = "a";
  
  // @ts-ignore
  @api 
  className: string = "";

  // @ts-ignore
  @api 
  items: string;
  _items = this.defineMarkdownLinksProperty("items", {
    errorCode: "IT-MD",
    errorText: "Issue when parsing Items markdown",
    defaultValue: ITEMS_DEFAULT
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
