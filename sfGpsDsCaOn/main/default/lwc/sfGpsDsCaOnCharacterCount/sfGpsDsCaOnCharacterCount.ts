/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnCharacterCount";

export type CharacterCountMode = "remaining" | "total";

const MODE_VALUES: CharacterCountMode[] = ["remaining", "total"];
const MODE_DEFAULT: CharacterCountMode = "remaining";

export default class SfGpsDsCaOnCharacterCount extends SfGpsDsLwc {
  static renderMode = "light";

  /* API properties */

  // @ts-ignore
  @api currentLength?: number = 0;

  // @ts-ignore
  @api maxLength?: number;

  // @ts-ignore
  @api threshold?: number = 75; // Percentage at which to show warning

  // @ts-ignore
  @api mode?: CharacterCountMode;
  _mode = this.defineEnumProperty<CharacterCountMode>("mode", {
    validValues: MODE_VALUES,
    defaultValue: MODE_DEFAULT
  });

  // @ts-ignore
  @api className?: string;

  /* Private properties */

  _countId = `char-count-${Math.random().toString(36).substring(2, 11)}`;

  /* Getters */

  get computedCurrentLength(): number {
    return this.currentLength || 0;
  }

  get computedMaxLength(): number {
    return this.maxLength || 0;
  }

  get remainingCharacters(): number {
    return Math.max(0, this.computedMaxLength - this.computedCurrentLength);
  }

  get percentageUsed(): number {
    if (this.computedMaxLength === 0) return 0;
    return (this.computedCurrentLength / this.computedMaxLength) * 100;
  }

  get isOverLimit(): boolean {
    return this.computedCurrentLength > this.computedMaxLength;
  }

  get isAtWarning(): boolean {
    const thresholdValue = this.threshold || 75;
    return !this.isOverLimit && this.percentageUsed >= thresholdValue;
  }

  get computedClassName(): string {
    let classes = "ontario-character-count";
    
    if (this.isOverLimit) {
      classes += " ontario-character-count--error";
    } else if (this.isAtWarning) {
      classes += " ontario-character-count--warning";
    }
    
    if (this.className) {
      classes += ` ${this.className}`;
    }
    
    return classes;
  }

  get displayText(): string {
    if (this._mode.value === "total") {
      return `${this.computedCurrentLength} of ${this.computedMaxLength} characters`;
    }
    
    // remaining mode
    const remaining = this.remainingCharacters;
    if (this.isOverLimit) {
      const over = this.computedCurrentLength - this.computedMaxLength;
      return `${over} character${over !== 1 ? "s" : ""} over limit`;
    }
    return `${remaining} character${remaining !== 1 ? "s" : ""} remaining`;
  }

  get computedAriaLive(): string {
    // Only announce when at warning or over limit
    return this.isAtWarning || this.isOverLimit ? "polite" : "off";
  }

  get hasMaxLength(): boolean {
    return this.computedMaxLength > 0;
  }

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
