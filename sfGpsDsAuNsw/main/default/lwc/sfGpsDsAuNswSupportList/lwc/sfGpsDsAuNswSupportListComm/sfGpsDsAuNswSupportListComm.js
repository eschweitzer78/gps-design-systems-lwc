/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEPARTMENTS_DEFAULT = [];
const SUPPORTLOGOS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api header = "Supported by";
  @api logoPosition = "labels";
  @api className;

  /* api: departments */

  _departments = DEPARTMENTS_DEFAULT;
  _departmentsOriginal = DEPARTMENTS_DEFAULT;

  @api
  get departments() {
    return this._departmentsOriginal;
  }

  set departments(markdown) {
    try {
      this._departmentsOriginal = markdown;
      this._departments = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Departments markdown");
      this._departments = DEPARTMENTS_DEFAULT;
    }
  }

  /* api: supportLogos */

  _supportLogos = SUPPORTLOGOS_DEFAULT;
  _supportLogosOriginal = SUPPORTLOGOS_DEFAULT;

  @api
  get supportLogos() {
    return this._supportLogosOriginal;
  }

  set supportLogos(markdown) {
    try {
      this._supportLogosOriginal = markdown;
      this._supportLogos = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Support logos markdown");
      this._supportLogos = SUPPORTLOGOS_DEFAULT;
    }
  }
}
