/*
 * Copyright (c) 2024-20245, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";
import { 
  htmlDecode, 
  isArray 
} from "c/sfGpsDsHelpers";
import { 
  CStyle, 
  DateStyle, 
  Orientation 
} from "c/sfGpsDsAuNswCardV2";
import { CardData } from "c/sfGpsDsAuNswCardCarousel";

export default 
class SfGpsDsAuNswCardCarouselComm 
extends SfGpsDsIpLwc {
  // @ts-ignore
  @api 
  accessibilityLabel?: string;

  // @ts-ignore
  @api 
  drag?: boolean;

  // @ts-ignore
  @api 
  justifyContent?: boolean;

  // @ts-ignore
  @api 
  navigation?: "navigation" | "pagination" | "loop";

  // @ts-ignore
  @api 
  navigationItemClassName?: string;

  // @ts-ignore
  @api 
  navigationClassName?: string;

  // @ts-ignore
  @api 
  paginationClassName?: string;

  // @ts-ignore
  @api 
  cstyle: CStyle = "white";

  // @ts-ignore
  @api 
  headline = false;

  // @ts-ignore
  @api 
  orientation: Orientation = "vertical";

  // @ts-ignore
  @api 
  displayDate = false;

  // @ts-ignore
  @api 
  dateStyle: DateStyle = "medium";

  // @ts-ignore
  @api 
  className?: string;

  /* api: ipName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName() {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value) {
    // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON() {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON() {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  /* computed */

  get _isEmpty(): boolean {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  get navigationNavigation(): boolean {
    return this.navigation === "navigation" || this.navigation === "pagination";
  }

  get navigationPagination(): boolean {
    return this.navigation === "pagination";
  }

  get loop(): boolean {
    return this.navigation === "loop";
  }

  /* methods */

  mapIpData(data: any): CardData[] {
    if (!data) {
      return [];
    }

    if (!isArray(data)) {
      data = [data];
    }

    return data.map((card: any, index: number) => ({
      ...card,
      title: card.title || card.headline, // it used to be called headline in v1 and it's not in the payload in v2
      copy: card.copy ? htmlDecode(card.copy) : null,
      footer: card.footer ? htmlDecode(card.footer) : null,
      index: card.index || `card-${index + 1}`,
      cstyle: this.cstyle,
      headline: this.headline,
      orientation: this.orientation,
      dateStyle: this.dateStyle,
      date: this.displayDate ? card.date : null
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
