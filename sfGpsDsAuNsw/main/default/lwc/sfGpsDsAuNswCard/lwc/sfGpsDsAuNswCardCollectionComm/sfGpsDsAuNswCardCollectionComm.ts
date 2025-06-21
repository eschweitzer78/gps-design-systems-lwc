/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
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
import type { 
  DateStyle, 
  Orientation, 
  CStyle
} from "c/sfGpsDsAuNswCardV2";
import type {
  WidthRatio,
  CardData
} from "c/sfGpsDsAuNswCardCollectionComm";

const I18N = {
  emptyTitle: "No matching content" 
}

export default 
class SfGpsDsAuNswCardCollectionComm
extends SfGpsDsIpLwc {
  // @ts-ignore
  @api cstyle: CStyle = "white";

  // @ts-ignore
  @api headline = false;

  // @ts-ignore
  @api 
  orientation: Orientation = "vertical";

  // @ts-ignore
  @api 
  displayDate: boolean = false;

  // @ts-ignore
  @api 
  dateStyle: DateStyle = "medium";

  // @ts-ignore
  @api 
  xsWidth: WidthRatio = "12";
  // @ts-ignore
  @api 
  smWidth: WidthRatio = "12";
  // @ts-ignore
  @api 
  mdWidth: WidthRatio = "6";
  // @ts-ignore
  @api 
  lgWidth: WidthRatio = "6";
  // @ts-ignore
  @api 
  xlWidth: WidthRatio = "4";

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

  /* api: inputJSON, String */

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

  get computedClassName(): any {
    return {
      "nsw-grid": true,
      [this.className || ""]: !!this.className
    };
  }

  get computedColClassName(): any {
    return {
      "nsw-col": true,
      ["nsw-col-xs-" + this.xsWidth]: !!this.xsWidth,
      ["nsw-col-sm-" + this.smWidth]: !!this.smWidth,
      ["nsw-col-md-" + this.mdWidth]: !!this.mdWidth,
      ["nsw-col-lg-" + this.lgWidth]: !!this.lgWidth,
      ["nsw-col-xl-" + this.xlWidth]: !!this.xlWidth
    };
  }

  get isEmpty(): boolean {
    return (
      this._didLoadOnce && (this._items == null || this._items.length === 0)
    );
  }

  get i18n(): Record<string, string> {
    return I18N;
  }

  /* methods */

  mapIpData(data: object | object[]): CardData[] {
    if (!data) {
      return [];
    }

    if (!isArray(data)) {
      data = [data];
    }

    return (data as object[]).map((card: any, index: number) => ({
      ...card,
      title: card.title || card.headline, // it used to be called headline in v1
      copy: card.copy ? htmlDecode(card.copy) : null,
      footer: card.footer ? htmlDecode(card.footer) : null,
      index: card.index || `card-${index + 1}`
    }));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
