/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsMarkdownElement from "c/sfGpsDsMarkdownElement";

export default class SfGpsDsAuNswMarkdownElementComm extends SfGpsDsMarkdownElement {
  @api get content() {
    return super.content;
  }

  set content(markdown) {
    super.content = markdown;
  }

  @api get className() {
    return super.className;
  }

  set className(value) {
    super.className = value;
  }

  /* lifecycle */

  render() {
    return super.render();
  }

  connectedCallback() {
    this.classList.add("nsw-scope");
  }
}
