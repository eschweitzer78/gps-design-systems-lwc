/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFile from "c/sfGpsDsFormFileOsN";
import SfGpsDsAuQldStatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";
import { isArray } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuQldFormFileOsN.html";

const FA_CLASS = "fa"; // vs fa-light
const FA_TYPE_MAPPING = {
  pdf: "-pdf",
  doc: "-word",
  docx: "-word",
  png: "-image",
  jpg: "-image",
  jpeg: "-image",
  xls: "-excel",
  xlxs: "-excel",
  csv: "-csv",
  mp4: "-video",
  mov: "-video",
  avi: "-video",
  zip: "-zipper"
};
export default class extends SfGpsDsAuQldStatusHelperMixin(SfGpsDsFormFile) {
  @track computedAriaDescribedBy;

  /* getters */

  get decoratedValue() {
    return isArray(this._value)
      ? this._value.map((item) => ({
          ...item,
          _iconClassName: `${FA_CLASS} fa-2x fa-file${this.getFaClassForFileType(item.filename.split(".").pop())}`,
          _deleteIconClassName: `${FA_CLASS} fa-trash`,
          _sizeStatement: `${Math.ceil((item.size || 0) / 1000)}KB`
        }))
      : [];
  }

  get computedFileInputClassName() {
    return {
      "omni-file": true,
      "sfgpsds-form-file-has-error": this._showValidation
    };
  }

  /* methods */

  getFaClassForFileType(type) {
    return FA_TYPE_MAPPING[("" + type).toLocaleLowerCase()] || "";
  }

  /* lifecycle */

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      ...this.template.querySelectorAll(".qld__hint-text")
    ]
      .map((item) => item.id)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
