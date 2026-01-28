/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

interface CheckboxOption {
  value: string;
  label: string;
}

export default class SfGpsDsCaOnCheckboxGroupComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  legend?: string;

  // @ts-ignore
  @api
  name?: string;

  // @ts-ignore
  @api
  hintText?: string;

  // @ts-ignore
  @api
  optionsJson?: string;

  // @ts-ignore
  @api
  required?: boolean;

  // @ts-ignore
  @api
  optional?: boolean;

  // @ts-ignore
  @api
  disabled?: boolean;

  // @ts-ignore
  @api
  errorMessage?: string;

  // @ts-ignore
  @api
  className?: string;

  _value: string[] = [];

  get parsedOptions(): CheckboxOption[] {
    if (!this.optionsJson) return [];
    
    try {
      const parsed = JSON.parse(this.optionsJson);
      if (Array.isArray(parsed)) {
        return parsed.map(item => ({
          value: String(item.value || ""),
          label: String(item.label || item.value || "")
        }));
      }
      return [];
    } catch (e) {
      this.addError("OPT-JP", "Options JSON is invalid. Expected format: [{\"value\":\"val1\",\"label\":\"Label 1\"}]");
      return [];
    }
  }

  /* Event handlers */

  handleChange(event: CustomEvent<{ value: string[] }>): void {
    this._value = event.detail?.value || [];
    
    this.dispatchEvent(new CustomEvent("valuechange", {
      detail: { value: this._value },
      bubbles: true,
      composed: true
    }));
  }

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
