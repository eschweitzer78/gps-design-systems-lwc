/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  //static renderMode = "light";

  @api links;
  @api title;
  @api description;
  @api copyrightLiner = "Government of Singapore";
  @api lastUpdateDate;
  @api reportVulnerabilityHref = "https://tech.gov.sg/report_vulnerability";
  @api reportVulnerabilityLabel = "Report Vulnerability";
  @api contactHref = "#";
  @api contactLabel = "Contact";
  @api feedbackHref = "#";
  @api feedbackLabel = "Feedback";
  @api privacyHref = "#";
  @api privacyLabel = "Privacy Statement";
  @api termsOfUseHref = "#";
  @api termsOfUseLabel = "Terms of use";

  @api className;

  get computedClassName() {
    return {
      sgds: true,
      footer: true,
      [this.className]: this.className
    };
  }

  get computedFullYear() {
    return new Date().getFullYear();
  }

  /* event management */

  handleClick(event) {
    const index = event.currentTarget.dataset?.ndx;

    if (index) {
      event.preventDefault();

      this.dispatchEvent(
        new CustomEvent("navclick", {
          detail: index
        })
      );
    }
  }
}
