/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { 
  AlertType,
  AlertValue, 
  CtaStyle 
} from "c/sfGpsDsAuNswGlobalAlert";

type AlertValues = Record<AlertType, AlertValue>;

const AS_VALUES: AlertValues = {
  default: {
    main: "",
    button: "nsw-button--white"
  },
  light: {
    main: "nsw-global-alert--light",
    button: "nsw-button--dark"
  },
  critical: {
    main: "nsw-global-alert--critical",
    button: "nsw-button--white"
  }
};
const AS_DEFAULT: AlertType = "default";

const CTASTYLE_LINK: CtaStyle = "link";
const CTASTYLE_BUTTON: CtaStyle = "button";
const CTASTYLE_VALUES: CtaStyle[] = [CTASTYLE_BUTTON, CTASTYLE_LINK];
const CTASTYLE_DEFAULT = CTASTYLE_LINK;

const CTAPREVENTDEFAULT_DEFAULT = false;

export default 
class SfGpsDsAuNswGlobalAlert
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  copy?: string;

  // @ts-ignore
  @api 
  ctaText?: string;

  // @ts-ignore
  @api 
  ctaHref?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @track 
  _isClosed?: boolean;

  // @ts-ignore
  @api 
  as?: AlertType;
  _as = this.defineEnumObjectProperty<AlertValue, AlertType>("as", {
    validValues: AS_VALUES,
    defaultValue: AS_DEFAULT
  });

  // @ts-ignore
  @api 
  ctaStyle?: CtaStyle;
  _ctaStyle = this.defineEnumProperty<CtaStyle>("ctaStyle", {
    validValues: CTASTYLE_VALUES,
    defaultValue: CTASTYLE_DEFAULT
  });

  // @ts-ignore
  @api 
  ctaPreventDefault?: boolean;
  _ctaPreventDefault = this.defineBooleanProperty("ctaPreventDefault", {
    defaultValue: CTAPREVENTDEFAULT_DEFAULT
  });

  /* computed */

  get space(): string {
    return " ";
  }

  get computedClassName(): any {
    return {
      "nsw-global-alert": true,
      [this._as.value.main]: this._as.value,
      [this.className || ""]: !!this.className
    };
  }

  get computedButtonClassName(): any {
    return {
      "nsw-button": true,
      [this._as.value.button]: this._as.value.button
    };
  }

  get _isCtaLinkStyle(): boolean {
    return this._ctaStyle.value === CTASTYLE_LINK;
  }

  get _isCtaButtonStyle(): boolean {
    return this._ctaStyle.value === CTASTYLE_BUTTON;
  }

  /* event management */

  handleCtaClick(
    event: MouseEvent
  ): void {
    if (this._ctaPreventDefault.value) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("ctaclick"));
  }

  // eslint-disable-next-line no-unused-vars
  handleCloseClick(
    _event: MouseEvent
  ): void {
    this._isClosed = true;
    this.dispatchEvent(new CustomEvent("close"));
  }
}
