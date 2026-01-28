/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormMultiselect from "c/sfGpsDsFormMultiselect";
import tmpl from "./sfGpsDsCaOnFormMultiselect.html";

/**
 * @slot Multiselect
 * @description Ontario Design System Multiselect for OmniStudio forms.
 * Uses checkbox group pattern from Ontario DS.
 * Allows multiple selections from a list of options.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses sfGpsDsCaOnCheckboxGroup component
 * - WCAG 2.1 AA: Proper fieldset/legend, keyboard navigation
 */
export default class SfGpsDsCaOnFormMultiselect extends SfGpsDsFormMultiselect {
  /* computed */

  get decoratedOptions() {
    const selected = Array.isArray(this.elementValue) 
      ? this.elementValue 
      : this.elementValue 
        ? [this.elementValue] 
        : [];

    return (this._realtimeOptions || []).map((opt, index) => ({
      ...opt,
      id: `${this._name}-opt-${index}`,
      checked: selected.includes(opt.value)
    }));
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
