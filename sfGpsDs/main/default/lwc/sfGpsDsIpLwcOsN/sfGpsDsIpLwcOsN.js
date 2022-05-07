/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsLwcOsN from 'c/sfGpsDsLwcOsN';
import { api, track } from 'lwc';

//import communityId from '@salesforce/community/Id'; 

const omnistudio_ns = 'omnistudio__';

export default class SfGpsDsIpLwcOsN extends SfGpsDsLwcOsN {
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
  @track _isLoading;
  @track _didLoadOnce;

  _input = {};
  _originalInputJSON;

  @api get inputJSON() {
    return this._originalInputJSON;
  }

  set inputJSON(value) {
    this._originalInputJSON = value;

    try {
      let input = JSON.parse(value || '{}');
      //this._input = { ...input, communityId: communityId };
      // TODO: there is no easy way to get that in omni
      this._input = input;
      this.refreshContent();
    } catch (e) {
      this._options = {};
      this.addError('IJ-BF', 'JSON for input is malformed.');
    }
  }

  _options = {};
  _originalOptionsJSON;

  @api get optionsJSON() {
    return this._originalOptionsJSON;
  }

  set optionsJSON(value) {
    this._originalOptionsJSON = value;

    try {
      this._options = JSON.parse(value || '{}');
      this.refreshContent();
    } catch (e) {
      this._options = {};
      this.addError('OJ-BF', 'JSON for options is malformed.');
    }
  }

  refreshContent() {
    this._isLoading = true;

    if (this._ipName == null) {
      return;
    }


    this.omniRemoteCall({
      sClassName: `${omnistudio_ns}IntegrationProcedureService`,
      sMethodName: this._ipName,
      input: JSON.stringify(this._input),
      options: JSON.stringify(this._options),
    }, false)

      .then((data) => {
        try {
          if (data) {
            if (!Array.isArray(data)) {
              if (data.hasError || data.error) {
                this.addError(
                  'CK-ER',
                  'Integration procedure error: ' +
                    (data.errorMessage || data.error)
                );

                return;
              }

              // the record must have an index property or its deemed empty
              data = data.index ? [data] : [];
            }

            this._items = this.mapIpData(data);
          }

          this.didLoadOnce = true;
        } catch(e) {
          this.addError('CK-EX', 'Issue getting the content collection');
          this._items = [];
        } finally {
          this._isLoading = false;
        }
      })
      .catch((error) => {
        this.addError('CK-EX', `Issue getting the content collection ${error}`);
        this._items = [];
        this._isLoading = false;
      });
  }

  mapIpDate(data) {
    return data;
  }

  connectedCallback() {
    if (!this._ipName) {
      this.addError('IP-NV', 'Integration procedure name is required.');
    }
  }
}
