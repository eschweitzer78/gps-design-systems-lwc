/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const I18N = {
  supportLinksLabel: "Support links"
};

const COPYRIGHT_MENTION_TEXT_DEFAULT = "Copyright © 2023";
const COPYRIGHT_MENTION_URL_DEFAULT =
  "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/";

export default class SfGpsDsUkGovLowerFooter extends LightningElement {
  static renderMode = "light";

  @api items;
  @api copyrightMentionLink;
  @api className;

  get i18n() {
    return I18N;
  }

  /* computed: computedClassName */

  get computedClassName() {
    return computeClass({
      "govuk-footer__meta": true,
      [this.className]: this.className
    });
  }

  /* computed: copyrightMentionText */

  get copyrightMentionText() {
    return this.copyrightMentionLink?.text || COPYRIGHT_MENTION_TEXT_DEFAULT;
  }

  /* computed: copyrightMentionUrl */

  get copyrightMentionUrl() {
    return this.copyrightMentionLink?.url || COPYRIGHT_MENTION_URL_DEFAULT;
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent("click", {
        detail: event.currentTarget.dataset.ndx
      })
    );
  }
}
