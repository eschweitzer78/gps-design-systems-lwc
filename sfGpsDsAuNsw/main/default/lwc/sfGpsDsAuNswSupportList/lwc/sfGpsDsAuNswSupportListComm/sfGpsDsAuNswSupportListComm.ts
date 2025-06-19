/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  Link 
} from "c/sfGpsDsMarkdown";
import type { 
  LogoPosition 
} from "c/sfGpsDsAuNswSupportList";

const DEPARTMENTS_DEFAULT = [];
const SUPPORTLOGOS_DEFAULT = [];

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswSupportListComm";

export default 
class sfGpsDsAuNswSupportListComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  header: string = "Supported by";

  // @ts-ignore
  @api 
  logoPosition: LogoPosition = "labels";
  
  // @ts-ignore
  @api 
  className: string;

  // @ts-ignore
  @api
  departments: Link[];
  _departments = this.defineMarkdownLinksProperty("departments", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Departments markdown",
    defaultValue: DEPARTMENTS_DEFAULT
  });

  // @ts-ignore
  @api
  supportLogos: Link[];
  _supportLogos = this.defineMarkdownLinksProperty("departments", {
    errorCode: "LI-MD",
    errorText: "Issue when parsing Departments markdown",
    defaultValue: SUPPORTLOGOS_DEFAULT
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
