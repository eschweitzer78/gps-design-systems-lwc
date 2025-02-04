/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

export default class extends OmniscriptBaseMixin(LightningElement) {
  @api text;
  @api stepName;

  /* event management *
  /
  handleClick() {
    this.omniNavigateTo(this.stepName);
  }

  /* methods/validity */

  @api checkValidity() {
    return true;
  }
}
