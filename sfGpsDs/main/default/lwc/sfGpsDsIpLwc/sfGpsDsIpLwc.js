/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsLwc from "c/sfGpsDsLwc";
import { api, track } from "lwc";

/* IMPORTANT NOTE: if you modify this class, you have to update sfGpsDsLwcOsN
   as it's not automatically derived */

import communityId from "@salesforce/community/Id";
import cBasePath from "@salesforce/community/basePath";

import runIntegrationProcedure from "@salesforce/apex/sfGpsDsIntegrationProcController.runIntegrationProcedure";

export default class SfGpsDsIpLwc extends SfGpsDsLwc {
  _ipName;

  @api
  get ipName() {
    return this._ipName;
  }

  set ipName(value) {
    this._ipName = value;
    this.refreshContent();
  }

  @track _items = [];

  _nLoading = 0;
  get _isLoading() {
    return this._nLoading > 0;
  }

  @track _didLoadOnce;

  _input;
  _originalInputJSON;

  @api get inputJSON() {
    return this._originalInputJSON;
  }

  set inputJSON(value) {
    this._originalInputJSON = value;

    if (value == null) return;

    try {
      this._input = JSON.parse(value);
      this.refreshContent();
    } catch (e) {
      this._options = {};
      this.addError("IJ-BF", "JSON for input is malformed.");
    }
  }

  _options;
  _originalOptionsJSON;

  @api get optionsJSON() {
    return this._originalOptionsJSON;
  }

  set optionsJSON(value) {
    this._originalOptionsJSON = value;

    try {
      this._options = JSON.parse(value || "{}");
      this.refreshContent();
    } catch (e) {
      this._options = {};
      this.addError("OJ-BF", "JSON for options is malformed.");
    }
  }

  refreshContent() {
    if (this._ipName == null || this._input == null || this._options == null) {
      /* 2023-06-01 ESC: do not bother running if not all of ipName, input and options aren't set */
      return;
    }

    this._nLoading++;

    runIntegrationProcedure({
      ipName: this._ipName,
      input: {
        ...this._input,
        communityId: communityId,
        communityPreview: this.isPreview
      },
      options: this._options
    })
      .then((data) => {
        try {
          if (data) {
            if (!Array.isArray(data)) {
              if (data.hasError || data.error || data.errorMessage) {
                this.addError(
                  "CK-ER",
                  "Integration procedure error: " +
                    (data.errorMessage || data.error)
                );

                return;
              }

              // IPs tend to send 1 item arrays as an object
              // data = [data];
            }

            this._items = this.mapIpData(data);
          }

          this.didLoadOnce = true;
        } catch (e) {
          this.addError("CK-EX", "Issue getting the content collection.");
          console.log("CK-EX", e);
          this._items = [];
        } finally {
          this._nLoading--;
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        console.log("CK-RD ip error", JSON.stringify(error));
        this.addError("CK-RD", "Issue getting the content collection.");
        this._items = [];
        this._nLoading--;
      });
  }

  mapIpData(data) {
    return data;
  }

  get communityBasePath() {
    return cBasePath;
  }

  get isPreview() {
    return !document.URL.startsWith(cBasePath);
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this._ipName) {
      this.addError("IP-NV", "Integration procedure name is required.");
    }

    if (!this._input) {
      this.addError("IJ-NV", "Input is required.");
    }
  }
}
