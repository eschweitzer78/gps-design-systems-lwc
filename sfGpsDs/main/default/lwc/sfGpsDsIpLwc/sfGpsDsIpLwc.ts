/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  isArray, 
  normaliseBoolean 
} from "c/sfGpsDsHelpers";

import runIntegrationProcedure from "@salesforce/apex/SfGpsDsIntegrationProcController.runIntegrationProcedure";

// Duration after which isLoading is set (which can be used by widgets to show a spinner)
const SPINNER_THRESHOLD = 1000;
const ITEMS_DEFAULT: any[] = [];
const IPACTIVE_DEFAULT = true;
const INPUT_DEFAULT = undefined;
const OPTIONS_DEFAULT = undefined;

export default 
class SfGpsDsIpLwc 
extends SfGpsDsLwc {
  /* api: ipActive */

  _ipActive = IPACTIVE_DEFAULT;

  // @ts-ignore
  @api
  get ipActive() {
    return this._ipActive;
  }

  set ipActive(value) {
    this._ipActive = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    this.refreshContent();
  }

  /* api: ipName */

  _ipName?: string;

  // @ts-ignore
  @api
  get ipName() {
    return this._ipName;
  }

  set ipName(value) {
    this._ipName = value;
    this.refreshContent();
  }

  /* api: inputJSON */

  _input: object | undefined = INPUT_DEFAULT;
  _inputJSONOriginal: string | undefined = INPUT_DEFAULT;

  // @ts-ignore
  @api
  get inputJSON() {
    return this._inputJSONOriginal;
  }

  set inputJSON(value) {
    this._inputJSONOriginal = value;

    if (value == null) return;

    try {
      this._input = JSON.parse(value || "{}");
      this.refreshContent();
    } catch (e) {
      this._input = INPUT_DEFAULT;
      this.addError("IJ-BF", "JSON for input is malformed.");
      console.debug(e);
    }
  }

  /* api: optionsJSON */

  _options: object | undefined = OPTIONS_DEFAULT;
  _optionsJSONOriginal: string | undefined = OPTIONS_DEFAULT;

  // @ts-ignore
  @api
  get optionsJSON() {
    return this._optionsJSONOriginal;
  }

  set optionsJSON(value) {
    try {
      this._optionsJSONOriginal = value;
      this._options = JSON.parse(value || "{}");
      this.refreshContent();
    } catch (e) {
      this._options = OPTIONS_DEFAULT;
      this.addError("OJ-BF", "JSON for options is malformed.");
      console.debug(e);
    }
  }

  /* track: _items */

  // @ts-ignore
  @track 
  _items: any[] = ITEMS_DEFAULT;

  // @ts-ignore
  @track 
  _didLoadOnce = false;

  // @ts-ignore
  @track 
  _isLoading = false;

  /* methods */

  _nLoading = 0;
  _loadingTimer?: NodeJS.Timeout;

  startedLoading(): void {
    this._nLoading++;

    if (this._loadingTimer == null) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      this._loadingTimer = setTimeout(() => {
        this._isLoading = true;
      }, SPINNER_THRESHOLD);
    }
  }

  stoppedLoading(): void {
    if (this._nLoading > 0) {
      this._nLoading--;
    }

    if (this._nLoading === 0) {
      if (this._loadingTimer) {
        clearTimeout(this._loadingTimer);
        this._loadingTimer = undefined;
      }

      this._isLoading = false;
    }
  }

  refreshContent(): void {
    if (
      !this._ipActive ||
      this._ipName == null ||
      this._input == null ||
      this._options == null
    ) {
      /* 2023-06-01 ESC: do not bother running if not all of ipName, input and options aren't set */
      return;
    }

    this.startedLoading();

    runIntegrationProcedure({
      ipName: this._ipName,
      input: {
        ...(this._input ? this._input : {}),
        communityId: this.communityId,
        communityPreview: this.isPreview
      },
      options: this._options
    })
      .then((data) => {
        try {
          if (data) {
            if (!isArray(data)) {
              if (data.hasError || data.error || data.errorMessage) {
                this.addError(
                  "CK-ER",
                  "Integration procedure error: " +
                    (data.errorMessage || data.error)
                );

                return;
              }

              // IPs tend to send 1 item arrays as an object
              // data = [data]; commented out to leave at consumers discretion
            }

            this._items = this.mapIpData(data);
          }

          this._didLoadOnce = true;
        } catch (e) {
          this.addError("CK-EX", "Issue getting the content collection.");
          console.log("CK-EX", e);
          this._items = ITEMS_DEFAULT;
        } finally {
          this.stoppedLoading();
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error: unknown) => {
        this.addError("CK-RD", "Issue getting the content collection.");
        this._items = ITEMS_DEFAULT;
        this.stoppedLoading();
      });
  }

  mapIpData(
    data: object[] | object
  ): any[] {
    return isArray(data) ? data as object[] : [data];
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();

    if (this._ipActive && !this._ipName) {
      this.addError("IP-NV", "Integration procedure name is required.");
    }

    if (this._ipActive && !this._input) {
      this.addError("IJ-NV", "Input is required.");
    }
  }
}
