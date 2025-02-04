/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsAuNswBreadcrumbsComm from "c/sfGpsDsAuNswBreadcrumbsComm";
import tmpl from "./sfGpsDsAuNswBreadcrumbsLwr.html";

export default class extends SfGpsDsAuNswBreadcrumbsComm {
  @api containerClassName = "nsw-container nsw-p-bottom-sm";

  /* api: label */

  @api
  get label() {
    return super.label;
  }

  set label(value) {
    super.label = value;
  }

  /* api: linkComponent */

  @api
  get linkComponent() {
    return super.linkComponent;
  }

  set linkComponent(value) {
    super.linkComponent = value;
  }

  /* api: className */

  @api
  get className() {
    return super.className;
  }

  set className(value) {
    super.className = value;
  }

  /* api: items */

  @api
  get items() {
    return super.items;
  }

  set items(markdown) {
    super.items = markdown;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}
