/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type {
  GridType
} from "c/sfGpsDsAuNswGridLwr";

type GridTypeValues = Record<GridType, string>; 

const TYPE_VALUES: GridTypeValues = {
  default: "",
  spaced: "nsw-grid--spaced",
  flushed: "nsw-grid--flushed"
};

const TYPE_DEFAULT: GridType = "default";

/**
 * @slot Column-1
 * @slot Column-2
 * @slot Column-3
 * @slot Column-4
 * @slot Column-5
 * @slot Column-6
 * @slot Column-7
 * @slot Column-8
 * @slot Column-9
 * @slot Column-10
 * @slot Column-11
 * @slot Column-12
 */
export default 
class sfGpsDsAuNswGridLwr
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  col1ClassName?: string;

  // @ts-ignore
  @api 
  col2ClassName?: string;

  // @ts-ignore
  @api 
  col3ClassName?: string;

  // @ts-ignore
  @api 
  col4ClassName?: string;

  // @ts-ignore
  @api 
  col5ClassName?: string;

  // @ts-ignore
  @api 
  col6ClassName?: string;

  // @ts-ignore
  @api 
  col7ClassName?: string;

  // @ts-ignore
  @api 
  col8ClassName?: string;

  // @ts-ignore
  @api 
  col9ClassName?: string;

  // @ts-ignore
  @api 
  col10ClassName?: string;
  // @ts-ignore
  @api 
  col11ClassName?: string;

  // @ts-ignore
  @api 
  col12ClassName?: string;
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  type?: GridType;
  _type = this.defineEnumObjectProperty<string, GridType>("type", {
    validValues: TYPE_VALUES,
    defaultValue: TYPE_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-grid": true,
      [this._type.value]: this._type.value,
      [this.className || ""]: !!this.className
    };
  }
}
