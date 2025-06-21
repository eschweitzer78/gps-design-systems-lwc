/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsAuNswBreadcrumbsComm from "c/sfGpsDsAuNswBreadcrumbsComm";
import tmpl from "./sfGpsDsAuNswBreadcrumbsLwr.html";

export default 
class SfGpsDsAuNswBreadcrumbsLwr 
extends SfGpsDsAuNswBreadcrumbsComm {
  // @ts-ignore
  @api 
  containerClassName = "nsw-container nsw-p-bottom-sm";

  // @ts-ignore
  @api
  // @ts-ignore
  get label() {
  // @ts-ignore
    return super.label;
  }

  set label(value) {
    // @ts-ignore
    super.label = value;
  }

  // @ts-ignore
  @api
  // @ts-ignore
  get linkComponent() {
    // @ts-ignore
    return super.linkComponent;
  }

  set linkComponent(value) {
    // @ts-ignore
    super.linkComponent = value;
  }

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

  // @ts-ignore
  @api
  // @ts-ignore
  get items() {
    // @ts-ignore
    return super.items;
  }

  set items(markdown) {
    // @ts-ignore
    super.items = markdown;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
