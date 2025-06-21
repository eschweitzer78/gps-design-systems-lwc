/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  BStyle 
} from "c/sfGpsDsAuNswDialog";

type BStyleValues = Record<BStyle, string>;

const BSTYLE_DEFAULT: BStyle = "dark";
const BSTYLE_VALUES: BStyleValues = {
  dark: "nsw-button--dark",
  danger: "nsw-button--danger"
};

const ISDISMISSIBLE_DEFAULT = false;

export default 
class SfGpsDsAuNswDialog 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  primaryButtonText?: string;

  // @ts-ignore
  @api 
  secondaryButtonText?: string;

  // @ts-ignore
  @api 
  isOpen: boolean = false;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  bstyle?: BStyle;
  _bstyle = this.defineEnumObjectProperty<string, BStyle>("bstyle", {
    validValues: BSTYLE_VALUES,
    defaultValue: BSTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  isDismissible?: boolean;
  _isDismissible = this.defineBooleanProperty("isDismissible", {
    defaultValue: ISDISMISSIBLE_DEFAULT
  });

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-dialog": true,
      "nsw-dialog--single-action": !this.secondaryButtonText,
      active: this.isOpen,
      [this.className || ""]: !!this.className
    };
  }

  get computedPrimaryButtonClassName(): any {
    return {
      "nsw-button": true,
      [this._bstyle.value]: this._bstyle.value
    };
  }

  _labelledById?: string;

  get computedAriaLabelledById(): string {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-dialog");
    }

    return this._labelledById;
  }

  /* event management */

  // eslint-disable-next-line no-unused-vars
  handlePrimaryClick(
    _event: MouseEvent
  ): void {
    this.dispatchEvent(new CustomEvent("primaryclick"));
  }

  // eslint-disable-next-line no-unused-vars
  handleSecondaryClick(
    _event: MouseEvent
  ): void {
    this.dispatchEvent(new CustomEvent("secondaryclick"));
  }

  // eslint-disable-next-line no-unused-vars
  handleCloseClick(
    _event: MouseEvent
  ): void {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
