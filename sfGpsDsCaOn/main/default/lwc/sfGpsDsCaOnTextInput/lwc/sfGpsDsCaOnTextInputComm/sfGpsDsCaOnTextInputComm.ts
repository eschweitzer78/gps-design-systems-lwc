/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnTextInputComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  name?: string;

  // @ts-ignore
  @api
  value?: string = "";

  // @ts-ignore
  @api
  type?: string = "text";

  // @ts-ignore
  @api
  placeholder?: string;

  // @ts-ignore
  @api
  hintText?: string;

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
  readonly?: boolean;

  // @ts-ignore
  @api
  charWidth?: string;

  // @ts-ignore
  @api
  minLength?: number;

  // @ts-ignore
  @api
  maxLength?: number;

  // @ts-ignore
  @api
  pattern?: string;

  // @ts-ignore
  @api
  errorMessage?: string;

  // @ts-ignore
  @api
  className?: string;

  /* Event handlers */

  handleInput(event: CustomEvent<{ value: string }>): void {
    this.value = event.detail?.value;
    
    this.dispatchEvent(new CustomEvent("inputchange", {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  handleChange(event: CustomEvent<{ value: string }>): void {
    this.value = event.detail?.value;
    
    this.dispatchEvent(new CustomEvent("valuechange", {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  handleBlur(event: CustomEvent<{ value: string }>): void {
    this.dispatchEvent(new CustomEvent("fieldblur", {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  handleFocus(event: CustomEvent<{ value: string }>): void {
    this.dispatchEvent(new CustomEvent("fieldfocus", {
      detail: { value: this.value },
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
