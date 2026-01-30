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

export interface DropdownOption {
  value: string;
  label: string;
  selected?: boolean;
}

export default class SfGpsDsCaOnDropdown extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api label?: string;
  // @ts-ignore
  @api name?: string;
  // @ts-ignore
  @api value?: string = "";
  // @ts-ignore
  @api hintText?: string;
  /**
   * Label for the default "Select" option.
   * Defaults to translated "Select" label if not specified.
   */
  // @ts-ignore
  @api defaultOptionLabel?: string;
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

  _options: DropdownOption[] = [];

  // @ts-ignore
  @api
  get options(): DropdownOption[] {
    return this._options;
  }

  set options(value: DropdownOption[]) {
    this._options = value ? [...value] : [];
  }

  _inputId = `select-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `error-${Math.random().toString(36).substring(2, 11)}`;
  _isInvalid = false;

  get computedSelectClassName(): string {
    let classes = "ontario-input ontario-dropdown";
    
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    
    if (this.className) {
      classes += ` ${this.className}`;
    }
    
    return classes;
  }

  get computedAriaDescribedBy(): string | null {
    const ids: string[] = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.errorMessage) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get computedAriaInvalid(): string {
    return this._isInvalid || this.errorMessage ? "true" : "false";
  }

  get showFlag(): boolean {
    return this.required === true || this.optional === true;
  }

  get flagText(): string {
    if (this.required) return LABELS.Common.Required;
    if (this.optional) return LABELS.Common.Optional;
    return "";
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  /**
   * Computed default option label.
   * Uses provided defaultOptionLabel or falls back to translated "Select" label.
   */
  get computedDefaultOptionLabel(): string {
    return this.defaultOptionLabel || LABELS.Common.Select;
  }

  get decoratedOptions(): DropdownOption[] {
    return this._options.map(opt => ({
      ...opt,
      selected: opt.value === this.value
    }));
  }

  /* Public methods for validation */

  // @ts-ignore
  @api
  checkValidity(): boolean {
    const select = this.querySelector("select") as HTMLSelectElement;
    return select ? select.checkValidity() : true;
  }

  // @ts-ignore
  @api
  reportValidity(): boolean {
    const select = this.querySelector("select") as HTMLSelectElement;
    if (select) {
      const isValid = select.checkValidity();
      this._isInvalid = !isValid;
      return isValid;
    }
    return true;
  }

  // @ts-ignore
  @api
  setCustomValidity(message: string): void {
    const select = this.querySelector("select") as HTMLSelectElement;
    if (select) {
      select.setCustomValidity(message);
      this._isInvalid = !!message;
    }
  }

  // @ts-ignore
  @api
  focus(): void {
    const select = this.querySelector("select") as HTMLSelectElement;
    if (select) select.focus();
  }

  /* Event handlers */

  handleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent("change", {
      detail: { value: target.value },
      bubbles: true,
      composed: true
    }));
  }

  handleBlur(event: FocusEvent): void {
    this.reportValidity();
    
    this.dispatchEvent(new CustomEvent("blur", {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  handleFocus(event: FocusEvent): void {
    this.dispatchEvent(new CustomEvent("focus", {
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
