/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

const CHAR_WIDTH_VALUES = ["2", "3", "4", "5", "7", "10", "20", "full"];

export default class SfGpsDsCaOnTextInput extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api label?: string;
  // @ts-ignore
  @api name?: string;
  // @ts-ignore
  @api value?: string = "";
  // @ts-ignore
  @api type?: string = "text";
  // @ts-ignore
  @api placeholder?: string;
  // @ts-ignore
  @api hintText?: string;
  // @ts-ignore
  @api required?: boolean;
  // @ts-ignore
  @api optional?: boolean;
  // @ts-ignore
  @api disabled?: boolean;
  // @ts-ignore
  @api readonly?: boolean;
  // @ts-ignore
  @api charWidth?: string;
  // @ts-ignore
  @api minLength?: number;
  // @ts-ignore
  @api maxLength?: number;
  // @ts-ignore
  @api pattern?: string;
  /**
   * HTML5 autocomplete attribute value.
   * Enables browser autofill for common fields, aiding users with mobility impairments.
   * 
   * Common values:
   * - "name", "given-name", "family-name" - Full/first/last name
   * - "email" - Email address
   * - "tel", "tel-national" - Phone numbers
   * - "street-address", "address-line1", "address-line2" - Address
   * - "postal-code" - Postal/ZIP code
   * - "organization" - Company/organization name
   * - "off" - Disable autofill
   * 
   * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   */
  // @ts-ignore
  @api autocomplete?: string;
  // @ts-ignore
  @api showCharacterCount?: boolean;
  _showCharacterCount = this.defineBooleanProperty("showCharacterCount", {
    defaultValue: false
  });
  // @ts-ignore
  @api characterCountThreshold?: number = 75;
  // @ts-ignore
  @api characterCountMode?: string = "remaining"; // "remaining" or "total"
  // @ts-ignore
  @api errorMessage?: string;
  // @ts-ignore
  @api className?: string;

  _inputId = `input-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `error-${Math.random().toString(36).substring(2, 11)}`;
  _charCountId = `char-count-${Math.random().toString(36).substring(2, 11)}`;
  _isInvalid = false;

  get computedInputClassName(): string {
    let classes = "ontario-input";
    
    if (this.charWidth && CHAR_WIDTH_VALUES.includes(this.charWidth)) {
      classes += ` ontario-input--${this.charWidth}-char-width`;
    }
    
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

  get shouldShowCharacterCount(): boolean {
    return this._showCharacterCount.value && !!this.maxLength;
  }

  get currentLength(): number {
    return this.value?.length || 0;
  }

  get computedCharacterCountThreshold(): number {
    return this.characterCountThreshold || 75;
  }

  get computedCharacterCountMode(): string {
    return this.characterCountMode || "remaining";
  }

  /* Public methods for validation */

  // @ts-ignore
  @api
  checkValidity(): boolean {
    const input = this.querySelector("input") as HTMLInputElement;
    return input ? input.checkValidity() : true;
  }

  // @ts-ignore
  @api
  reportValidity(): boolean {
    const input = this.querySelector("input") as HTMLInputElement;
    if (input) {
      const isValid = input.checkValidity();
      this._isInvalid = !isValid;
      return isValid;
    }
    return true;
  }

  // @ts-ignore
  @api
  setCustomValidity(message: string): void {
    const input = this.querySelector("input") as HTMLInputElement;
    if (input) {
      input.setCustomValidity(message);
      this._isInvalid = !!message;
    }
  }

  // @ts-ignore
  @api
  focus(): void {
    const input = this.querySelector("input") as HTMLInputElement;
    if (input) input.focus();
  }

  /* Event handlers */

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    
    this.dispatchEvent(new CustomEvent("input", {
      detail: { value: target.value },
      bubbles: true,
      composed: true
    }));
  }

  handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
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
