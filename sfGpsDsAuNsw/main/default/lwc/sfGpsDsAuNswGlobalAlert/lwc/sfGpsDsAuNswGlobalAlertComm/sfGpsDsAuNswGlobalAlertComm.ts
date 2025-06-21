/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

import type { 
  AlertType, 
  CtaStyle 
} from "c/sfGpsDsAuNswGlobalAlert";

const CTA_DEFAULT = {};

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswGlobalAlertComm";

export default 
class SfGpsDsAuNswGlobalAlertComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  copy?: string;

  // @ts-ignore
  @api 
  as: AlertType = "default";

  // @ts-ignore
  @api 
  ctaStyle: CtaStyle = "link";

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  cta?: string;
  _cta = this.defineMarkdownFirstLinkProperty("cta", {
    errorCode: "CT-MD",
    errorText: "Error while parsin Call to action markdown."
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
