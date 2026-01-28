/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormText from "c/sfGpsDsFormText";
import tmpl from "./sfGpsDsCaOnFormTelephone.html";

/**
 * @slot Telephone
 * @description Ontario Design System Telephone input for OmniStudio forms.
 * Extends the base form text class with Ontario DS styling and tel input type.
 * 
 * This component overrides the standard OmniScript Telephone element to provide
 * Ontario Design System styling while maintaining full OmniStudio functionality.
 * 
 * ## Architecture
 * - Extends: SfGpsDsFormText (base form text with validation mixin)
 * - Uses: c-sf-gps-ds-ca-on-text-input (Ontario styled text input)
 * - Input Type: "tel" for phone number input with appropriate keyboard on mobile
 * 
 * ## Inherited Properties (from OmniScript)
 * - _propSetMap: Contains all element configuration from OmniScript designer
 * - _name: Element name for data binding
 * - elementValue: Current input value
 * - _maxLength, _minLength: Length constraints
 * - _patternVal: Regex pattern for validation
 * 
 * ## Validation
 * - Inherits validation from SfGpsDsOmniHasValidationMixin
 * - sfGpsDsErrorMessage: Displays appropriate error based on validation state
 * - Supports pattern matching for phone formats
 * 
 * ## Events
 * - handleBlur: Triggered on input blur, updates validation state
 * - handleChange: Triggered on value change, updates OmniScript data
 * - handleInput: Triggered on each keystroke for real-time validation
 * 
 * ## OmniScript Registration
 * Register in your OmniScript LWC override:
 * ```javascript
 * import sfGpsDsCaOnFormTelephone from "c/sfGpsDsCaOnFormTelephone";
 * 
 * static elementTypeToLwcConstructorMap = {
 *   ...OmniscriptBaseOsrt.elementTypeToLwcConstructorMap,
 *   "Telephone": sfGpsDsCaOnFormTelephone,
 * };
 * ```
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-input styling via sfGpsDsCaOnTextInput
 * - WCAG 2.1 AA: Proper labeling, error messaging, keyboard support, 
 *               tel input type provides appropriate mobile keyboard
 */
export default class SfGpsDsCaOnFormTelephone extends SfGpsDsFormText {
  /* ========================================
   * LIFECYCLE METHODS
   * ======================================== */

  /**
   * Renders the Ontario-specific template.
   * @returns {Object} The imported HTML template
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes the component when added to DOM.
   * Sets up Ontario DS-specific styling classes.
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // Set read-only styling class for Ontario DS
    this._readOnlyClass = "sfgpsdscaon-read-only";
    
    // Add Ontario DS scope class for CSS isolation
    this.classList.add("caon-scope");
  }
}
