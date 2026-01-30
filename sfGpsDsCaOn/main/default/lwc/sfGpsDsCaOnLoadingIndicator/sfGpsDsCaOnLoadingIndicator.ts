/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnLoadingIndicator";

export default class SfGpsDsCaOnLoadingIndicator extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  isLoading?: boolean;
  _isLoading = this.defineBooleanProperty("isLoading", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  overlay?: boolean;
  _overlay = this.defineBooleanProperty("overlay", {
    defaultValue: true
  });

  // @ts-ignore
  @api
  className?: string;

  /* getters */

  /**
   * Computed label that uses translated default if not specified.
   */
  get computedLabel(): string {
    return this.label || LABELS.Common.Loading;
  }

  get computedAriaHidden(): string {
    return this._isLoading.value ? "false" : "true";
  }

  get showOverlay(): boolean {
    return this._overlay.value;
  }

  get computedClassName(): string {
    const classes: string[] = [];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
