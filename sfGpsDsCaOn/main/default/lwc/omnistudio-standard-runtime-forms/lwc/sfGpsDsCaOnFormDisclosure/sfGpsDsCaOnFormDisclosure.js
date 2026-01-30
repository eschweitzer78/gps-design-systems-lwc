/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDisclosure from "c/sfGpsDsFormDisclosure";
import tmpl from "./sfGpsDsCaOnFormDisclosure.html";

/**
 * @slot Disclosure
 * @description Ontario Design System Disclosure component for OmniStudio forms.
 * Displays disclosure content with a required acceptance checkbox.
 * Used for terms and conditions, privacy policies, etc.
 * 
 * Compliance:
 * - LWR: Uses Light DOM pattern
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses Ontario form styling and checkbox pattern
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard accessible
 */
export default class SfGpsDsCaOnFormDisclosure extends SfGpsDsFormDisclosure {
  /* computed */

  get _disclosureId() {
    return `disclosure-${this._name}`;
  }

  get _checkboxId() {
    return `checkbox-${this._name}`;
  }

  get _errorId() {
    return `error-${this._name}`;
  }

  get hasError() {
    return !!this.sfGpsDsErrorMessage;
  }

  get computedCheckboxClassName() {
    let classes = "ontario-checkboxes__input";
    if (this.hasError) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedAriaDescribedBy() {
    const ids = [];
    ids.push(this._disclosureId);
    if (this.hasError) {
      ids.push(this._errorId);
    }
    return ids.join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");
  }
}
