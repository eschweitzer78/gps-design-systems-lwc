/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "omnistudio/input";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicInputOsN.html";

export default class SfGpsDsAuVicInputOsN extends OmniscriptInput {
  @api formGroupAddlClassName;
  @api labelClassName;

  render() {
    return tmpl;
  }

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-au-vic-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-au-vic-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-au-vic-datetime-picker-os-n";
        break;

      default:
    }
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      [this.formGroupAddlClassName]: this.formGroupAddlClassName,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required
    });
  }

  get computedCheckboxClassName() {
    return computeClass({
      "rpl-checkbox__box": true,
      "rpl-checkbox__box--checked": this.checked
    });
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }

  /* event center */
  _handleOnBlur(e) {
    super.validateError(e);
    this.dispatchEvent(
      new CustomEvent("internalblur", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnChange(e) {
    super.triggerEvent(e);
    this.dispatchEvent(
      new CustomEvent("internalchange", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnFocus(e) {
    super.handleFocus(e);
    this.dispatchEvent(
      new CustomEvent("internalfocus", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnKeyDown(e) {
    super.triggerKeyEvents(e);
    this.dispatchEvent(
      new CustomEvent("internalkeydown", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnInput(e) {
    super.triggerInputEvent(e);
    this.dispatchEvent(
      new CustomEvent("internalinput", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnKeyPress(e) {
    this.dispatchEvent(
      new CustomEvent("internalkeypress", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnKeyUp(e) {
    super.triggerKeyEvents(e);
    this.dispatchEvent(
      new CustomEvent("internalkeyup", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
  _handleOnPaste(e) {
    this.dispatchEvent(
      new CustomEvent("internalpaste", {
        detail: {
          value: e.target.value,
          selectionStart: e.target.selectionStart,
          selectionEnd: e.target.selectionEnd,
          which: e.which
        }
      })
    );
  }
}
