/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswAccordionComm extends SfGpsDsLwc {
  @api index; // only used if part of a group
  @api header;

  // closed

  _closed = true;

  @api get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = value;
  }

  @api content;
  @api className;

  _rendered = false;

  renderedCallback() {
    if (!this._rendered) {
      let element;

      if ((element = this.template.querySelector(".sf-gps-body"))) {
        replaceInnerHtml(element, this.content);
      } else {
        this.addError(
          "CO-PH",
          "Couldn't find internal Content markdown placeholder"
        );
      }

      this._rendered = true;
    }
  }

  handleExpand() {
    this._closed = false;
    this.dispatchEvent(new CustomEvent("expand"));
  }

  handleCollapse() {
    this._closed = true;
    this.dispatchEvent(new CustomEvent("collapse"));
  }
}
