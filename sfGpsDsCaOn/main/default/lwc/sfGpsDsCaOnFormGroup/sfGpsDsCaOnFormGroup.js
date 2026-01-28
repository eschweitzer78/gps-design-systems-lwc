/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
export default class SfGpsDsCaOnFormGroup extends SfGpsDsLwc {
    static renderMode = "light";
    // @ts-ignore
    @api
    className;
    get computedClassName() {
        return `ontario-form-group ${this.className || ""}`.trim();
    }
    connectedCallback() {
        super.connectedCallback?.();
        this.classList.add("caon-scope");
    }
}
