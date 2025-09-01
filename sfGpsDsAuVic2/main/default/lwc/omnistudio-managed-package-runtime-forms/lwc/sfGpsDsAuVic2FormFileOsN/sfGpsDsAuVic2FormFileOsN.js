/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFile from "c/sfGpsDsFormFileOsN";
import SfGpsDsAuVic2FormElementMixin from "c/sfGpsDsAuVic2FormElementMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVic2FormFileOsN.html";

export default class extends SfGpsDsAuVic2FormElementMixin(SfGpsDsFormFile) {
  @track computedAriaDescribedBy;

  /* computed */

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this._showValidation,
      valid: !this._showValidation,
      required: this._propSetMap.required
    });
  }

  get _decoratedValue() {
    if (this._value == null) return [];

    return this._value.map((item) => ({
      ...item,
      _sizeText: this.formatBytes(item.size, 1),
      _fileExt: item.filename ? item.filename.split(".").pop() : null
    }));
  }

  /* methods */

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["bytes", "kb", "mb", "gb", "tb", "pb", "eb", "zb", "yb"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      this.template.querySelector(".hint")?.id,
      this.template.querySelector(".help-block")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
