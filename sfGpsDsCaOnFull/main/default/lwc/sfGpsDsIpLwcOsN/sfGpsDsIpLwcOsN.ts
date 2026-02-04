/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* eslint-disable no-unused-vars */

import { 
  api, 
  track 
} from "lwc";
import SfGpsDsLwcOsN from "c/sfGpsDsLwcOsN";
import { 
  isArray, 
  normaliseBoolean 
} from "c/sfGpsDsHelpersOs";

import { 
  OmniscriptBaseMixin
} from "omnistudio/omniscriptBaseMixin";

// Duration after which isLoading is set (which can be used by widgets to show a spinner)
const SPINNER_THRESHOLD = 1000;
const ITEMS_DEFAULT: any[] = [];
const IPACTIVE_DEFAULT = true;
const INPUT_DEFAULT = undefined;
const OPTIONS_DEFAULT = undefined;

const OMNISTUDIO_NS = "omnistudio__";

export default 
class SfGpsDsIpLwcOsN 
extends OmniscriptBaseMixin<SfGpsDsLwcOsN>(SfGpsDsLwcOsN) {
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

    this.omniRemoteCall(
      {
        sClassName: `${OMNISTUDIO_NS}IntegrationProcedureService`,
        sMethodName: this._ipName,
        input: JSON.stringify(this._input),
        //input: { ...this._input, communityId: communityId, communityPreview:... },
        // TODO: there is no easy way to get that in omni
        options: JSON.stringify(this._options)
      },
      false
    )

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

              // the record must have an index property or its deemed empty
              data = data.index ? [data] : [];
            }

            this._items = this.mapIpData(data);
          }

          this._didLoadOnce = true;
        } catch (e) {
          this.addError("CK-EX", "Issue getting the content collection.");
          this._items = ITEMS_DEFAULT;
        } finally {
          this.stoppedLoading();
        }
      })
      .catch((e) => {
        this.addError("CK-EX", `Issue getting the content collection.`);
        this._items = ITEMS_DEFAULT;
        this.stoppedLoading();
        console.debug(e);
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
