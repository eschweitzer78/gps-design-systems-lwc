/*
 * Copyright (c) 2022-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSFormFileOsN.html";

export default class SfGpsDsAuNswSFormFileOsN extends SfGpsDsFormFileOsN {
  @track computedAriaDescribedBy;

  get _decoratedValue() {
    if (this._value == null) return null;

    return this._value.map((item) => ({
      ...item,
      _sizeText: this.formatBytes(item.size, 1)
    }));
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this._propSetMap.required
    });
  }

  get computedStyle() {
    if (this.mergedHelpText) {
      return `--sfgpsds-au-nsw-s-form-file-help-text: "${this.mergedHelpText}"`;
    }
    return null;
  }

  /* methods */

  formatBytes(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

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
      this.template.querySelector(".form__help")?.id,
      this.template.querySelector(".form__error")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
