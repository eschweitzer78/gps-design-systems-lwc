/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

const I18N = {
  successDefaultTitle: "Success",
  defaultTitle: "Important"
};
export default class SfGpsDsUkGovNotificationBanner extends LightningElement {
  static renderMode = "light";

  @api type;
  @api headingLevel;
  @api title;
  @api className;

  /* computed: isHx */

  get isH1() {
    return this.headingLevel === 1 || this.headingLevel === "1";
  }

  get isH2() {
    return (this.headingLevel || 2) === 2 || this.headingLevel === "2";
  }

  get isH3() {
    return this.headingLevel === 3 || this.headingLevel === "3";
  }

  get isH4() {
    return this.headingLevel === 4 || this.headingLevel === "4";
  }

  get isH5() {
    return this.headingLevel === 5 || this.headingLevel === "5";
  }

  get isH6() {
    return this.headingLevel === 6 || this.headingLevel === "6";
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "govuk-notification-banner": true,
      "govuk-notification-banner--success": this.type === "success",
      [this.className]: this.className
    });
  }

  /* computed: computedRole */

  get computedRole() {
    return this.type === "success" ? "alert" : "region";
  }

  /* computed: computedTitle */

  get computedTitle() {
    return (
      this.title ||
      (this.type === "success" ? I18N.successDefaultTitle : I18N.defaultTitle)
    );
  }

  /* computed: computedLabelId */

  _labelId;

  get computedLabelId() {
    if (this._labelId == null) {
      this._labelId = uniqueId("sf-gps-ds-uk-gov-notification-banner-label");
    }

    return this._labelId;
  }
}
