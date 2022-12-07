/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const styleClass = {
  dark: "nsw-button-dark",
  "dark-outline": "nsw-button-dark-outline",
  "dark-outline-solid": "nsw-button-dark-outline-solid",
  light: "nsw-button-light",
  "light-outline": "nsw-button-light-outline",
  white: "nsw-button-white",
  danger: "nsw-button-danger"
};
export default class SfGpsDsAuNswButton extends LightningElement {
  @api link;
  @api cstyle = "dark"; // oneOf(['dark', 'dark-outline', 'dark-outline-solid', 'light', 'light-outline','white','danger']
  @api type;
  @api block = false;
  @api className;
  @api label;

  get computedClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button-block": this.block,
      [styleClass[this.cstyle]]: this.cstyle,
      [this.className]: this.className
    });
  }

  handleClick() {
    const clickEvent = new CustomEvent("click");
    this.dispatchEvent(clickEvent);
  }
}
