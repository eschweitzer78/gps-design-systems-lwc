/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  CStyle, 
  IconStyle, 
  Rendering, 
  Type
} from "c/sfGpsDsAuNswButton";

const CSTYLE_VALUES: CStyle[] = [
  "dark",
  "dark-outline",
  "dark-outline-solid",
  "light",
  "light-outline",
  "white",
  "danger",
  "info"
];
const CSTYLE_DEFAULT: CStyle = "dark";

const ICONSTYLE_NONE: IconStyle = "none";
const ICONSTYLE_BEFORE: IconStyle = "before";
const ICONSTYLE_AFTER: IconStyle = "after";
const ICONSTYLE_VALUES: IconStyle[] = [ICONSTYLE_AFTER, ICONSTYLE_BEFORE, ICONSTYLE_NONE];
const ICONSTYLE_DEFAULT = ICONSTYLE_NONE;

const RENDERING_A: Rendering = "a";
const RENDERING_BUTTON: Rendering = "button";
const RENDERING_VALUES: Rendering[] = [RENDERING_A, RENDERING_BUTTON];
const RENDERING_DEFAULT = RENDERING_BUTTON;

const DISABLED_DEFAULT = false;
const MOBILEFULLWIDTH_DEFAULT = false;

export default 
class SfGpsDsAuNswbutton 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  link?: string;

  // @ts-ignore
  @api
  target?: string;

  // @ts-ignore
  @api 
  type: Type;

  // @ts-ignore
  @api 
  iconName?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  cstyle?: CStyle;
  _cstyle = this.defineEnumProperty<CStyle>("cstyle", {
    validValues: CSTYLE_VALUES,
    defaultValue: CSTYLE_DEFAULT
  });
 
  // @ts-ignore
  @api
  iconStyle?: IconStyle;
  _iconStyle = this.defineEnumProperty<IconStyle>("iconStyle", {
    validValues: ICONSTYLE_VALUES,
    defaultValue: ICONSTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  rendering?: Rendering;
  _rendering = this.defineEnumProperty<Rendering>("rendering", {
    validValues: RENDERING_VALUES,
    defaultValue: RENDERING_DEFAULT
  });

  // @ts-ignore
  @api
  disabled?: boolean;
  _disabled = this.defineBooleanProperty("disabled", {
    defaultValue: DISABLED_DEFAULT
  });

  // @ts-ignore
  @api
  mobileFullWidth?: boolean;
  _mobileFullWidth = this.defineBooleanProperty("mobileFullWidth", {
    defaultValue: MOBILEFULLWIDTH_DEFAULT
  });

  /* deprecated */

  // @ts-ignore
  @api 
  block?: boolean;

  /* computed */

  get computedClassName(): any {
    const rv = {
      "nsw-button": true,
      [`nsw-button--${this._cstyle.value}`]: this._cstyle.value,
      "nsw-button--full-width": this._mobileFullWidth.value,
      [this.className || ""]: !!this.className
    };
    return rv;
  }

  get computedIsAnchor(): boolean {
    return this._rendering.value === RENDERING_A || !!this.link;
  }

  get computedHasIconBefore(): boolean {
    return this._iconStyle.value === ICONSTYLE_BEFORE;
  }

  get computedHasIconAfter(): boolean {
    return this._iconStyle.value === ICONSTYLE_AFTER;
  }

  /* event management */

  handleClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(new CustomEvent("click"));
  }
}
