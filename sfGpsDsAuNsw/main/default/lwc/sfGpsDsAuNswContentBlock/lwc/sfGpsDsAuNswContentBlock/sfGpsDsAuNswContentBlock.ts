/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import type { Link } from "c/sfGpsDsMarkdown";

export default 
class SfGpsDsAuNswContentBlock
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  icon?: string;

  // @ts-ignore
  @api 
  mainLink?: string;

  // @ts-ignore
  @api 
  links: Link[] = [];

  // @ts-ignore
  @api 
  className?: string;

  /* api: headline - deprecated, use title instead */

  // @ts-ignore
  @api
  get headline(): string {
    return this.title;
  }

  set headline(value: string) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.title = value;
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-content-block": true,
      [this.className || ""]: !!this.className
    };
  }
}
