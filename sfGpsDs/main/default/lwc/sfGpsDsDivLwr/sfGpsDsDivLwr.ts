/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* This is a fairly generic, low-level LWR component with up to 12 child divs and slots */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import tmpl from "./sfGpsDsDivLwrDiv.html";
import tmplNoDiv from "./sfGpsDsDivLwrNoDiv.html";

const DEFAULT_NITEMS = 12;

/**
 * @slot Div1
 * @slot Div2
 * @slot Div3
 * @slot Div4
 * @slot Div5
 * @slot Div6
 * @slot Div7
 * @slot Div8
 * @slot Div9
 * @slot Div10
 * @slot Div11
 * @slot Div12
 */
export default 
class SfGpsDsDivLwr
extends SfGpsDsLwc {
  static renderMode: "light"|"shadow" = "light";

  // @ts-ignore
  @api 
  // @ts-ignore
  get id() {
    // @ts-ignore
    return super.id;
  }

  set id(value: string) {
    // @ts-ignore
    super.id = value;
  }

  // @ts-ignore
  @api
  type?: string;

  _nItems?: number;

  // @ts-ignore
  @api 
  get nItems() {
    return this._nItems || DEFAULT_NITEMS;
  }
  
  set nItems(value: number) {
    this._nItems = value;
  }

  // @ts-ignore
  @api
  className?: string;

  // @ts-ignore
  @api
  item1ClassName?: string;

  // @ts-ignore
  @api
  item1Id?: string;

  // @ts-ignore
  @api
  item2ClassName?: string;

  // @ts-ignore
  @api
  item2Id?: string;

  // @ts-ignore
  @api
  item3ClassName?: string;

  // @ts-ignore
  @api
  item3Id?: string;

  // @ts-ignore
  @api
  item4ClassName?: string;

  // @ts-ignore
  @api
  item4Id?: string;

  // @ts-ignore
  @api
  item5ClassName?: string;

  // @ts-ignore
  @api
  item5Id?: string;

  // @ts-ignore
  @api
  item6ClassName?: string;

  // @ts-ignore
  @api 
  item6Id?: string;

  // @ts-ignore
  @api 
  item7ClassName?: string;

  // @ts-ignore
  @api 
  item7Id?: string;

  // @ts-ignore
  @api 
  item8ClassName?: string;

  // @ts-ignore
  @api 
  item8Id?: string;

  // @ts-ignore
  @api 
  item9ClassName?: string;

  // @ts-ignore
  @api 
  item9Id?: string;

  // @ts-ignore
  @api 
  item10ClassName?: string;

  // @ts-ignore
  @api 
  item10Id?: string;

  // @ts-ignore
  @api 
  item11ClassName?: string;

  // @ts-ignore
  @api 
  item11Id?: string;

  // @ts-ignore
  @api 
  item12ClassName?: string;

  // @ts-ignore
  @api 
  item12Id?: string;

  get has2(): boolean {
    return this.nItems >= 2;
  }

  get has3(): boolean {
    return this.nItems >= 3;
  }

  get has4(): boolean {
    return this.nItems >= 4;
  }

  get has5(): boolean {
    return this.nItems >= 5;
  }

  get has6(): boolean {
    return this.nItems >= 6;
  }

  get has7(): boolean {
    return this.nItems >= 7;
  }

  get has8(): boolean {
    return this.nItems >= 8;
  }

  get has9(): boolean {
    return this.nItems >= 9;
  }

  get has10(): boolean {
    return this.nItems >= 10;
  }

  get has11(): boolean {
    return this.nItems >= 11;
  }

  get has12(): boolean {
    return this.nItems >= 12;
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }

  render() {
    return this.type === "no div" ? tmplNoDiv : tmpl;
  }
}
