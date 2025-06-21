/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsMarkdownElement from "c/sfGpsDsMarkdownElement";
import tmpl from "./sfGpsDsAuNswMarkdownElementComm.html";

export default 
class sfGpsDsAuNswMarkdownElementComm
extends SfGpsDsMarkdownElement {
  /* api: content, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get content() {
    // @ts-ignore
    return super.content;
  }

  set content(markdown) {
    // @ts-ignore
    super.content = markdown;
  }

  /* api: className, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get className() {
    // @ts-ignore
    return super.className;
  }

  set className(value) {
    // @ts-ignore
    super.className = value;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
