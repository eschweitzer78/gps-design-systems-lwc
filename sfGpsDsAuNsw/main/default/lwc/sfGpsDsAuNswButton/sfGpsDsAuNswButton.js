/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswButton extends LightningElement {
  static renderMode = "light";

  @api label;
  @api link;
  @api cstyle = "dark"; // oneOf(['dark', 'dark-outline', 'dark-outline-solid', 'light', 'light-outline','white','danger']
  @api type = "button";
  @api rendering = "button";
  @api className;

  /* deprecated */

  @api block;

  /* computed */

  get computedClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--dark": this.cstyle === "dark",
      "nsw-button--dark-outline": this.cstyle === "dark-outline",
      "nsw-button--dark-outline-solid": this.cstyle === "dark-outline-solid",
      "nsw-button--light": this.cstyle === "light",
      "nsw-button--light-outline": this.cstyle === "light-outline",
      "nsw-button--white": this.cstyle === "white",
      "nsw-button--danger": this.cstyle === "danger",
      "nsw-button--info": this.cstyle === "info",
      [this.className]: this.className
    });
  }

  get isAnchor() {
    return this.rendering === "a" || this.link;
  }

  get isButton() {
    return this.rendering === "button" && this.link == null;
  }

  handleClick() {
    const clickEvent = new CustomEvent("click");
    this.dispatchEvent(clickEvent);
  }
}
