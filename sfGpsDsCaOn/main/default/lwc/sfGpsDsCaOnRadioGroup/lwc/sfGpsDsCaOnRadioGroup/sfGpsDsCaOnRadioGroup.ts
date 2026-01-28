/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export interface RadioOption {
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

interface DecoratedRadioOption extends RadioOption {
  id: string;
}

export default class SfGpsDsCaOnRadioGroup extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api legend?: string;
  // @ts-ignore
  @api name?: string;
  // @ts-ignore
  @api value?: string = "";
  // @ts-ignore
  @api hintText?: string;
  // @ts-ignore
  @api required?: boolean;
  // @ts-ignore
  @api optional?: boolean;
  // @ts-ignore
  @api disabled?: boolean;
  // @ts-ignore
  @api errorMessage?: string;
  // @ts-ignore
  @api className?: string;

  _options: RadioOption[] = [];

  // @ts-ignore
  @api
  get options(): RadioOption[] {
    return this._options;
  }

  set options(value: RadioOption[]) {
    this._options = value ? [...value] : [];
  }

  _groupId = `radiogroup-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `error-${Math.random().toString(36).substring(2, 11)}`;
  _isInvalid = false;

  get computedFieldsetClassName(): string {
    let classes = "ontario-fieldset";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }

  get computedAriaDescribedBy(): string | null {
    const ids: string[] = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.errorMessage) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get showFlag(): boolean {
    return this.required === true || this.optional === true;
  }

  get flagText(): string {
    if (this.required) return "required";
    if (this.optional) return "optional";
    return "";
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get computedName(): string {
    return this.name || this._groupId;
  }

  get decoratedOptions(): DecoratedRadioOption[] {
    return this._options.map((opt, index) => ({
      ...opt,
      id: `${this._groupId}-${index}`,
      checked: opt.value === this.value
    }));
  }

  /* Public methods for validation */

  // @ts-ignore
  @api
  checkValidity(): boolean {
    if (this.required && !this.value) {
      return false;
    }
    return true;
  }

  // @ts-ignore
  @api
  reportValidity(): boolean {
    const isValid = this.checkValidity();
    this._isInvalid = !isValid;
    return isValid;
  }

  // @ts-ignore
  @api
  setCustomValidity(message: string): void {
    this._isInvalid = !!message;
  }

  // @ts-ignore
  @api
  focus(): void {
    const firstRadio = this.querySelector('input[type="radio"]') as HTMLInputElement;
    if (firstRadio) firstRadio.focus();
  }

  /* Event handlers */

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent("change", {
      detail: { value: target.value },
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
